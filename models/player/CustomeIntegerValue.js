/**
 * Represents a custom integer value associated with a player.
 */
class CustomeIntegerValue {
    /**
     * @param {string} playerID - The unique ID of the player.
     * @param {number} intValue - The custom integer value associated with the player.
     */
    constructor(playerID, intValue) {
        if (typeof playerID !== 'string') {
            throw new TypeError('playerID must be a string.');
        }
        if (typeof intValue !== 'number' || !Number.isInteger(intValue)) {
            throw new TypeError('intValue must be an integer.');
        }

        /**
         * @type {string} The unique ID of the player.
         */
        this.playerID = playerID;

        /**
         * @type {number} The custom integer value associated with the player.
         */
        this.intValue = intValue;
    }
}

module.exports = CustomeIntegerValue;
