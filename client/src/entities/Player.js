import Phaser from 'phaser';
import _ from 'lodash';

import {
  SCALE,
  MOVE_SPEED,
  USE_CUSTOM_CURSOR,
} from '../constants';
import Weapon from './Weapon';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(socket, scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.scene = scene;
    this.nextShotTime = 0;
    this.isShooting = false;
    this.keepShooting = false;

    // Add weapon to the player
    this.weapon = new Weapon('knife', scene, socket);

    // update server with info
    this.socket = socket;

    // play idle animation
    this.anims.play('player-idle', true);
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
    if (USE_CUSTOM_CURSOR && this.scene && this.scene.cursor) {
      this.scene.cursor.body.setVelocity(velR.x, velR.y);
    }

    if (!(leftDown || rightDown || upDown || downDown)) {
      // play idle animation
      this.anims.stop();
      this.anims.play('player-idle');

      this.setVelocity(0);
      if (USE_CUSTOM_CURSOR && this.scene && this.scene.cursor) {
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
      const x1 = this.x;
      const y1 = this.y
      const x2 = USE_CUSTOM_CURSOR ? this.scene.cursor.x : mousePointer.worldX;
      const y2 = USE_CUSTOM_CURSOR ? this.scene.cursor.y : mousePointer.worldY;
      this.weapon.fire(x1, y1, x2, y2);
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