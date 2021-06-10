import Phaser from 'phaser';
import _ from 'lodash';

import {
  SCALE,
  MOVE_SPEED,
} from '../constants';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(socket, scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.scene = scene;
    this.knives = null;
    this.nextShotTime = 0;
    this.isShooting = false;
    this.keepShooting = false;

    // update server with info
    this.socket = socket;
    //this.socket.emit("playerMovement", { x, y, flipX: false });

    // play idle animation
    this.anims.play('player-idle', true);
  }

  throwKnife = (mousePointer) => {
    if (!this.knives) {
      return;
    }

    this.isShooting = true;

    // restrict fire rate
    if (this.nextShotTime < Date.now()) {
      // calculate throw angle
      const theta = Phaser.Math.Angle.Between(this.x, this.y, this.scene.cursor.x, this.scene.cursor.y);
      let velR = new Phaser.Math.Vector2();
      velR.setToPolar(theta, MOVE_SPEED * 1.5);

      // fire bullet
      const knife = this.knives.get(this.x, this.y, 'knife');
      if (!knife) {
        return;
      }
      knife.rotation = theta;
      knife.setScale(SCALE);
      knife.setActive(true);
      knife.setVisible(true);
      knife.setVelocity(velR.x, velR.y);

      // emit shoot event
      this.socket.emit('playerShoot', {
        x: knife.x,
        y: knife.y,
        rotation: knife.rotation,
        scale: knife.scale,
        velocityX: velR.x,
        velocityY: velR.y,
      });

      // set time for next bullet
      this.nextShotTime = Date.now() + 300;
    }
  }

  update({ keyboard, mousePointer }) {
    if (!keyboard || !mousePointer) {
      return;
    }

    const leftDown = keyboard.addKey('A').isDown;
    const rightDown = keyboard.addKey('D').isDown;
    const upDown = keyboard.addKey('W').isDown;
    const downDown = keyboard.addKey('S').isDown;
    const shootDown = keyboard.addKey('Space').isDown;
    const shootToggle = Phaser.Input.Keyboard.JustDown(keyboard.addKey('I'));

    let movingX = false;
    let theta = null;

    if (leftDown) {
      this.anims.play('player-move-side', true);
      this.flipX = true;
      
      movingX = true;
      theta = -Math.PI;
    } else if (rightDown) {
      this.anims.play('player-move-side', true);
      this.flipX = false;

      movingX = true;
      theta = 0;
    }

    if (upDown) {
      if (!movingX) {
        this.anims.play('player-move-up', true);
      }
      
      if (theta == null) {
        theta = -Math.PI / 2;
      } else {
        theta += (theta ? 1 : -1) * Math.PI / 4;
      }
    } else if (downDown) {
      if (!movingX) {
        this.anims.play('player-move-down', true);
      }

      if (theta == null) {
        theta = Math.PI / 2;
      } else {
        theta -= (theta ? 1 : -1) * Math.PI / 4;
      }
    }

    let velR = new Phaser.Math.Vector2();
    velR.setToPolar(this.rotation + theta, MOVE_SPEED);
    this.setVelocity(velR.x, velR.y);
    if (this.scene && this.scene.cursor) {
      this.scene.cursor.body.setVelocity(velR.x, velR.y);
    }

    if (!(leftDown || rightDown || upDown || downDown)) {
      // play idle animation
      this.anims.stop();
      this.anims.play('player-idle');

      this.setVelocity(0);
      if (this.scene && this.scene.cursor) {
        this.scene.cursor.body.setVelocity(0);
      }
    }

    // emit player movement
    const x = this.x;
    const y = this.y;
    const flipX = this.flipX;
    if (
      this.oldPosition &&
      (x !== this.oldPosition.x ||
        y !== this.oldPosition.y ||
        flipX !== this.oldPosition.flipX)
    ) {
      this.socket.emit('playerMovement', { x, y, flipX });
    }
    this.oldPosition = { x, y, flipX };

    // handle knife
    if (shootDown || this.keepShooting) {
      this.throwKnife(mousePointer);
    } else {
      this.isShooting = false;
    }

    if (shootToggle) {
      this.keepShooting = !this.keepShooting;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (socket, x, y, texture, frame) {
  let sprite = new Player(socket, this.scene, x, y, texture, frame);
  sprite.setScale(SCALE);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
  this.scene.physics.world.enable(sprite);
  sprite.body.setSize(sprite.width, sprite.height);
  return sprite;
});

export default Player;