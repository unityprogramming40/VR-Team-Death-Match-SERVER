const PlayerTransform = require('../models/PlayerTransform');
const PlayerData = require('../models/PlayerData');
const CustomeIntegerValue = require('../models/CustomeIntegerValue');

class PlayerController {
    constructor(io) {
        this.io = io;

        io.on('connection', (socket) => {
            console.log('New client connected to player controller');

            socket.on('playerTransform', (data) => {
                const playerTransform = new PlayerTransform(
                    data.playerID,
                    data.headPosition,
                    data.headRotation,
                    data.rHandPosition,
                    data.rHandRotation,
                    data.lHandPosition,
                    data.lHandRotation
                );
                this.handlePlayerTransform(socket, playerTransform);
            });

            socket.on('playerData', (data) => {
                const playerData = new PlayerData(
                    data.playerID,
                    data.health,
                    data.teamID,
                    data.killpoints,
                    data.resetpointID
                );
                this.handlePlayerData(socket, playerData);
            });

            socket.on('customeIntegerValue', (data) => {
                const customeIntegerValue = new CustomeIntegerValue(data.playerID, data.intValue);
                this.handleCustomeIntegerValue(socket, customeIntegerValue);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected from player controller');
            });
        });
    }

    handlePlayerTransform(socket, playerTransform) {
        console.log('Received Player Transform:', playerTransform);
        // Process player transform and broadcast if necessary
        this.io.emit('updatePlayerTransform', playerTransform);
    }

    handlePlayerData(socket, playerData) {
        console.log('Received Player Data:', playerData);
        // Process player data and broadcast if necessary
        this.io.emit('updatePlayerData', playerData);
    }

    handleCustomeIntegerValue(socket, customeIntegerValue) {
        console.log('Received Custom Integer Value:', customeIntegerValue);
        // Process custom integer value and broadcast if necessary
        this.io.emit('updateCustomeIntegerValue', customeIntegerValue);
    }
}

module.exports = PlayerController;
