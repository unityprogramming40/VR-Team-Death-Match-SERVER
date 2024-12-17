const GameData = require('../models/gameplay/GameData');
const MainController = require('./mainController');

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
            //console.log('New client connected to GameplayController.');

            // Send current game data to the client
            this.SendSocketEmit(socket, 'GameData', { gameData: this.gameData }, "Game Data Sent ", "Failed send Game Data");


            // Start the game
            socket.on('startGame', (data) => {
                console.log('Received startGame event:', data);

                if (data?.timer && data?.currentEnv) {
                    this.gameData.startGame(data.timer, data.currentEnv);
                    this.io.emit('gameStarted', { gameData: this.gameData });
                    console.log('Game started successfully.');
                } else {
                    console.error('Invalid data for startGame event:', data);
                    socket.emit('error', { message: 'Invalid data for startGame event.' });
                }
            });

            // Pause the game
            socket.on('pauseGame', () => {
                this.gameData.pauseGame();
                this.io.emit('gamePaused', { gameData: this.gameData });
                console.log('Game paused.');
            });

            // Stop the game
            socket.on('stopGame', () => {
                this.gameData.stopGame();
                this.io.emit('gameStopped', { gameData: this.gameData });
                console.log('Game stopped.');
            });

            // Complete the game
            socket.on('completeGame', () => {
                this.gameData.completeGame();
                this.io.emit('gameCompleted', { gameData: this.gameData });
                console.log('Game completed.');
            });

            // Uncomment these sections if you need to handle team-related events in the future
            /*
            socket.on('addPlayerTeam1', (data) => {
                this.gameData.addPlayerTeam1(data.text);
                this.io.emit('team1Updated', { team1: this.gameData.team1Players });
                console.log('Player added to Team 1:', data.text);
            });

            socket.on('addPlayerTeam2', (data) => {
                this.gameData.addPlayerTeam2(data.text);
                this.io.emit('team2Updated', { team2: this.gameData.team2Players });
                console.log('Player added to Team 2:', data.text);
            });

            socket.on('removePlayerTeam1', (data) => {
                this.gameData.removePlayerTeam1(data.text);
                this.io.emit('team1Updated', { team1: this.gameData.team1Players });
                console.log('Player removed from Team 1:', data.text);
            });

            socket.on('removePlayerTeam2', (data) => {
                this.gameData.removePlayerTeam2(data.text);
                this.io.emit('team2Updated', { team2: this.gameData.team2Players });
                console.log('Player removed from Team 2:', data.text);
            });

            socket.on('addTeam1Point', () => {
                this.gameData.addTeam1Point();
                this.io.emit('team1PointsUpdated', { points: this.gameData.team1Killpoints });
                console.log('Team 1 point added.');
            });

            socket.on('addTeam2Point', () => {
                this.gameData.addTeam2Point();
                this.io.emit('team2PointsUpdated', { points: this.gameData.team2Killpoints });
                console.log('Team 2 point added.');
            });
            */

            // Handle client disconnection
            // socket.on('disconnect', () => {
            //     console.log('Client disconnected from GameplayController.');
            // });
        });
    }
}

module.exports = GameplayController;
