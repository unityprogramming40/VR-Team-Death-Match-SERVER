const GameData = require('../models/GameData');

class GameplayController {
    constructor(io) {
        this.io = io;
        this.gameData = new GameData();

        io.on('connection', (socket) => {
            console.log('New client connected to gameplay controller');

            socket.on('startGame', (data) => {
                this.gameData.startGame(data.timer, data.currentEnv);
                this.io.emit('gameStarted', this.gameData);
            });

            socket.on('pauseGame', () => {
                this.gameData.pauseGame();
                this.io.emit('gamePaused', this.gameData);
            });

            socket.on('stopGame', () => {
                this.gameData.stopGame();
                this.io.emit('gameStopped', this.gameData);
            });

            socket.on('completeGame', () => {
                this.gameData.completeGame();
                this.io.emit('gameCompleted', this.gameData);
            });

            socket.on('addPlayerTeam1', (playerID) => {
                this.gameData.addPlayerTeam1(playerID);
                this.io.emit('team1Updated', this.gameData.team1Players);
            });

            socket.on('addPlayerTeam2', (playerID) => {
                this.gameData.addPlayerTeam2(playerID);
                this.io.emit('team2Updated', this.gameData.team2Players);
            });

            socket.on('removePlayerTeam1', (playerID) => {
                this.gameData.removePlayerTeam1(playerID);
                this.io.emit('team1Updated', this.gameData.team1Players);
            });

            socket.on('removePlayerTeam2', (playerID) => {
                this.gameData.removePlayerTeam2(playerID);
                this.io.emit('team2Updated', this.gameData.team2Players);
            });

            socket.on('addTeam1Point', () => {
                this.gameData.addTeam1Point();
                this.io.emit('team1PointsUpdated', this.gameData.team1Killpoints);
            });

            socket.on('addTeam2Point', () => {
                this.gameData.addTeam2Point();
                this.io.emit('team2PointsUpdated', this.gameData.team2Killpoints);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected from gameplay controller');
            });
        });
    }
}

module.exports = GameplayController;
