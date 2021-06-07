import Phaser from 'phaser';

import BootScene from './scenes/Boot';
import WorldScene from './scenes/World';

import { SCALE } from './constants';

const config = {
  type: Phaser.AUTO,
  parent: "content",
  width: 320 * SCALE,
  height: 240 * SCALE,
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
