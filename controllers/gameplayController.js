const IntegerValue = require('../models/admin/IntegerValue');
const GameData = require('../models/gameplay/GameData');
const MainController = require('./mainController');
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
            this.SendSocketEmit(socket, 'GameData', { gameData: this.gameData }, "Game Data Sent ", "Failed send Game Data");

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
                    this.teamController.resetTeamPoints(socket,team.teamID);
                });

                this.Debug('Game stopped.');
            });

            // Complete the game
            socket.on('completeGame', () => {
                this.gameData.completeGame();
                this.SendSocketBroadcast(socket, "gameCompleted", new IntegerValue(0), "", "");

                this.teamController.Teams.forEach(team => {
                    this.teamController.resetTeamPoints(socket,team.teamID);
                });
                this.Debug('Game completed.');
            });

            socket.on('remaining time', (data) => {
                this.gameData.setTime(data.value);
            });


            socket.on("Ping", () => {
                socket.emit("Pong");
            });

            // Uncomment these sections if you need to handle team-related events in the future
            /*
            socket.on('addPlayerTeam1', (data) => {
                this.gameData.addPlayerTeam1(data.text);
                this.io.emit('team1Updated', { team1: this.gameData.team1Players });
                this.Debug('Player added to Team 1:', data.text);
            });

            socket.on('addPlayerTeam2', (data) => {
                this.gameData.addPlayerTeam2(data.text);
                this.io.emit('team2Updated', { team2: this.gameData.team2Players });
                this.Debug('Player added to Team 2:', data.text);
            });

            socket.on('removePlayerTeam1', (data) => {
                this.gameData.removePlayerTeam1(data.text);
                this.io.emit('team1Updated', { team1: this.gameData.team1Players });
                this.Debug('Player removed from Team 1:', data.text);
            });

            socket.on('removePlayerTeam2', (data) => {
                this.gameData.removePlayerTeam2(data.text);
                this.io.emit('team2Updated', { team2: this.gameData.team2Players });
                this.Debug('Player removed from Team 2:', data.text);++++++++++++++++++++++
            });

            socket.on('addTeam1Point', () => {
                this.gameData.addTeam1Point();
                this.io.emit('team1PointsUpdated', { points: this.gameData.team1Killpoints });
                this.Debug('Team 1 point added.');
            });

            socket.on('addTeam2Point', () => {
                this.gameData.addTeam2Point();
                this.io.emit('team2PointsUpdated', { points: this.gameData.team2Killpoints });
                this.Debug('Team 2 point added.');
            });
            */

            // Handle client disconnection
            // socket.on('disconnect', () => {
            //     this.Debug('Client disconnected from GameplayController.');
            // });
       
       
        });
    }


    /**
     * Sets the TeamController instance.
     * @param {TeamController} teamController - The TeamController instance.
     */
    setTeamController(teamController) {
        this.teamController = teamController;
    }

    handleSetTimer(socket, time) {

        this.gameData.mainTimer = time;
        this.SendSocketALL(socket, "Set Timer", new IntegerValue(time / 60), "Timer Sent", "Timers Error");
    }   
    
    handleSetMap(socket, map) {

        this.gameData.currentEnvID = map;
        this.SendSocketALL(socket, "Set Map", new IntegerValue(map), "Map Sent", "Map Error");
    }


}

module.exports = GameplayController;
