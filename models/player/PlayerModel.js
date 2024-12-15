const PlayerTransform = require('./PlayerTransform');
const PlayerData = require('./PlayerData');

class PlayerModel {
    /**
     * @param {string} playerID - The unique ID of the player.
     * @param {PlayerTransform} playerTransform - The player's transform data.
     * @param {PlayerData} playerData - The player's data.
     */
    constructor(playerID) {
        this.playerID = playerID;
        this.playerTransform = new PlayerTransform(playerID, [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]);
        this.playerData = new PlayerData(playerID, "player", 100, 1, 0, 0);
    }
}

module.exports = PlayerModel;
