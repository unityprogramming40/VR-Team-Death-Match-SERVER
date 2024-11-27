class PlayerData {
    constructor(playerID, name,health, teamID, killpoints, resetpointID) {
        this.playerID = playerID;
        this.name = name,
        this.health = health;
        this.teamID = teamID;
        this.killpoints = killpoints;
        this.resetpointID = resetpointID;
    }
}

module.exports = PlayerData;
