import Phaser from 'phaser';

import Player from '../player/Player';

class WorldScene extends Phaser.Scene {
  constructor() {
    super({
      key: "WorldScene",
    });
  }

  create() {
    this.socket = io('localhost:3000');
    this.otherPlayers = this.physics.add.group();

    // create map
    this.map = this.make.tilemap({
      key: "map",
    });

    // first parameter is the name of the tilemap in tiled
    let tiles = this.map.addTilesetImage("spritesheet", "tiles", 16, 16, 1, 2);

    // creating the layers
    this.map.createStaticLayer("Grass", tiles, 0, 0);
    const obstaclesLayer = this.map.createStaticLayer("Obstacles", tiles, 0, 0);
    obstaclesLayer.setCollisionByProperty({ collides: true });

    // don't go out of the map
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    // create player animations
    this.createAnimations();

    // user input
    this.cursors = this.input.keyboard.createCursorKeys();

    // listen for web socket events
    this.socket.on(
      "currentPlayers",
      function (players) {
        Object.keys(players).forEach(
          function (id) {
            if (players[id].playerId === this.socket.id) {
              this.player = this.add.player(this.socket, 50, 50, 'player');
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
      "newPlayer",
      function (playerInfo) {
        this.addOtherPlayers(playerInfo);
      }.bind(this)
    );

    this.socket.on(
      "disconnect",
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
      "playerMoved",
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

  createAnimations() {
    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });

    // animation with key 'right'
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [2, 8, 2, 14],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [0, 6, 0, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  addOtherPlayers(playerInfo) {
    const otherPlayer = this.add.sprite(
      playerInfo.x,
      playerInfo.y,
      "player",
      9
    );
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer);
  }

  update() {
    if (this.player) {
      this.player.update(this.input.keyboard);
    }
  }
}

export default WorldScene;