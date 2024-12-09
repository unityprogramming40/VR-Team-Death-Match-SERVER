class GameData {
    constructor() {
        // Game state attributes
        this.gameStarted = false;
        this.gamePaused = false;
        this.gameStopped = false;
        this.gameCompleted = false;

        // Timer attributes
        this.mainTimer = 0;
        this.currentTime = 0;

        // Environment attributes
        this.currentEnvID = 0;
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
        console.log('startGame',this.mainTimer,this.currentEnvID)
    }

    pauseGame() {
        this.gamePaused = true;
        console.log('pauseGame',this.gamePaused)
    }

    stopGame() {
        this.gameStopped = true;
        this.resetPoints();
        this.resetTimer();
        console.log('stopGame',this.gameStopped)
    }

    completeGame() {
        this.gameCompleted = true;
        this.currentTime = 0;
    }


    
}

module.exports = GameData;
