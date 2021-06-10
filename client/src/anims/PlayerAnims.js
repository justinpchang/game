const createPlayerAnims = (anims) => {
  anims.create({
    key: 'player-move-left',
    frames: anims.generateFrameNumbers('player', {
      frames: [1, 7, 1, 13],
    }),
    frameRate: 6,
    repeat: -1,
  });

  anims.create({
    key: 'player-move-right',
    frames: anims.generateFrameNumbers('player', {
      frames: [1, 7, 1, 13],
    }),
    frameRate: 6,
    repeat: -1,
  });

  anims.create({
    key: 'player-move-side',
    frames: anims.generateFrameNumbers('rotmgPlayer', {
      frames: [36, 37],
    }),
    frameRate: 6,
    repeat: -1,
  })

  anims.create({
    key: 'player-move-up',
    frames: anims.generateFrameNumbers('rotmgPlayer', {
      frames: [48, 49, 50],
    }),
    frameRate: 6,
    repeat: -1,
  });

  anims.create({
    key: 'player-move-down',
    frames: anims.generateFrameNumbers('rotmgPlayer', {
      frames: [42, 43, 44],
    }),
    frameRate: 6,
    repeat: -1,
  });

  anims.create({
    key: 'player-idle',
    frames: anims.generateFrameNumbers('rotmgPlayer', {
      frames: [42],
    }),
  });

  anims.create({
    key: 'player-shoot-side',
    frames: anims.generateFrameNumbers('rotmgPlayer', {
      frames: [40, 41],
    }),
    frameRate: 6,
    repeat: -1,
  });

  anims.create({
    key: 'player-shoot-up',
    frames: anims.generateFrameNumbers('rotmgPlayer', {
      frames: [52, 53],
    }),
    frameRate: 6,
    repeat: -1,
  });

  anims.create({
    key: 'player-shoot-down',
    frames: anims.generateFrameNumbers('rotmgPlayer', {
      frames: [46, 47],
    }),
    frameRate: 6,
    repeat: -1,
  });
};

export default createPlayerAnims;
