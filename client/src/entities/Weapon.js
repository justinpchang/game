import Phaser from 'phaser';

import data from '../assets/data/weapons.yml';
import {
	SCALE,
} from '../constants';

// Handle data defaults
const getWeapon = (type) => ({
	...data['default'],
	...data[type],
});

// Weapon class owned by Player
class Weapon {
	// Helper to create all weapons for server fire
	static CreateServerWeapons(scene) {
		let weapons = {};
		for (const weapon in data) {
			weapons[weapon] = new Weapon(weapon, scene);
		}
		return weapons;
	}

	constructor(type, scene, socket, overwrite) {
		this.socket = socket;
		this.scene = scene;
		this.data = {
			...getWeapon(type),
			...overwrite,
		};
		this.isServerWeapon = !socket;

		this.nextShotTime = 0;
	}

	// Ignore fire restrictions if server weapon
	fire = (x1, y1, x2, y2, rotation, starttime = Date.now()) => {
		if (
      !this.scene ||
      !this.scene.input ||
      !this.scene.bullets ||
      (!this.isServerWeapon && !this.socket)
    ) {
      return;
    }

		if (this.isServerWeapon || this.nextShotTime < Date.now()) {
			// Calculate shoot vector
			const theta = rotation || Phaser.Math.Angle.Between(x1, y1, x2, y2);
			let velR = new Phaser.Math.Vector2();
			velR.setToPolar(theta, this.data.speed * SCALE);

			// Grab available bullet from scene sprite group
			const bullet = this.scene.bullets.get(x1, y1, this.data.texture);
			if (!bullet) {
				return;
			}

			// Fire weapon
			bullet.setRotation(theta);
			bullet.setScale(SCALE * this.data.size);
			bullet.setVelocity(velR.x, velR.y);
			bullet.setActive(true);
			bullet.setVisible(true);

			// Set timed event to kill the bullet at range
			// Correct for network delay using starttime
			const delay = this.data.range * SCALE / this.data.speed;
			const networkBuffer = Date.now() - starttime;
			this.scene.time.delayedCall(delay * 1000 - networkBuffer, () => {
				if (bullet) {
					bullet.setActive(false);
					bullet.setVisible(false);
					bullet.destroy();
				}
			});

			if (!this.isServerWeapon) {
				// Emit shoot event
				this.socket.emit('playerShoot', {
					type: this.data.id,
					rotation: theta,
					starttime: Date.now(),
					x1,
					y1,
					x2,
					y2,
				});

				// Set time for next bullet
				this.nextShotTime = Date.now() + (1000 / this.data.fireRate);
			}
		}
	}
}

export default Weapon;