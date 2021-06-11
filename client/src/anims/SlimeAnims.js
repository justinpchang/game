const createSlimeAnims = (anims) => {
	anims.create({
		key: 'slime-idle',
		frames: anims.generateFrameNumbers('slime', {
			frames: [8, 8, 8, 0],
		}),
		frameRate: 3,
		repeat: -1,
	});

	anims.create({
		key: 'slime-move',
		frames: anims.generateFrameNumbers('slime', {
			frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
		}),
		frameRate: 6,
		repeat: -1,
	});

	anims.create({
		key: 'slime-shoot',
		frames: anims.generateFrameNumbers('slime', {
			frames: [8, 9, 10, 11, 12, 13, 14],
		}),
		frameRate: 6,
		repeat: -1,
	});
}

export default createSlimeAnims;