const PlayerTransform = require('../models/player/PlayerTransform');
const PlayerData = require('../models/player/PlayerData');
const PlayerModel = require('../models/player/PlayerModel');
const MainController = require('./mainController');
const TeamController = require('./teamController');


/**
 * PlayerController manages player-related operations and Socket.IO events.
 */
class PlayerController extends MainController {
    /**
     * @param {object} io - The Socket.IO instance.
     */
    constructor(io) {
        super(io);

        this.Players = [];


        this.teamController = null;
        super.admin = true;

        this.initializeSocketEvents(io);
    }

    /**
     * Initializes Socket.IO event listeners for player-related events.
     * @param {object} io - The Socket.IO instance.
     */
    initializeSocketEvents(io) {
        io.on('connection', (socket) => {
            this.Debug('New client connected to PlayerController.');

            // Emit initial data and setup events
            socket.emit('NewConnect');

            this.SendAllPlayers(socket);

            socket.on("playerConnect", (data) => this.handlePlayerModel(socket, data));

            socket.on('syncPlayerTransform', (data) => this.handlePlayerTransform(socket, data));

            socket.on('playerData', (data) => this.handlePlayerData(socket, data));

            socket.on('disconnect', () => this.handlePlayerDisconnect(socket));
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
     * Sends all players to the connected client.
     * @param {object} socket - The client's socket instance.
     */
    SendAllPlayers(socket) {
        this.SendSocketEmit(
            socket,
            "otherPlayers",
            { Players: this.Players },
            "Players sent successfully",
            "Failed to send players"
        );
    }

    /**
     * Finds and updates a player based on their ID.
     * @param {object[]} players - The array of players.
     * @param {string} playerID - The ID of the player to find.
     * @param {Function} callBack - The callback function to apply updates.
     * @returns {object|null} - The updated player or null if not found.
     */
    findAndUpdatePlayer(players, playerID, callBack) {
        if (players.length > 0) {
            const player = players.find(p => p.playerID === playerID);
            if (player) {
                callBack(player);
                return player;
            }
        }
        return null;
    }

    /**
     * Finds a player by their ID.
     * @param {string} playerID - The ID of the player to find.
     * @returns {object|null} - The found player or null if not found.
     */
    FindPlayer(playerID) {
        return this.Players.find(p => p.playerID === playerID) || null;
    }

    /**
     * Handles player connection and model creation.
     * @param {object} socket - The client's socket instance.
     * @param {object} data - The player data.
     */
    handlePlayerModel(socket, data) {
        const playerID = socket.id
        if (!data || !playerID) {
            this.DebugError("Invalid player data received for playerConnect.");
            return;
        }

        let player = this.FindPlayer(playerID);
        if (!player) {
            player = new PlayerModel(playerID);
            this.Players.push(player);


            this.SendSocketEmit(socket, "mainPlayer", player, "man player model sent successfully", "Failed to send main player model")
            this.SendSocketBroadcast(
                socket,
                "newPlayerModel",
                player,
                "New player model sent successfully",
                "Failed to send new player model"
            );

            this.teamController?.addPlayerToTeam(player.playerID, player.playerData.teamID);

        } else {
            this.Debug("Player already exists:", player.playerTransform.playerID);
        }
    }

    /**
     * Handles synchronization of player transforms.
     * @param {object} socket - The client's socket instance.
     * @param {object} data - The player transform data.
     */
    handlePlayerTransform(socket, data) {
        if (!data || !data.playerID) {
            this.DebugError("Invalid data received for syncPlayerTransform.");
            return;
        }

        const syncTransformCallBack = (player) => {
            player.playerTransform.headPosition = data.headPosition;
            player.playerTransform.headRotation = data.headRotation;
            player.playerTransform.rHandPosition = data.rHandPosition;
            player.playerTransform.rHandRotation = data.rHandRotation;
            player.playerTransform.lHandPosition = data.lHandPosition;
            player.playerTransform.lHandRotation = data.lHandRotation;
        };

        const player = this.findAndUpdatePlayer(this.Players, data.playerID, syncTransformCallBack);

        if (player) {
            this.SendSocketBroadcast(
                socket,
                'syncPlayerTransform',
                player.playerTransform,
                "Player transform synchronized successfully",
                "Player transform synchronization failed"
            );
        } else {
            this.DebugError("Player not found for transform synchronization.");
        }
    }

    /**
     * Handles updates to player data.
     * @param {object} socket - The client's socket instance.
     * @param {object} data - The player data.
     */
    handlePlayerData(socket, data) {
        if (!data || !data.playerID) {
            this.DebugError("Invalid data received for playerData.");
            return;
        }

        const updatePlayerData = (player) => {
            player.playerData.name = data.name;
            player.playerData.health = data.health;
            player.playerData.teamID = data.teamID;
            player.playerData.killpoints = data.killpoints;
            player.playerData.resetpointID = data.resetpointID;
        };

        const player = this.findAndUpdatePlayer(this.Players, data.playerID, updatePlayerData);

        if (player) {
            this.SendSocketBroadcast(
                socket,
                'updatePlayerData',
                player.playerData,
                "Player data updated successfully",
                "Failed to update player data"
            );
        } else {
            this.DebugError("Player not found for data update.");
        }
    }

    getAllPlayers() {
        return this.Players;
    }

    /**
     * Handles player disconnection.
     */
    handlePlayerDisconnect(socket) {
        const PID = socket.id
        const player = this.FindPlayer(PID)

        if (player) {

            this.teamController.removePlayerFromTeam(PID, player.playerData.teamID)

            this.Players = this.Players.filter(player => player.playerID !== PID)

            this.SendSocketBroadcast(socket, "playerDisconnect", player.playerData, "Player Disconnect Succesfully", "Player Disconnect Failed")

            this.Debug('Player disconnected..' + PID);
        } else {
            this.DebugError("Player Nulll || Admin Disconnect...");
        }
    }
}


module.exports = PlayerController;
