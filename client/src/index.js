import Phaser from 'phaser';

import PreloaderScene from './scenes/PreloaderScene';
//import GameScene from './scenes/GameScene';
import GameScene from './scenes/NewGameScene';
import UIScene from './scenes/UIScene';

import { SCALE } from './constants';

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 320 * SCALE,
  height: 240 * SCALE,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0,
      },
      debug: false, // set to true to view zones
    },
  },
  scene: [PreloaderScene, GameScene, UIScene],
};

const game = new Phaser.Game(config);
