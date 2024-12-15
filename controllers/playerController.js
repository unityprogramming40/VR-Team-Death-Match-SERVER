const PlayerTransform = require('../models/player/PlayerTransform');
const PlayerData = require('../models/player/PlayerData');
const PlayerModel = require('../models/player/PlayerModel');
const MainController = require('./mainController');

const Players = [];

/**
 * PlayerController manages player-related operations and Socket.IO events.
 */
class PlayerController extends MainController {
    /**
     * @param {object} io - The Socket.IO instance.
     */
    constructor(io) {
        super(io);
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
            console.log('New client connected to PlayerController.');

            // Emit initial data and setup events
            socket.emit('NewConnect');
            this.SendAllPlayers(socket);

            socket.on("playerConnect", (data) => this.handlePlayerModel(socket, data));
            socket.on('syncPlayerTransform', (data) => this.handlePlayerTransform(socket, data));
            socket.on('playerData', (data) => this.handlePlayerData(socket, data));
            socket.on('disconnect', () => this.handlePlayerDisconnect());
        });
    }

    /**
     * Sets the TeamController instance.
     * @param {object} teamController - The TeamController instance.
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
            { Players: Players },
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
        return Players.find(p => p.playerID === playerID) || null;
    }

    /**
     * Handles player connection and model creation.
     * @param {object} socket - The client's socket instance.
     * @param {object} data - The player data.
     */
    handlePlayerModel(socket, data) {
        if (!data || !data.playerID) {
            this.DebugError("Invalid player data received for playerConnect.");
            return;
        }

        let player = this.FindPlayer(data.playerID);
        if (!player) {
            player = new PlayerModel(data.playerID);
            Players.push(player);
            this.SendSocketBroadcast(
                socket,
                "newPlayerModel",
                player,
                "New player model sent successfully",
                "Failed to send new player model"
            );
        } else {
            this.Debug("Player already exists:", player.playerID);
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
            player.headPosition = data.headPosition;
            player.headRotation = data.headRotation;
            player.rHandPosition = data.rHandPosition;
            player.rHandRotation = data.rHandRotation;
            player.lHandPosition = data.lHandPosition;
            player.lHandRotation = data.lHandRotation;
        };

        const player = this.findAndUpdatePlayer(Players, data.playerID, syncTransformCallBack);

        if (player) {
            this.SendSocketBroadcast(
                socket,
                'syncPlayerTransform',
                player,
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
            player.name = data.name;
            player.health = data.health;
            player.teamID = data.teamID;
            player.killpoints = data.killpoints;
            player.resetpointID = data.resetpointID;
        };

        const player = this.findAndUpdatePlayer(Players, data.playerID, updatePlayerData);

        if (player) {
            this.SendSocketBroadcast(
                socket,
                'updatePlayerData',
                player,
                "Player data updated successfully",
                "Failed to update player data"
            );
            this.teamController?.addPlayerToTeam(player.playerID, player.teamID);
        } else {
            this.DebugError("Player not found for data update.");
        }
    }

    /**
     * Handles player disconnection.
     */
    handlePlayerDisconnect() {
        console.log('Client disconnected from PlayerController.');
    }
}

module.exports = PlayerController;
