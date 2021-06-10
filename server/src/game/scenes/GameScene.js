import queue from 'queue';
import SyncManager from '../../../common/utils/syncUtils';
import { SCALE } from '../../../common/constants';
import Player from '../entities/Player';

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
      active: false,
      cameras: null,
    });

    this.id = 0;
    this.latestTimestamp = new Date(-8640000000000000).toDateString();
  }

  newId() {
    // Generate a new ID for an object
    return this.id++;
  }

  create() {
    // Create groups of entities
    this.playerGroup = this.physics.add.group();

    // Create map and layers without graphics
    const map = this.make.tilemap({
      key: 'map',
    });
    const tiles = map.addTilesetImage('spritesheet', '', 16, 16);
    map.createLayer('Grass', tiles, 0, 0).setScale(SCALE);
    const obstaclesLayer = map.createLayer('Obstacles', tiles, 0, 0).setScale(SCALE);
    obstaclesLayer.setCollisionByProperty({ collides: true });

    // Add physics rules
    this.physics.add.collider(this.playerGroup, obstaclesLayer);

    // Add new player to the world (try to reuse old ones)
    this.events.addListener('addPlayer', (id) => {
      let player = this.playerGroup.getFirstDead();
      if (player) {
        player.revive({
          id: this.newId(),
          x: 200,
          y: 200,
          clientId: id,
        });
      } else {
        player = new Player(this, {
          id: this.newId(),
          x: 200,
          y: 200,
          clientId: id,
        });
        this.playerGroup.add(player);
      }
    });

    // Remove player from the world
    this.events.addListener('removePlayer', (id) => {
      this.playerGroup.children.iterate((player) => {
        if (player.clientId === id) {
          player.kill();
        }
      });
    });

    // Update player
    this.events.addListener('updatePlayer', (update) => {
      this.latestTimestamp = update.timestamp;
      this.playerGroup.children.iterate((player) => {
        if (player.clientId === update.clientId) {
          player.setUpdates({
            ...player.updates,
            controls: update.controls,
          });
        }
      });
    });
  }

  getInitialState() {
    let objects = [];

    SyncManager.prepareFromPhaserGroup(this.playerGroup, objects);

    return objects;

    // TODO encode properly
    return SyncManager.encode(objects);
  }

  update() {
    this.playerGroup.children.iterate((player) => {
      if (player.active) {
        player.update();
      }
    })
  }
};

export default GameScene;