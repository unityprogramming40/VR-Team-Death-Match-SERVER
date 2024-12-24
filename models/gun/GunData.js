/**
 * Represents data about a gun in the game.
 */
class GunData {
    /**
     * @param {Object} options - The options for initializing the gun data.
     * @param {number} options.gunID - The unique ID of the gun.
     * @param {string} [options.playerID="none"] - The ID of the player holding the gun. Defaults to "none".
     * @param {number} [options.teamID=0] - The team ID associated with the gun. Defaults to 0.
     * @param {number[]} [options.position=[0, 0, 0]] - The position of the gun as an array of floats. Defaults to [0, 0, 0].
     * @param {number[]} [options.rotation=[0, 0, 0]] - The rotation of the gun as an array of floats. Defaults to [0, 0, 0].
     * @param {number} [options.maxBullets=30] - The maximum number of bullets the gun can hold. Defaults to 30.
     * @param {number} [options.currentBullets=30] - The current number of bullets in the gun. Defaults to 30.
     * @param {number} [options.damage=10] - The damage dealt by the gun. Defaults to 10.
     * @param {number} [options.resetPoint=0] - The reset position of the gun as an array of floats. Defaults to [0, 0, 0].
     */
    constructor(gunID, playerID, teamID, position, rotation, maxBullets, currentBullets, damage, resetPoint) {
        this.gunID = gunID;
        this.playerID = playerID;
        this.teamID = teamID;
        this.position = position;
        this.rotation = rotation;
        this.maxBullets = maxBullets;
        this.currentBullets = currentBullets;
        this.damage = damage;
        this.resetPoint = resetPoint;
        /*
        if (typeof gunID !== 'number' || !Number.isInteger(gunID)) {
            throw new TypeError("gunID must be an integer.");
        }
        if (typeof playerID !== 'string') {
            throw new TypeError("playerID must be a string.");
        }
        if (typeof teamID !== 'number' || !Number.isInteger(teamID)) {
            throw new TypeError("teamID must be an integer.");
        }
        if (!Array.isArray(position) || !this.isValidFloatArray(position)) {
            throw new TypeError("position must be an array of numbers (floats).");
        }
        if (!Array.isArray(rotation) || !this.isValidFloatArray(rotation)) {
            throw new TypeError("rotation must be an array of numbers (floats).");
        }
        if (typeof maxBullets !== 'number' || !Number.isInteger(maxBullets)) {
            throw new TypeError("maxBullets must be an integer.");
        }
        if (typeof currentBullets !== 'number' || !Number.isInteger(currentBullets)) {
            throw new TypeError("currentBullets must be an integer.");
        }
        if (typeof damage !== 'number' || damage < 0) {
            throw new TypeError("damage must be a non-negative number.");
        }
        if (!Array.isArray(resetPoint) || !this.isValidFloatArray(resetPoint)) {
            throw new TypeError("resetPoint must be an array of numbers (floats).");
        }
*/

    }

    /**
     * Validates that all elements in an array are numbers (floats).
     *
     * @param {number[]} array - The array to validate.
     * @returns {boolean} - True if all elements are numbers, false otherwise.
     */
    isValidFloatArray(array) {
        return array.every(item => typeof item === "number");
    }
}

module.exports = GunData;
