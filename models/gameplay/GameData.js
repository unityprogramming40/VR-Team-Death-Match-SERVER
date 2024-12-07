class GameData {
    constructor() {
        // Game state attributes
        this.gameStarted = false;
        this.gamePaused = false;
        this.gameStopped = false;
        this.gameCompleted = false;

        // Timer attributes
        this.mainTimer = null;
        this.currentTime = 0;

        // Team attributes
        this.team1Players = ["222","5555"];
        this.team2Players = ["576","787"];
        this.team1Killpoints = 0;
        this.team2Killpoints = 0;

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

    addPlayerTeam1(playerID) {
        if (this.team1Players.includes(playerID)) {
            console.log(`Player ${playerID} is already in Team 1`);
        } else {
            this.team1Players.push(playerID);
            console.log('addPlayerTeam1', this.team1Players);
        }
    }
    

    addPlayerTeam2(playerID) {
        if (this.team2Players.includes(playerID)) {
            console.log(`Player ${playerID} is already in Team 2`);
        } else {
            this.team2Players.push(playerID);
            console.log('addPlayerTeam2', this.team2Players);
        }
    }
    

    addTeam1Point() {
        this.team1Killpoints++;
        console.log('addTeam1Point',this.team1Killpoints)
    }

    addTeam2Point() {
        this.team2Killpoints++;
        console.log('addTeam2Point',this.team2Killpoints)
    }

    removePlayerTeam1(playerID) {
        this.team1Players = this.team1Players.filter(id => id !== playerID);
        console.log('removePlayerTeam1',this.team1Players)
    }

    removePlayerTeam2(playerID) {
        this.team2Players = this.team2Players.filter(id => id !== playerID);
        console.log('removePlayerTeam2',this.team2Players)
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

    getTeams() {
        return {
            team1Players: this.team1Players,
            team2Players: this.team2Players
        };
    }
}

module.exports = GameData;
