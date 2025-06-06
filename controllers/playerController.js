const PlayerTransform = require('../models/player/PlayerTransform');

const PlayerData = require('../models/player/PlayerData');
const PlayerModel = require('../models/player/PlayerModel');
const MainController = require('./mainController');
const TeamController = require('./teamController');
const TransformJSON = require('../models/TransformJSON');
const GameplayController = require('./gameplayController');
const IntegerValue = require('../models/admin/IntegerValue');


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

            this.SendAllPlayers(socket);

            this.Debug('New client connected to PlayerController.');

            this.SendSocketEmit(socket, "newConnect", { id: socket.id }, "Connected", "Failed", false);

            socket.on('Connected', (data) => this.StartConnect(socket, data));


            socket.on('syncPlayerTransform', (data) => this.handleSyncPlayerTransform(socket, data));

            socket.on('changePlayerSpawn', (data) => this.handleChangePlayerSpawn(socket, data));

            socket.on("playerDamage", (data) => this.handleDamagePlayer(socket, data));
            socket.on("playerRevive", (data) => this.handleRevivePlayer(socket, data));

            socket.on("starttst1", (data) => {
                console.log(data);
                this.SendSocketBroadcast(socket, 'starttst1', data, 'tst1 successfully', 'tst1 Failded')

            }
            );

            socket.on("tst1", (data) => this.handleTest1(socket, data));
            // socket.on('playerData', (data) => this.handlePlayerData(socket, data));



            // socket.on('disconnect', () => this.handlePlayerDisconnect(socket));
            socket.on('discon', (data) => this.handlePlayerDiscon(socket, data));
            socket.on('restartPlayer', (data) => this.handlePlayerRestart(socket, data));
        });
    }

    /**
 * .
 * @param {PlayerData} data - .
 */
    StartConnect(socket, data) {
        if (data.playerID == "player") {
            const playerID = "00" + (data.resetpointID + 1) + "00"
            // const playerID = socket.id;

            let player = this.FindPlayer(playerID);
            if (!player) {
                player = new PlayerModel(playerID, data.resetpointID);
                // player = new PlayerModel(playerID, this.Players.length);

                this.Players.push(player);

                this.SendSocketEmit(socket, "PlayerSetUp", player,
                    "new player created successfully",
                    "Failed to send main player model"
                );
                this.SendSocketBroadcast(socket, "newPlayerConnected", player,
                    "New player sent to Others successfully",
                    "Failed to send new player model"
                );

                this.teamController?.addPlayerToTeam(player.playerID, player.playerData.teamID);

                this.SentLatePlayer(socket)

                this.Debug("Player Connect  ");
            
            } else {
                this.Debug("Player already exists:", player.playerTransform.playerID);
                this.SentLatePlayer(socket)
                
            }
        } else {
            this.Debug("Admin Connect ");

        } 11
    }

    /**
     * Sets the TeamController instance.
     * @param {TeamController} teamController - The TeamController instance.
     */
    setTeamController(teamController) {
        this.teamController = teamController;
    }

    SentLatePlayer(socket){

        if (this.gamePlayController.gameData.mainTimer > 0) {
            this.SendSocketEmit(socket, "Set Timer", new IntegerValue(this.gamePlayController.gameData.currentTime), "Late Timer Sent", "Timers Error");
        }
        if (this.gamePlayController.gameData.currentEnvID > 0) {
            this.SendSocketEmit(socket, "Set Map", new IntegerValue(this.gamePlayController.gameData.currentEnvID), "Late Map Sent", "Map Error");
        }
        if (this.gamePlayController.gameData.gameStarted) {
            this.SendSocketEmit(socket, "gameStarted", new IntegerValue(0), "Late game started", "");
        }
        if (this.gamePlayController.gameData.gamePaused) {
            this.SendSocketEmit(socket, "gamePaused", new IntegerValue(0), "Late game paused", "");
        }
    }

    /**
     * Sets the GamePlayController instance.
     * @param {GameplayController} gamePlayController - The gamePlayController instance.
     */
    setGamePlayController(gamePlayController) {
        this.gamePlayController = gamePlayController;
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
     * @returns {PlayerData|null} - The found player or null if not found.
     */
    FindPlayer(playerID) {
        return this.Players.find(p => p.playerID === playerID) || null;
    }

    /**
     * Handles synchronization of player transforms.
     * @param {object} socket - The client's socket instance.
     * @param {object} data - The player transform data.
     */
    handleSyncPlayerTransform(socket, data) {
        if (!data || !data.playerID) {
            this.DebugError("Invalid data received for syncPlayerTransform.");
            return;
        }

        const syncTransformCallBack = (player) => {
            player.playerTransform.headTranform = data.headTranform;
            player.playerTransform.rHandTransform = data.rHandTransform;
            player.playerTransform.lHandTransform = data.lHandTransform;
        };

        const player = this.findAndUpdatePlayer(this.Players, data.playerID, syncTransformCallBack);

        if (player) {
            this.SendSocketBroadcast(
                socket,
                'syncPlayerTransform',
                player.playerTransform,
                "Player transform synchronized successfully",
                "Player transform synchronization failed", false);
        } else {
            this.DebugError("Player not found for transform synchronization.");
        }
    }

    /**
     * Handles synchronization of player transforms.
     * @param {object} socket - The client's socket instance.
     * @param {TransformJSON} data - The player transform data.
     */
    handleChangePlayerSpawn(socket, data) {
        if (!data || !data.ID) {
            this.DebugError("Invalid data received for syncPlayerTransform.");
            return;
        }
        console.log(data)

        this.SendSocketALL(
            socket,
            'changePlayerSpawn',
            data,
            "Player spawn Changed successfully",
            "Player spawn Change failed");

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

            this.SendSocketBroadcast(socket, "playerDisconnect", player.playerData, "Player Disconnect Succesfully.." + PID, "Player Disconnect Failed")

        } else {
            this.DebugError("Player Nulll || Admin Disconnect...");
        }
    }

    handlePlayerDiscon(socket, data) {

        const P = this.Players.find(p => p.playerData.resetpointID === data.resetpointID)

        if (P) {

            this.teamController.removePlayerFromTeam(P.playerID, P.playerData.teamID)

            this.Players = this.Players.filter(player => player.playerID !== P.playerID)

            this.SendSocketALL(socket, "playerDisconnect", P.playerData, "Player Disconnect Succesfully.." + P.playerID, "Player Disconnect Failed")

        } else {
            this.DebugError("Player Nulll || Admin Disconnect...");
        }
    }
    handlePlayerRestart(socket, data) {

        const P = this.Players.find(p => p.playerData.resetpointID === data.resetpointID)

        if (P) {

            this.teamController.removePlayerFromTeam(P.playerID, P.playerData.teamID)

            this.Players = this.Players.filter(player => player.playerID !== P.playerID)

            this.SendSocketBroadcast(socket, "restartPlayer", P.playerData, "Player Restart Succesfully.." + P.playerID, "Player Restart Failed")

        } else {
            this.DebugError("Player Nulll || Admin Disconnect...");
        }
    }

    handleDamagePlayer(socket, data) {
        this.Debug('Received Player Health Change:', data);

        const playerData = this.FindPlayer(data.playerID).playerData;

        if (playerData) {
            if (playerData.health > data.damage) {

                playerData.health -= data.damage;

                this.SendSocketALL(socket, 'PlayerDamage', playerData, 'Player Health Change successfully', 'Player Health Change Failded');

            } else { ///////   When Dead-->


                playerData.health = 0;
                this.SendSocketALL(socket, 'playerDead', data, 'player Dead successfully', 'player Dead Failded');
                const attackerPlayer = this.FindPlayer(data.attackerID);
                if (attackerPlayer != null) {

                    const attackerPlayerData = attackerPlayer.playerData;

                    attackerPlayerData.AddKillpoint();/////////////////////////////////

                    this.SendSocketALL(socket, 'addKillpoint', attackerPlayerData, 'attackerPlayerData  Change successfully', 'attackerPlayerData Change Failded', false);


                    this.teamController.addTeamPoint(socket, data.teamID);
                }


            }

        } else {
            const error = `Player ID ${data.playerID} not found.`;
            this.DebugError(error);
            socket.emit('playerHealthChangeError', { error });
        }
    }
    handleRevivePlayer(socket, data) {
        this.Debug('Revive Revive Revive Player:', data);

        const playerData = this.FindPlayer(data.playerID).playerData;

        if (playerData) {

            playerData.health = 100;

            this.SendSocketALL(socket, 'PlayerRevive', playerData, 'Player Health Change successfully', 'Player Health Change Failded', false);

        } else {
            const error = `Player ID ${data.playerID} not found.`;
            this.DebugError(error);
            socket.emit('playerHealthChangeError', { error });
        }
    }
    handleTest1(socket, data) {

        this.SendSocketBroadcast(socket, 'tst1', data, 'tst1 successfully', 'tst1 Failded');
    }
    sendRestPlayersHealth(socket) {
        this.Players.forEach(player => {
            if (player && player.playerData) {
                player.playerData.health = 100; // Assuming maxHealth exists
                this.SendSocketALL(socket, 'restPlayerhealth', player.playerData, 'Player Health Reset Successfully', 'Player Health Reset Failed');
            }
        });
    }
}


module.exports = PlayerController;
