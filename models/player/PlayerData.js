class PlayerData {
    constructor(playerID, health, teamID, killpoints, resetpointID) {
        this.playerID = playerID;
        this.health = health;
        this.teamID = teamID;
        this.killpoints = killpoints;
        this.resetpointID = resetpointID;
    }
}

module.exports = PlayerData;
