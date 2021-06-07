import Phaser from 'phaser';

import '../entities/Player';
import createPlayerAnims from '../anims/PlayerAnims';

import {
  SCALE,
  ROT_SPEED,
} from '../constants';

class WorldScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'WorldScene',
    });
  }

  create() {
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

    // listen for web socket events
    this.socket.on(
      'currentPlayers',
      function (players) {
        Object.keys(players).forEach(
          function (id) {
            if (players[id].playerId === this.socket.id) {
              this.player = this.add.player(this.socket, 100, 100, 'player');
              this.cameras.main.startFollow(this.player, true);
              this.physics.add.collider(this.player, obstaclesLayer);
            } else {
              this.addOtherPlayers(players[id]);
            }
          }.bind(this)
        );
      }.bind(this)
    );

    this.socket.on(
      'newPlayer',
      function (playerInfo) {
        this.addOtherPlayers(playerInfo);
      }.bind(this)
    );

    this.socket.on(
      'disconnect',
      function (playerId) {
        this.otherPlayers.getChildren().forEach(
          function (player) {
            if (playerId === player.playerId) {
              player.destroy();
            }
          }.bind(this)
        );
      }.bind(this)
    );

    this.socket.on(
      'playerMoved',
      function (playerInfo) {
        this.otherPlayers.getChildren().forEach(
          function (player) {
            if (playerInfo.playerId === player.playerId) {
              player.flipX = playerInfo.flipX;
              player.setPosition(playerInfo.x, playerInfo.y);
            }
          }.bind(this)
        );
      }.bind(this)
    );
  }

  addOtherPlayers(playerInfo) {
    const otherPlayer = this.add.sprite(
      playerInfo.x,
      playerInfo.y,
      'player',
      9
    ).setScale(SCALE);
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer);
  }

  update() {
    if (this.player) {
      this.player.update(this.input.keyboard);
    }

    // update camera rotation
    const ccwDown = this.input.keyboard.addKey('Q').isDown;
    const cwDown = this.input.keyboard.addKey('E').isDown;
    if (cwDown) {
      this.cameras.main.rotation -= ROT_SPEED;
      this.player.rotation += ROT_SPEED;
    } else if (ccwDown) {
      this.cameras.main.rotation += ROT_SPEED;
      this.player.rotation -= ROT_SPEED;
    }
  }
}

export default WorldScene;
