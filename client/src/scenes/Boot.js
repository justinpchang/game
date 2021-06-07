import Phaser from 'phaser';

import tiles from '../assets/map/spritesheet-extruded.png';
import tilemap from '../assets/map/map.json';
import playerSpritesheet from '../assets/spritesheets/RPG_assets.png';
import golem from '../assets/images/coppergolem.png';
import ent from '../assets/images/dark-ent.png';
import demon from '../assets/images/demon.png';
import worm from '../assets/images/giant-worm.png';
import wolf from '../assets/images/wolf.png';
import sword from '../assets/images/attack-icon.png';

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene",
      active: true,
    });
  }

  preload() {
    // map tiles
    this.load.image("tiles", tiles);
    // map in json format
    this.load.tilemapTiledJSON("map", tilemap);
    // our two characters
    this.load.spritesheet("player", playerSpritesheet, {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image("golem", golem);
    this.load.image("ent", ent);
    this.load.image("demon", demon);
    this.load.image("worm", worm);
    this.load.image("wolf", wolf);
    this.load.image("sword", sword);
  }

  create() {
    this.scene.start("WorldScene");
  }
}

export default BootScene;