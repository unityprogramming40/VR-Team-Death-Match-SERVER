/**
 * Represents data about a bullet fired in the game.
 */
class BulletData {
    /**
     * @param {number} gunID - The ID of the gun that fired the bullet.
     * @param {string} playerID - The ID of the player who fired the bullet.
     * @param {number} teamID - The team ID of the player who fired the bullet.
     * @param {number} damage - The amount of damage the bullet deals.
     */
    constructor(gunID, playerID, teamID, damage) {
        if (typeof gunID !== 'number' || !Number.isInteger(gunID)) {
            throw new TypeError('gunID must be an integer.');
        }
        if (typeof playerID !== 'string') {
            throw new TypeError('playerID must be a string.');
        }
        if (typeof teamID !== 'number' || !Number.isInteger(teamID)) {
            throw new TypeError('teamID must be an integer.');
        }
        if (typeof damage !== 'number' || damage < 0) {
            throw new TypeError('damage must be a non-negative number.');
        }

        /**
         * @type {number} The ID of the gun that fired the bullet.
         */
        this.gunID = gunID;

        /**
         * @type {string} The ID of the player who fired the bullet.
         */
        this.playerID = playerID;

        /**
         * @type {number} The team ID of the player who fired the bullet.
         */
        this.teamID = teamID;

        /**
         * @type {number} The amount of damage the bullet deals.
         */
        this.damage = damage;
    }
}

module.exports = BulletData;
