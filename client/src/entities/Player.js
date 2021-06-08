import Phaser from 'phaser';
import _ from 'lodash';

import {
  SCALE,
  MOVE_SPEED,
} from '../constants';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(socket, scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.knives = null;
    this.nextShotTime = 0;

    // update server with info
    this.socket = socket;
    this.socket.emit("playerMovement", { x, y, flipX: false });

    // play idle animation
    this.anims.play('player-idle', true);
  }

  throwKnife = (mousePointer) => {
    if (!this.knives) {
      return;
    }

    // restrict fire rate
    if (this.nextShotTime < Date.now()) {
      // calculate throw angle
      const theta = Phaser.Math.Angle.Between(this.x, this.y, mousePointer.worldX, mousePointer.worldY);
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

      // set time for next bullet
      this.nextShotTime = Date.now() + 300;
    }
  }

  update({ keyboard, mousePointer }) {
    if (!keyboard || !mousePointer) {
      return;
    }

    const cursorKeys = keyboard.createCursorKeys();

    const leftDown = keyboard.addKey('A').isDown;
    const rightDown = keyboard.addKey('D').isDown;
    const upDown = keyboard.addKey('W').isDown;
    const downDown = keyboard.addKey('S').isDown;
    const shootDown = keyboard.addKey('Space').isDown;

    let movingX = false;
    let theta = null;

    if (leftDown) {
      this.anims.play('player-move-left', true);
      this.flipX = true;
      
      movingX = true;
      theta = -Math.PI;
    } else if (rightDown) {
      this.anims.play('player-move-right', true);
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

    if (!(leftDown || rightDown || upDown || downDown)) {
      // play idle animation
      this.anims.stop();
      this.anims.play('player-idle');

      this.setVelocity(0);
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
    if (shootDown) {
      this.throwKnife(mousePointer);
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