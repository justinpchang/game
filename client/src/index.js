import Phaser from 'phaser';
import BootScene from './scenes/Boot';
import WorldScene from './scenes/World';

const config = {
  type: Phaser.AUTO,
  parent: "content",
  width: 320,
  height: 240,
  zoom: 3,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
      debug: false, // set to true to view zones
    },
  },
  scene: [BootScene, WorldScene],
};

const game = new Phaser.Game(config);
