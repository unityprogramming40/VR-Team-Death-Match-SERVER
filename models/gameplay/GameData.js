class GameData {
    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.resetState();
        this.resetTimer();
        this.resetTeams();
        this.currentEnvID = 0;
    }

    resetState() {
        this.gameStarted = false;
        this.gamePaused = false;
        this.gameStopped = false;
        this.gameCompleted = false;
    }

    resetTeams() {
        this.team1Players = [];
        this.team2Players = [];
        this.resetPoints();
    }

    resetTimer() {
        this.currentTime = 0;
    }

    startGame(timer, currentEnv) {
        this.gameStarted = true;
        this.mainTimer = timer;
        this.currentEnvID = currentEnv;
    }

    pauseGame() {
        this.gamePaused = true;
    }

    stopGame() {
        this.gameStopped = true;
        this.resetPoints();
        this.resetTimer();
    }

    completeGame() {
        this.gameCompleted = true;
        this.currentTime = 0;
    }

    addPlayerTeam1(playerID) {
        this.team1Players.push(playerID);
    }

    addPlayerTeam2(playerID) {
        this.team2Players.push(playerID);
    }

    addTeam1Point() {
        this.team1Killpoints++;
    }

    addTeam2Point() {
        this.team2Killpoints++;
    }

    removePlayerTeam1(playerID) {
        this.team1Players = this.team1Players.filter(id => id !== playerID);
    }

    removePlayerTeam2(playerID) {
        this.team2Players = this.team2Players.filter(id => id !== playerID);
    }

    resetPoints() {
        this.resetTeam1Points();
        this.resetTeam2Points();
    }

    resetTeam1Points() {
        this.team1Killpoints = 0;
    }

    resetTeam2Points() {
        this.team2Killpoints = 0;
    }
}

module.exports = GameData;
