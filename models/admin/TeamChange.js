/**
 * Represents a player's team change in the game.
 */
class TeamChange {
    /**
     * @param {string} playerID - The unique ID of the player changing teams.
     * @param {number} newTeamID - The ID of the new team the player is joining.
     */
    constructor(playerID, newTeamID) {
        if (typeof playerID !== 'string') {
            throw new TypeError('playerID must be a string.');
        }
        if (typeof newTeamID !== 'number') {
            throw new TypeError('newTeamID must be a number.');
        }

        /**
         * @type {string} The unique ID of the player.
         */
        this.playerID = playerID;

        /**
         * @type {number} The ID of the new team the player is joining.
         */
        this.newTeamID = newTeamID;
    }
}

module.exports = TeamChange;
