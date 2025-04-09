class GameData {
    /**
 * Represents the state of the game, including its attributes and environment settings.
 */
    constructor() {
        // Game state attributes
        /**
         * @type {boolean} Indicates if the game has started.
         */
        this.gameStarted = false;

        /**
         * @type {boolean} Indicates if the game is currently paused.
         */
        this.gamePaused = false;

        /**
         * @type {boolean} Indicates if the game has been stopped.
         */
        this.gameStopped = false;

        /**
         * @type {boolean} Indicates if the game is completed.
         */
        this.gameCompleted = false;

        // Timer attributes
        /**
         * @type {number} The main game timer in seconds.
         */
        this.mainTimer = 0;

        /**
         * @type {number} The current game time in seconds.
         */
        this.currentTime = 0;

        // Environment attributes
        /**
         * @type {number} The current environment ID (e.g., level or scene ID).
         */
        this.currentEnvID = 0;
    }


    resetGame() {
        this.resetState();
        this.resetTimer();
        this.currentEnvID = 0;
    }

    resetState() {
        this.gameStarted = false;
        this.gamePaused = false;
        this.gameStopped = false;
        this.gameCompleted = false;
    }

    resetTimer() {
        this.currentTime = 0;
    }

    setTime(value) {
        this.currentTime = value;
    }

    startGame(timer) {
        this.gameStarted = true;
        this.mainTimer = timer;
        this.currentTime = timer;
        // this.currentEnvID = currentEnv;
        console.log('startGame', timer)
    }

    pauseGame() {
        this.gamePaused = true;
        console.log('pauseGame', this.gamePaused)
    }

    resumeGame() {
        this.gamePaused = false;
        console.log('resumeGame', this.gamePaused)
    }

    stopGame() {
        this.gameStopped = true;
        //this.resetTimer();
        console.log('stopGame', this.gameStopped)
    }

    completeGame() {
        this.gameCompleted = true;
        this.currentTime = 0;
    }



}

module.exports = GameData;
