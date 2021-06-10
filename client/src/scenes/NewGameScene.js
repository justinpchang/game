import Phaser from 'phaser';

import '../entities/Player';
import createPlayerAnims from '../anims/PlayerAnims';

import SyncManager from '../../../server/common/utils/syncUtils';
import ControlsUtil from '../../../server/common/utils/controlsUtil';
import {
  SCALE,
  ROT_SPEED,
} from '../constants';

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });

    this.objects = {
      current: {},
      sync: [],
    };

    this.lastControlsPayload = {};
  }

  create() {
    this.scene.run('UIScene');

    this.socket = io('localhost:3000');
    this.otherPlayers = this.physics.add.group();

    // Create map
    this.map = this.make.tilemap({
      key: 'map',
    });

    let tiles = this.map.addTilesetImage('spritesheet', 'tiles', 16, 16, 1, 2);

    this.map.createLayer('Grass', tiles, 0, 0).setScale(SCALE);
    const obstaclesLayer = this.map.createLayer('Obstacles', tiles, 0, 0).setScale(SCALE);
    obstaclesLayer.setCollisionByProperty({ collides: true });

    // Get initial state on start up
    this.socket.emit('sync');

    // Re-get initial state when the window comes in focus
    this.game.events.on('focus', () => this.socket.emit('sync'));

    // Sync client objects against server
    this.socket.on('sync', (objects) => {
      console.log('Sync objects: ', SyncManager.decode(objects));

      if (objects) {
        this.objects.sync = [
          ...this.objects.sync,
          ...SyncManager.decode(objects),
        ];
        this.objects.sync.forEach((obj) => {
          // Create object if it doesn't exist on client
          if (!this.objects.current[obj.id]) {
            const sprite = this.add.sprite(
              obj.x,
              obj.y,
              obj.skin
            ).setScale(SCALE);
            this.objects.current[obj.id] = sprite;
          }

          // Attach camera if object has same clientId
          if (this.objects.current[obj.id].clientId && this.objects.current[obj.id].clientId === this.socket.id) {
            // TODO: fix camera
            this.playerId = obj.id;
            this.cameras.main.startFollow(this.objects.current[obj.id]);
          }
        });
      }
    });

    // Sync again when a new player joins and whenever server tells client
    this.socket.on('pleaseSync', () => this.socket.emit('sync'));

    // Continually force sync in case network issues missed a sync
    this.time.addEvent({
      delay: 10000,
      loop: true,
      callback: () => {
        this.socket.emit('sync');
      },
    });

    // Send controls on any key event
    this.input.keyboard.on('keydown', () => {
      this.sendControls();
    });
    this.input.keyboard.on('keyup', () => {
      this.sendControls();
    });
  }

  sendControls() {
    // Only emit if controls have changed
    const controlsPayload = ControlsUtil.encodeControls(this);
    if (ControlsUtil.hasPayloadChanged(this.lastControlsPayload, controlsPayload)) {
      this.socket.emit('update', controlsPayload);
      this.lastControlsPayload = controlsPayload;
    }
  }

  update() {
    // Update objects
    if (this.objects.sync.length > 0) {
      this.objects.sync.forEach((obj) => {
        if (this.objects.current[obj.id]) {
          let sprite = this.objects.current[obj.id];
          if (!!obj.x) sprite.x = obj.x;
          if (!!obj.y) sprite.y = obj.y;
        }
      });
    }
  }
}

export default GameScene;
