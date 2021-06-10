class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, { id, x, y, clientId }) {
    super(scene, x, y, '');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setFrame(0);

    this.scene = scene;
    this.skin = 'player';
    this.id = id;
    this.clientId = clientId;
    this.prevPosition = { x: -1, y: -1 };
    this.updates = {};
    this.shouldUpdate = true;

    // TODO: use real size
    this.body.setSize(32, 48);
  }

  setUpdates(updates) {
    this.updates = updates;
    this.shouldUpdate = true;
  }

  update() {
    if (!this.active) {
      return;
    }

    if (!this.shouldUpdate) {
      return;
    }
    this.shouldUpdate = false;

    // Handle controls update
    if (this.updates.controls) {
      const {
        leftDown,
        rightDown,
        upDown,
        downDown,
      } = this.updates.controls;

      if (leftDown) {
        this.setVelocityX(-20);
      } else if (rightDown) {
        this.setVelocityX(20);
      } else {
        this.setVelocityX(0);
      }

      if (upDown) {
        this.setVelocityY(-20);
      } else if (downDown) {
        this.setVelocityY(20);
      } else {
        this.setVelocityY(0);
      }
    }
  }
  
  postUpdate() {
    this.prevPosition = { ...this.body.position };
  }

  resetPosition(x, y) {
    this.setPosition(x, y);
  }

  kill() {
    this.setActive(false);
  }

  revive({ id, x, y, clientId }) {
    this.setActive(true);
    this.resetPosition(x, y);
    this.id = id;
    this.clientId = clientId;
  }
}

export default Player;