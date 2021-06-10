import '@geckos.io/phaser-on-nodejs';
import 'phaser';

import { SCALE } from '../../common/constants';
import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';

// Create authoritative headless Phaser game
const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-game',
  width: 320 * SCALE,
  height: 240 * SCALE,
  banner: false,
  audio: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0,
      },
      debug: false,
    },
  },
  scene: [PreloaderScene, GameScene],
};

const Game = () => new Phaser.Game(config);

export default Game;