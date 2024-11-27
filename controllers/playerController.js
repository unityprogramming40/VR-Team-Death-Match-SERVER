const PlayerTransform = require('../models/player/PlayerTransform');
const PlayerData = require('../models/player/PlayerData');
const CustomeIntegerValue = require('../models/player/CustomeIntegerValue');

var PlayersData = [new PlayerData("201", 100, 1, 15, 2), new PlayerData("202", 100, 1, 15, 2)];
var PlayersTransform = [
    new PlayerTransform("201",
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3],
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3],
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3]),
    new PlayerTransform("202",
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3],
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3],
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3])];

class PlayerController {
    constructor(io) {
        this.io = io;

        io.on('connection', (socket) => {
            console.log('New client connected to player controller');

            socket.on('playerTransform', (data) => {

                this.handlePlayerTransform(socket, data);
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

            socket.on('disconnect', () => {
                console.log('Client disconnected from player controller');
            });
        });
    }

    handlePlayerTransform(socket, data) {
        console.log('Received Player Transform:', data);

        // Process player transform and broadcast if necessary

        const player = PlayersTransform.find(p => p.playerID == data.playerID);

        if (player) {

            player.headPosition = data.headPosition;
            player.headRotation = data.headRotation;
            player.rHandPosition = data.rHandPosition;
            player.rHandRotation = data.rHandRotation;
            player.lHandPosition = data.lHandPosition;
            player.lHandRotation = data.lHandRotation;

            socket.emit('updatePlayerTransform', player);

            console.log("PlayerTransform =>done");

        } else {
            const playerTransform = new PlayerTransform(
                data.playerID,
                data.headPosition,
                data.headRotation,
                data.rHandPosition,
                data.rHandRotation,
                data.lHandPosition,
                data.lHandRotation
            );
            PlayersTransform.push(playerTransform);

            socket.emit('updatePlayerTransform', playerTransform);

            console.log("PlayerTransform =>not found");
        }


    }

    handlePlayerData(socket, data) {
        console.log('Received Player Data:', data);

        // Process player data and broadcast if necessary

        const player = PlayersData.find(p => p.playerID == data.playerID);

        if (player) {

            player.health = data.health;
            player.teamID = data.teamID;
            player.killpoints = data.killpoints;
            player.resetpointID = data.resetpointID;

            socket.emit('updatePlayerData', player);

            console.log("PlayerData =>done");

        } else {
            const playerData = new PlayerData(
                data.playerID,
                data.health,
                data.teamID,
                data.killpoints,
                data.resetpointID
            );
            PlayersData.push(playerData);

            socket.emit('updatePlayerData', playerData);

            console.log("PlayerData =>not found");
        }

    }

    handleHealthChange(socket, data) {
        console.log('Received Player Health Changed:', data);
        // Process custom integer value and broadcast if necessary
        const player = PlayersData.find(p => p.playerID == data.playerID);

        if (player) {

            player.health = data.intValue;

            socket.emit('updatePlayerHealthChange', player);

            console.log("Player Health Changed => done");

        }
        else {
            console.log("Player Health Changed => error wrong id");
        }
    }

    handleTeamChange(socket, data) {
        console.log('Received Player Team Changed:', data);
        // Process custom integer value and broadcast if necessary
        const player = PlayersData.find(p => p.playerID == data.playerID);

        if (player) {

            player.teamID = data.intValue;

            socket.emit('updatePlayerTeamChange', player);

            console.log("Player Team Changed => done");

        }
        else {
            console.log("Player Team Changed => error wrong id");
        }
    }

    handleResetPointChange(socket, data) {
        console.log('Received Player Reset Point Changed:', data);
        // Process custom integer value and broadcast if necessary
        const player = PlayersData.find(p => p.playerID == data.playerID);

        if (player) {

            player.resetpointID = data.intValue;

            socket.emit('updatePlayerResetPointChange', player);

            console.log("Player Reset Point Changed => done");

        }
        else {
            console.log("Player Reset Point Changed => error wrong id");
        }
    }

    handleAddKillPoint(socket, data) {
        console.log('Received Player Add Kill Point:', data);
        // Process custom integer value and broadcast if necessary
        const player = PlayersData.find(p => p.playerID == data.playerID);

        if (player) {

            player.killpoints = player.killpoints++;

            socket.emit('updatePlayerAddKillPoint', player);

            console.log("Player Add Kill Point => done");

        }
        else {
            console.log("Player Add Kill Point => error wrong id");
        }
    }

    handleDataReset(socket, data) {
        console.log('Received Player Data:', data);
        // Process custom integer value and broadcast if necessary
        const player = PlayersData.find(p => p.playerID == data.playerID);

        if (player) {

            player.health = 100;
            player.teamID = 0;
            player.killpoints = 0;

            socket.emit('playerDataReset', player);

            console.log("Player Data Reset => done");

        } else {
            console.log("Player Data Reset => error wrong id");
        }
    }
}

module.exports = PlayerController;
