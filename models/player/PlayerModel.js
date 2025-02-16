const PlayerTransform = require('./PlayerTransform');
const PlayerData = require('./PlayerData');
const TransformJSON = require('../TransformJSON');

class PlayerModel {
    /**
     * @param {string} playerID - The unique ID of the player.
     * @param {PlayerTransform} playerTransform - The player's transform data.
     * @param {PlayerData} playerData - The player's data.
     */
    constructor(playerID,spawnpoint) {
        this.playerID = playerID;
        this.playerTransform = new PlayerTransform(playerID, new TransformJSON([0, 0, 0], [0, 0, 0]),new TransformJSON([0, 0, 0], [0, 0, 0]),new TransformJSON([0, 0, 0], [0, 0, 0]));
        this.playerData = new PlayerData(playerID, "player", 100, 1, 0, spawnpoint);
    }
}

module.exports = PlayerModel;
