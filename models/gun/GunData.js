class GunData {
    constructor({
        gunID,
        playerID = "none",
        teamID = 0,
        position = [0, 0, 0],      // Array of floats
        rotation = [0, 0, 0],      // Array of floats
        maxBullets = 30,
        currentBullets = 30,
        damage = 10,
        resetPoint = [0, 0, 0]     // Array of floats
    } = {}) {
        this.gunID = gunID;
        this.playerID = playerID;
        this.teamID = teamID;
        this.position = position;
        this.rotation = rotation;
        this.maxBullets = maxBullets;
        this.currentBullets = currentBullets;
        this.damage = damage;
        this.resetPoint = resetPoint;
    }
}

module.exports = GunData;
