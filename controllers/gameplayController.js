const IntegerValue = require('../models/admin/IntegerValue');
const GameData = require('../models/gameplay/GameData');
const MainController = require('./mainController');
const PlayerController = require('./playerController');
const TeamController = require('./teamController');

/**
 * GameplayController manages gameplay-related events and game state.
 */
class GameplayController extends MainController {
    /**
     * @param {object} io - The Socket.IO instance.
     */
    constructor(io) {
        super(io);

        // Initialize game data
        this.gameData = new GameData();

        // Set up event listeners
        this.initializeSocketEvents(io);

    }

    /**
     * Initializes Socket.IO event listeners for gameplay-related events.
     * @param {object} io - The Socket.IO instance.
     */
    initializeSocketEvents(io) {
        io.on('connection', (socket) => {
            //this.Debug('New client connected to GameplayController.');

            // Send current game data to the client
            this.SendSocketEmit(socket, 'GameData', { gameData: this.gameData }, "Game Data Sent ", "Failed send Game Data", false);

            socket.on('set timer', (data) => this.handleSetTimer(socket, data.value));
            socket.on('set map', (data) => this.handleSetMap(socket, data.value));

            // Start the game
            socket.on('startGame', _ => {
                this.Debug('Received startGame :' + this.gameData.mainTimer);
                this.gameData.startGame(this.gameData.mainTimer);

                this.SendSocketBroadcast(socket, "gameStarted", new IntegerValue(0), "", "");

            });

            // Pause the game
            socket.on('pauseGame', () => {
                this.gameData.pauseGame();

                this.SendSocketBroadcast(socket, "gamePaused", new IntegerValue(0), "", "");
                this.Debug('Game paused.');
            });

            // resume the game
            socket.on('resumeGame', () => {
                this.gameData.resumeGame();
                this.SendSocketBroadcast(socket, "gameResumed", new IntegerValue(0), "", "");
                this.Debug('Game Reumed.');
            });

            // Stop the game
            socket.on('stopGame', () => {
                this.gameData.stopGame();
                this.SendSocketBroadcast(socket, "gameStopped", new IntegerValue(0), "", "");

                this.teamController.Teams.forEach(team => {
                    this.teamController.resetTeamPoints(socket, team.teamID);
                });

                this.playerController.sendRestPlayersHealth(socket);
                this.Debug('Game stopped.');
            });

            // Complete the game
            socket.on('completeGame', () => {
                this.gameData.completeGame();
                this.SendSocketBroadcast(socket, "gameCompleted", new IntegerValue(0), "", "");

                this.teamController.Teams.forEach(team => {
                    this.teamController.resetTeamPoints(socket, team.teamID);
                });

                this.playerController.sendRestPlayersHealth(socket);

                this.Debug('Game completed.');
            });

            socket.on('remaining time', (data) => {
                this.gameData.setTime(data.value);
            });


            socket.on("Ping", () => {
                socket.emit("Pong");
            });


            socket.on("mapObjChange", (data) => {
                this.SendSocketBroadcast(socket, "mapObjChange", data, "object map sent", "object map failed");
            });
        });
    }


    /**
     * Sets the TeamController instance.
     * @param {TeamController} teamController - The TeamController instance.
     */
    setTeamController(teamController) {
        this.teamController = teamController;
    }
    /**
     * Sets the TeamController instance.
     * @param {PlayerController} playerController - The TeamController instance.
     */
    setPlayerController(playerController) {
        this.playerController = playerController;
    }

    handleSetTimer(socket, time) {

        this.gameData.mainTimer = time;
        this.SendSocketALL(socket, "Set Timer", new IntegerValue(time / 60), "Timer Sent", "Timers Error");
    }

    handleSetMap(socket, map) {

        this.gameData.currentEnvID = map;
        this.SendSocketALL(socket, "Set Map", new IntegerValue(map), "Map Sent", "Map Error");
    }


    handleGameAleadryStatred(socket) {

        this.SendSocketEmit(socket, "Set Timer", new IntegerValue(this.gameData.mainTimer / 60), "Timer Sent", "Timers Error");
        this.SendSocketEmit(socket, "Set Map", new IntegerValue(this.gameData.currentEnvID), "Map Sent", "Map Error");
        this.SendSocketEmit(socket, "gameStarted", new IntegerValue(0), "", "");


    }



}

module.exports = GameplayController;
