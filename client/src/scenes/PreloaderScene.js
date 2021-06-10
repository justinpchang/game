import Phaser from 'phaser';

import cursor from '../assets/cursors/X3.png';
import tiles from '../assets/map/spritesheet-extruded.png';
import tilemap from '../assets/map/map.json';
import playerSpritesheet from '../assets/spritesheets/RPG_assets.png';
import rotmgPlayerSpritesheet from '../assets/spritesheets/players.png';
import knife from '../assets/weapons/knife.png';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'PreloaderScene',
      active: true,
    });
  }

  preload() {
    this.load.image('cursor', cursor);

    this.load.image('tiles', tiles);
    this.load.tilemapTiledJSON('map', tilemap);

    this.load.spritesheet('player', playerSpritesheet, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('rotmgPlayer', rotmgPlayerSpritesheet, {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('knife', knife);
  }

  create() {
    this.scene.start('GameScene');
  }
}

export default PreloaderScene;
