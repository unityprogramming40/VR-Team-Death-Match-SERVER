const PlayerTransform = require('../models/player/PlayerTransform');
const PlayerData = require('../models/player/PlayerData');

const PlayersData = [
    new PlayerData("201", "p1", 100, 1, 15, 2),
    new PlayerData("202", "p2", 100, 1, 15, 2)
];

const PlayersTransform = [
    new PlayerTransform(
        "201",
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3],
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3],
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3]
    ),
    new PlayerTransform(
        "202",
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3],
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3],
        [2.1, 1.1, 12.3], [2.1, 1.1, 12.3]
    )
];

class PlayerController {
    constructor(io) {
        this.io = io;
        this.initializeSocketEvents(io);
    }

    initializeSocketEvents(io) {
        io.on('connection', (socket) => {
            console.log('New client connected to player controller');

            socket.on('playerTransform', (data) => this.handlePlayerTransform(socket, data));
            socket.on('playerData', (data) => this.handlePlayerData(socket, this.createPlayerData(data)));
            socket.on('disconnect', () => console.log('Client disconnected from player controller'));
        });
    }

    createPlayerData(data) {
        return new PlayerData(data.playerID, data.name, data.health, data.teamID, data.killpoints, data.resetpointID);
    }

    findAndUpdatePlayer(players, playerID, updateFn) {
        const player = players.find(p => p.playerID === playerID);
        if (player) {
            updateFn(player);
            return player;
        }
        return null;
    }

    emitAndLog(socket, event, data, successMessage, errorMessage) {
        if (data) {
            socket.emit(event, data);
            console.log(successMessage);
        } else {
            console.log(errorMessage);
        }
    }

    handlePlayerTransform(socket, data) {
        console.log('Received Player Transform:', data);

        const updateTransform = (player) => {
            player.headPosition = data.headPosition;
            player.headRotation = data.headRotation;
            player.rHandPosition = data.rHandPosition;
            player.rHandRotation = data.rHandRotation;
            player.lHandPosition = data.lHandPosition;
            player.lHandRotation = data.lHandRotation;
        };

        let player = this.findAndUpdatePlayer(PlayersTransform, data.playerID, updateTransform);
        if (!player) {
            player = new PlayerTransform(
                data.playerID,
                data.headPosition,
                data.headRotation,
                data.rHandPosition,
                data.rHandRotation,
                data.lHandPosition,
                data.lHandRotation
            );
            PlayersTransform.push(player);
        }

        this.emitAndLog(
            socket,
            'updatePlayerTransform',
            player,
            "PlayerTransform => done",
            "PlayerTransform => not found"
        );
    }

    handlePlayerData(socket, data) {
        console.log('Received Player Data:', data);

        const updatePlayerData = (player) => {
            player.name = data.name;
            player.health = data.health;
            player.teamID = data.teamID;
            player.killpoints = data.killpoints;
            player.resetpointID = data.resetpointID;
        };

        let player = this.findAndUpdatePlayer(PlayersData, data.playerID, updatePlayerData);
        if (!player) {
            player = this.createPlayerData(data);
            PlayersData.push(player);
        }

        this.emitAndLog(
            socket,
            'updatePlayerData',
            player,
            "PlayerData => done",
            "PlayerData => not found"
        );
    }

    handleCustomUpdate(socket, data, field, event, successMessage, errorMessage) {
        const updateField = (player) => {
            player[field] = data.intValue;
        };

        const player = this.findAndUpdatePlayer(PlayersData, data.playerID, updateField);
        this.emitAndLog(socket, event, player, successMessage, errorMessage);
    }

    handleHealthChange(socket, data) {
        console.log('Received Player Health Change:', data);
        this.handleCustomUpdate(
            socket,
            data,
            'health',
            'updatePlayerHealthChange',
            "Player Health Changed => done",
            "Player Health Changed => error wrong id"
        );
    }

    handleTeamChange(socket, data) {
        console.log('Received Player Team Change:', data);
        this.handleCustomUpdate(
            socket,
            data,
            'teamID',
            'updatePlayerTeamChange',
            "Player Team Changed => done",
            "Player Team Changed => error wrong id"
        );
    }

    handleResetPointChange(socket, data) {
        console.log('Received Player Reset Point Change:', data);
        this.handleCustomUpdate(
            socket,
            data,
            'resetpointID',
            'updatePlayerResetPointChange',
            "Player Reset Point Changed => done",
            "Player Reset Point Changed => error wrong id"
        );
    }

    handleAddKillPoint(socket, data) {
        console.log('Received Player Add Kill Point:', data);

        const addKillPoint = (player) => {
            player.killpoints += 1;
        };

        const player = this.findAndUpdatePlayer(PlayersData, data.playerID, addKillPoint);
        this.emitAndLog(
            socket,
            'updatePlayerAddKillPoint',
            player,
            "Player Add Kill Point => done",
            "Player Add Kill Point => error wrong id"
        );
    }

    handleDataReset(socket, data) {
        console.log('Received Player Data Reset:', data);

        const resetData = (player) => {
            player.health = 100;
            player.teamID = 0;
            player.killpoints = 0;
        };

        const player = this.findAndUpdatePlayer(PlayersData, data.playerID, resetData);
        this.emitAndLog(
            socket,
            'playerDataReset',
            player,
            "Player Data Reset => done",
            "Player Data Reset => error wrong id"
        );
    }
}

module.exports = PlayerController;
