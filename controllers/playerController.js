const PlayerTransform = require('../models/player/PlayerTransform');
const PlayerData = require('../models/player/PlayerData');
const PlayerModel = require('../models/player/PlayerModel');
const MainController = require('./mainController');

const Players = [];


class PlayerController extends MainController {
    constructor(io) {
        super(io);
        this.teamController = null;
        super.admin = true;

        this.initializeSocketEvents(io);
    }

    initializeSocketEvents(io) {
        io.on('connection', (socket) => {
            console.log('New client connected to player controller');
            ////////////////////////////////
            socket.emit('NewConnect')
            //////////////////////  
            this.SendAllPlayers(socket);
            ////////////////////////////////

            socket.on("playerConnect", (data) => { this.handlePlayerModel(socket, data) })

            socket.on('syncPlayerTransform', (data) => this.handlePlayerTransform(socket, data));

            socket.on('playerData', (data) => this.handlePlayerData(socket, data));

            socket.on('disconnect', () => this.handlePlayerDisconnect());
        });
    }

    setTeamController(teamController) {
        this.teamController = teamController;
    }

    SendAllPlayers(socket) {
        this.SendSocketEmit(socket, "otherPlayers", { Players: Players }, "Send Players", "failed Send Players")
    }

    findAndUpdatePlayer(players, playerID, callBack) {
        if (players.length > 0) {
            this.Debug(players);
            const player = players.find(p => p.playerID === playerID);
            if (player) {
                callBack(player);
                return player;
            }
        }
        return null;
    }

    FindPlayer(playerID) {
        const player = Players.find(p => p.playerID === playerID);
        if (player) {
            return player;
        }
        return null;
    }

    handlePlayerModel(socket, data) {

        var player = this.FindPlayer(data.playerID);
        if (!player) {
            player = new PlayerModel(data.playerID);
            Players.push(this.player);
            this.SendSocketBroadcast(socket, "newPlayerModel", player, "Send Player Model", "Failed Send Player model")
        } else {
            this.Debug("Player Exist")
        }
    }


    handlePlayerTransform(socket, data) {
        //console.log('Received Player Transform:', data);

        const syncTransformCallBack = (player) => {
            player.headPosition = data.headPosition;
            player.headRotation = data.headRotation;
            player.rHandPosition = data.rHandPosition;
            player.rHandRotation = data.rHandRotation;
            player.lHandPosition = data.lHandPosition;
            player.lHandRotation = data.lHandRotation;
        };

        let player = this.findAndUpdatePlayer(Players, data.playerID, syncTransformCallBack);

        if (player) {

            this.SendSocketBroadcast(
                socket,
                'syncPlayerTransform',
                player,
                "syncPlayerTransform => done",
                "syncPlayerTransform => not found"
            );

        } else {
            this.DebugError("Sync Player Transfor Error")
        }
    }

    handlePlayerData(socket, data) {

        const updatePlayerData = (player) => {
            player.name = data.name;
            player.health = data.health;
            player.teamID = data.teamID;
            player.killpoints = data.killpoints;
            player.resetpointID = data.resetpointID;
        };

        let player = this.findAndUpdatePlayer(Players, data.playerID, updatePlayerData);

        if (player) {

            this.SendSocketBroadcast(
                socket,
                'updatePlayerData',
                player,
                "PlayerData => done",
                "PlayerData => not found"
            );
            this.teamController.addPlayerToTeam(player.playerID, player.teamID);
        }



    }


    handlePlayerDisconnect() {
        console.log('Client disconnected from player controller')
    }

    /*
    
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
            this.SendSocketEmit(
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
            this.SendSocketEmit(
                socket,
                'playerDataReset',
                player,
                "Player Data Reset => done",
                "Player Data Reset => error wrong id"
            );
        }
    
    
        handleCustomUpdate(socket, data, field, event, successMessage, errorMessage) {
            const updateField = (player) => {
                player[field] = data.intValue;
            };
    
            const player = this.findAndUpdatePlayer(PlayersData, data.playerID, updateField);
            this.SendSocketEmit(socket, event, player, successMessage, errorMessage);
        }
    */



}

module.exports = PlayerController;
