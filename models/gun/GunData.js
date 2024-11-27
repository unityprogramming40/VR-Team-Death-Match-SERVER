class GunData {
    constructor(gunID, playerID, teamID, position, rotation, maxBullets, currentBullets, damage, resetPoint) {
        this.gunID = gunID;
        this.playerID = playerID;
        this.teamID = teamID;
        this.position = position;       // Array of floats
        this.rotation = rotation;       // Array of floats
        this.maxBullets = maxBullets;
        this.currentBullets = currentBullets;
        this.damage = damage;
        this.resetPoint = resetPoint;   // Array of floats
    }
}

module.exports = GunData;
