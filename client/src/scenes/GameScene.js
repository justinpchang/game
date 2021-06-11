import Phaser from 'phaser';

import '../entities/Player';
import '../entities/Weapon';
import createPlayerAnims from '../anims/PlayerAnims';

import {
  SCALE,
  ROT_SPEED,
  USE_CUSTOM_CURSOR,
} from '../constants';
import Weapon from '../entities/Weapon';

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  create() {
    this.scene.run('UIScene');

    this.socket = io('localhost:3000');
    this.otherPlayers = this.physics.add.group();

    // create map
    this.map = this.make.tilemap({
      key: 'map',
    });

    let tiles = this.map.addTilesetImage('spritesheet', 'tiles', 16, 16, 1, 2);

    this.map.createLayer('Grass', tiles, 0, 0).setScale(SCALE);
    const obstaclesLayer = this.map.createLayer('Obstacles', tiles, 0, 0).setScale(SCALE);
    obstaclesLayer.setCollisionByProperty({ collides: true });

    // create animations
    createPlayerAnims(this.anims);

    // Create server weapons
    this.weapons = Weapon.CreateServerWeapons(this);

    // Create bullets
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      maxSize: 200,
    });
    this.physics.add.collider(this.bullets, obstaclesLayer, this.handleBulletObstacleCollision, undefined, this);

    // listen for web socket events
    this.socket.on(
      'currentPlayers',
      (players) => {
        Object.keys(players).forEach((id) => {
          if (players[id].playerId === this.socket.id) {
            this.player = this.add.player(this.socket, players[id].x, players[id].y, 'player');
            this.cameras.main.startFollow(this.player, true);
            this.physics.add.collider(this.player, obstaclesLayer);
          } else {
            this.addOtherPlayer(players[id]);
          }
        });
      }
    );

    this.socket.on(
      'newPlayer',
      (playerInfo) => {
        this.addOtherPlayer(playerInfo);
      }
    );

    this.socket.on(
      'disconnect',
      (playerId) => {
        const player = this.getOtherPlayer(playerId);
        if (player) {
          player.destroy();
        }
      }
    );

    this.socket.on(
      'playerMoved',
      (playerInfo) => {
        let player = this.getOtherPlayer(playerInfo.playerId);
        if (!player) {
          player = this.addOtherPlayer(playerInfo.playerId);
        }
        player.flipX = playerInfo.flipX;
        player.setPosition(playerInfo.x, playerInfo.y);
      }
    );

    this.socket.on('playerShot', ({ type, rotation, starttime, x1, y1, x2, y2 }) => {
      this.weapons[type].fire(x1, y1, x2, y2, rotation, starttime);
    });

    // capture pointer and get custom cursor
    if (USE_CUSTOM_CURSOR) {
      this.cursor = this.add.sprite(0, 0, 'cursor');
      this.physics.world.enableBody(
        this.cursor,
        Phaser.Physics.Arcade.DYNAMIC_BODY
      );
      this.physics.world.enable(this.cursor);
      this.input.on('pointerdown', () => {
        this.input.mouse.requestPointerLock();
      });
    }
    this.input.on('pointermove', (pointer) => {
      if (this.input.mouse.locked) {
        this.cursor.x += pointer.movementX;
        this.cursor.y += pointer.movementY;
      }
    });
  }

  handleBulletObstacleCollision(obj1, obj2) {
    this.bullets.killAndHide(obj1);
  }

  getOtherPlayer(playerId) {
    return this.otherPlayers.getChildren().find(p => p.playerId === playerId);
  }

  addOtherPlayer(playerInfo) {
    const otherPlayer = this.add.sprite(
      playerInfo.x,
      playerInfo.y,
      'player',
      9
    ).setScale(SCALE);
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer);
    return otherPlayer;
  }

  update() {
    if (this.player) {
      this.player.update(this.input);

      // update camera rotation
      const ccwDown = this.input.keyboard.addKey('Q').isDown;
      const cwDown = this.input.keyboard.addKey('E').isDown;
      if (cwDown) {
        this.cameras.main.rotation -= ROT_SPEED;
        if (USE_CUSTOM_CURSOR) this.cursor.rotation += ROT_SPEED;
        this.player.rotation += ROT_SPEED;
      } else if (ccwDown) {
        this.cameras.main.rotation += ROT_SPEED;
        if (USE_CUSTOM_CURSOR) this.cursor.rotation -= ROT_SPEED;
        this.player.rotation -= ROT_SPEED;
      }
    }
  }
}

export default GameScene;
