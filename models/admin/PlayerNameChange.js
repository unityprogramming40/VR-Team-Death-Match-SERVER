/**
 * Represents a player's name change in the game.
 */
class PlayerNameChange {
    /**
     * @param {string} playerID - The unique ID of the player changing their name.
     * @param {string} playerName - The new name of the player.
     */
    constructor(playerID, playerName) {
        if (typeof playerID !== 'string') {
            throw new TypeError('playerID must be a string.');
        }
        if (typeof playerName !== 'string') {
            throw new TypeError('playerName must be a string.');
        }

        /**
         * @type {string} The unique ID of the player.
         */
        this.playerID = playerID;

        /**
         * @type {string} The new name of the player.
         */
        this.playerName = playerName;
    }
}

module.exports = PlayerNameChange;
