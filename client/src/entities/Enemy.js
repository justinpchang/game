import Phaser, { Math } from 'phaser';

import {
	SCALE,
} from '../constants';
import data from '../assets/data/enemies.yml';
import Weapon from './Weapon';

// Handle data defaults
const getEnemy = (type) => ({
	...data['default'],
	...data[type],
});

class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, type) {
		const data = getEnemy(type);
		
		super(scene, x, y, data.texture);

		this.scene = scene;
		this.socket = scene.socket;
		this.data = data;
		this.weapon = null;

		this.setScale(SCALE * this.data.size);

		this.anims.play(type + '-idle', true);
	}

	update() {
		// Check which behavior should be done (dependent on closest player)
		let closestPlayer = this.scene.player;
		let closestDistance = this.scene.player
			? Phaser.Math.Distance.Between(this.x, this.y, closestPlayer.x, closestPlayer.y)
			: Number.MAX_SAFE_INTEGER;
		if (this.scene.otherPlayers) {
			this.scene.otherPlayers.getChildren().forEach((player) => {
				const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
				if (distance < closestDistance) {
					closestPlayer = player;
					closestDistance = distance;
				}
			});
		}
		// Apply buckets in reverse order for animation stacking
		for (const bucket of Object.values(this.data.behavior)) {
			for (const behavior of bucket) {
				// Continue down list of behaviors in bucket until one is valid
				if (behavior.range && (behavior.range * SCALE < closestDistance)) {
					continue;
				}

				// Do behavior
				switch (behavior.type) {
					case 'Shoot':
						if (!this.weapon || this.weapon.data.id !== behavior.weapon.id) {
							this.weapon = new Weapon(behavior.weapon.id, this.scene, this.socket, behavior.weapon);
						}
						this.weapon.fire(this.x, this.y, closestPlayer.x, closestPlayer.y);
						break;
          case 'Follow':
						this.scene.physics.moveTo(this, closestPlayer.x, closestPlayer.y, behavior.speed * SCALE);
            break;
          case 'Wander':
          default:
						if (Phaser.Math.Between(0, 100) > 60) {
							const vec = new Phaser.Math.RandomXY(new Phaser.Math.Vector2(), behavior.speed * SCALE);
							this.setVelocity(vec.x, vec.y);
						}
            break;
        }
				break;
			}
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('enemy', function (x, y, type) {
	let enemy = new Enemy(this.scene, x, y, type);
	this.displayList.add(enemy);
	this.updateList.add(enemy);
	this.scene.physics.world.enableBody(enemy, Phaser.Physics.Arcade.DYNAMIC_BODY);
	this.scene.physics.world.enable(enemy);
	enemy.body.setSize(enemy.width, enemy.height);
	return enemy;
})

export default Enemy;