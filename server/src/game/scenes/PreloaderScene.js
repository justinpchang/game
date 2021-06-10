import tilemap from '../../../common/assets/maps/map.json';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'PreloaderScene',
      active: true,
    });
  }

  preload() {
    this.load.tilemapTiledJSON('map', tilemap);
  }

  create() {
    this.scene.start('GameScene');
  }
}

export default PreloaderScene;