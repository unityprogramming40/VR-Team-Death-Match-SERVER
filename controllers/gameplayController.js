const GameData = require('../models/gameplay/GameData');

class GameplayController {
    constructor(io) {
        this.io = io;
        this.gameData = new GameData();

        io.on('connection', (socket) => {
            console.log('New client connected to gameplay controller');

            socket.on('getGameData', () => {
                socket.emit('GameData', { gameData: this.gameData });
            });


            socket.on('startGame', (data) => {
                console.log(data)
                this.gameData.startGame(data.timer, data.currentEnv);
                this.io.emit('gameStarted', { gameData: this.gameData });
            });

            socket.on('pauseGame', () => {
                this.gameData.pauseGame();
                this.io.emit('gamePaused', { gameData: this.gameData });
            });

            socket.on('stopGame', () => {
                this.gameData.stopGame();
                this.io.emit('gameStopped', { gameData: this.gameData });
            });

            socket.on('completeGame', () => {
                this.gameData.completeGame();
                this.io.emit('gameCompleted', { gameData: this.gameData });
            });

            // socket.on('addPlayerTeam1', (data) => {
            //     this.gameData.addPlayerTeam1(data.text);
            //     this.io.emit('team1Updated', { team1: this.gameData.team1Players });
            // });

            // socket.on('addPlayerTeam2', (data) => {
            //     this.gameData.addPlayerTeam2(data.text);
            //     this.io.emit('team2Updated', { team2: this.gameData.team2Players });
            // });

            // socket.on('removePlayerTeam1', (data) => {
            //     this.gameData.removePlayerTeam1(data.text);
            //     this.io.emit('team1Updated', { team1: this.gameData.team1Players });
            // });

            // socket.on('removePlayerTeam2', (data) => {
            //     this.gameData.removePlayerTeam2(data.text);
            //     this.io.emit('team2Updated', { team2: this.gameData.team2Players });
            // });

            // socket.on('addTeam1Point', () => {
            //     this.gameData.addTeam1Point();
            //     this.io.emit('team1PointsUpdated', { points: this.gameData.team1Killpoints });
            // });

            // socket.on('addTeam2Point', () => {
            //     this.gameData.addTeam2Point();
            //     this.io.emit('team2PointsUpdated', { points: this.gameData.team2Killpoints });
            // });

            socket.on('disconnect', () => {
                console.log('Client disconnected from gameplay controller');
            });
        });
    }

}

module.exports = GameplayController;
