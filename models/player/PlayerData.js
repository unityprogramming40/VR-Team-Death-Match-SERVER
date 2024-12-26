class PlayerData {
    /**
     * Represents a player's data in the game.
     *
     * @param {string} playerID - The unique ID of the player.
     * @param {string} name - The name of the player.
     * @param {number} health - The player's health as a number (e.g., 100 for full health).
     * @param {number} teamID - The ID of the team the player belongs to.
     * @param {number} killpoints - The player's kill points (e.g., score for kills).
     * @param {number} resetpointID - The ID of the reset point where the player respawns.
     */
    constructor(playerID, name, health, teamID, killpoints, resetpointID) {
        if (typeof health !== 'number') {
            throw new TypeError('health must be a number.');
        }
        if (typeof teamID !== 'number') {
            throw new TypeError('teamID must be a number.');
        }
        if (typeof killpoints !== 'number') {
            throw new TypeError('killpoints must be a number.');
        }
        if (typeof resetpointID !== 'number') {
            throw new TypeError('resetpointID must be a number.');
        }

        this.playerID = playerID;
        this.name = name;
        this.health = health;
        this.teamID = teamID;
        this.killpoints = killpoints;
        this.resetpointID = resetpointID;
    }

    AddKillpoint() {
        this.killpoints += 1;
    }


    RestKillpoint() {
        this.killpoints = 0;
    }
}

module.exports = PlayerData;
