import Phaser from 'phaser';

const createPlayerAnims = (anims) => {
  anims.create({
    key: "player-move-left",
    frames: anims.generateFrameNumbers("player", {
      frames: [1, 7, 1, 13],
    }),
    frameRate: 10,
    repeat: -1,
  });

  // animation with key 'right'
  anims.create({
    key: "player-move-right",
    frames: anims.generateFrameNumbers("player", {
      frames: [1, 7, 1, 13],
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "player-move-up",
    frames: anims.generateFrameNumbers("player", {
      frames: [2, 8, 2, 14],
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "player-move-down",
    frames: anims.generateFrameNumbers("player", {
      frames: [0, 6, 0, 12],
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: 'player-idle',
    frames: anims.generateFrameNumbers('player', {
      frames: [0],
    }),
  });
};

export default createPlayerAnims;