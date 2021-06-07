import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(socket, scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.SPEED = 80;

    // update server with info
    this.socket = socket;
    this.socket.emit("playerMovement", { x, y, flipX: false });

    // play idle animation
  }

  update(keyboard) {
    if (!keyboard) {
      return;
    }

    const leftDown = keyboard.addKey('A').isDown;
    const rightDown = keyboard.addKey('D').isDown;
    const upDown = keyboard.addKey('W').isDown;
    const downDown = keyboard.addKey('S').isDown;

    let velocityX = 0;
    let velocityY = 0;

    if (leftDown) {
      this.anims.play('left', true);
      this.flipX = true;
      
      velocityX = -this.SPEED;
    } else if (rightDown) {
      this.anims.play('right', true);
      this.flipX = false;

      velocityX = this.SPEED;
    }

    if (upDown) {
      if (velocityX === 0) {
        this.anims.play('up', true);
      }
      
      velocityY = -this.SPEED;
    } else if (downDown) {
      if (velocityX === 0) {
        this.anims.play('down', true);
      }

      velocityY = this.SPEED;
    }

    if (!(leftDown || rightDown || upDown || downDown)) {
      // play idle animation
      this.anims.stop();

      velocityX = velocityY = 0;
    }

    this.setVelocity(velocityX, velocityY);

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
      this.socket.emit("playerMovement", { x, y, flipX });
    }
    this.oldPosition = { x, y, flipX };
  }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (socket, x, y, texture, frame) {
  let sprite = new Player(socket, this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
  this.scene.physics.world.enable(sprite);
  sprite.body.setSize(sprite.width, sprite.height);
  return sprite;
});

export default Player;