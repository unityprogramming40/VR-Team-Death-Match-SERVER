const TeamChange = require('../models/admin/TeamChange');
const PlayerNameChange = require('../models/admin/PlayerNameChange');
const ChangePosition = require('../models/admin/ChangePosition');
const IntegerValue = require('../models/admin/IntegerValue');
const MainController = require('./mainController');

class AdminController extends MainController {
    /**
     * AdminController handles admin-related events via Socket.IO.
     * @param {object} io - The Socket.IO instance.
     */
    constructor(io) {
        super(io);
        this.gunController = null;
        this.playerController = null;
        this.teamController = null;
        this.gameplayController = null;

        this.initializeSocketEvents(io);
    }

    /**
     * Initializes Socket.IO event listeners.
     * @param {object} io - The Socket.IO instance.
     */
    initializeSocketEvents(io) {
        io.on('connection', (socket) => {

            socket.on('playerteamChange', (data) => this.handleTeamChange(socket, new TeamChange(data.playerID, data.newTeamID)));
            socket.on('playerNameChange', (data) => this.handlePlayerNameChange(socket, new PlayerNameChange(data.playerID, data.playerName)));
            socket.on('playerTransformChange', (data) => this.handleChangePosition(socket, data));

            socket.on('integerValue', (data) => this.handleIntegerValue(socket, new IntegerValue(data.idValue)));





        });
    }

    // Setter methods for controllers
    setGunController(gunController) {
        this.gunController = gunController;
    }

    setPlayerController(playerController) {
        this.playerController = playerController;
    }

    setTeamController(teamController) {
        this.teamController = teamController;
    }

    setGameplayController(gameplayController) {
        this.gameplayController = gameplayController;
    }



    /**
     * Handles player name change requests.
     * @param {object} socket - The client's socket instance.
     * @param {PlayerNameChange} playerNameChange - The PlayerNameChange instance.
     */
    handlePlayerNameChange(socket, playerNameChange) {
        this.Debug('Received Player Name Change:', playerNameChange);

        const player = this.playerController?.FindPlayer(playerNameChange.playerID);

        if (player) {
            player.playerData.name = playerNameChange.playerName;

            this.SendSocketALL(socket, 'updatePlayerName', playerNameChange, 'Player Name Change successfully', 'Player Name Change Failded');

        } else {
            const error = `Player ID ${playerNameChange.playerID} not found.`;
            this.DebugError(error);
            socket.emit('playerNameChangeError', { error });
        }
    }

    /**
     * Handles team change requests.
     * @param {object} socket - The client's socket instance.
     * @param {TeamChange} teamChange - The TeamChange instance.
     */
    handleTeamChange(socket, teamChange) {
        this.Debug('Received Team Change:', teamChange);

        if (!teamChange.playerID || typeof teamChange.newTeamID !== 'number') {
            const error = 'Invalid team change data.';
            this.DebugError(error, teamChange);
            socket.emit('teamChangeError', { error });
            return;
        }

        const player = this.playerController?.FindPlayer(teamChange.playerID);

        if (player) {
            const oldTeamID = player.playerData.teamID;
            const teamPlayers = this.teamController?.getTeams()?.find(team => team.teamID === oldTeamID)?.players || [];

            if (!teamPlayers.includes(player.playerID)) {
                const error = `Player ${player.playerID} not found in Team ${oldTeamID}.`;
                this.DebugError(error);
                socket.emit('teamChangeError', { error });
                return;
            }

            player.playerData.teamID = teamChange.newTeamID;
            player.playerData.killpoints = 0;

            this.teamController?.removePlayerFromTeam(player.playerID, oldTeamID);
            this.teamController?.addPlayerToTeam(player.playerID, teamChange.newTeamID);

            this.SendSocketALL(socket, 'updatePlayerTeam', teamChange, 'Player Team Change successfully', 'Player Team Change Failded');

            this.Debug(`Player ${player.playerID} moved from Team ${oldTeamID} to Team ${teamChange.newTeamID}.`);

        } else {
            const error = `Player ID ${teamChange.playerID} not found.`;
            this.DebugError(error);
            socket.emit('teamChangeError', { error });
        }
    }

    /**
     * Handles position change requests.
     * @param {object} socket - The client's socket instance.
     * @param {ChangePosition} changePosition - The ChangePosition instance.
     */
    handleChangePosition(socket, data) {
        this.SendSocketBroadcast(socket, "updatePlayerTransform", data, "", "")
        this.Debug("Change Transform" + data.value+data.axis)
    }

    /**
     * Handles integer value updates.
     * @param {object} socket - The client's socket instance.
     * @param {IntegerValue} integerValue - The IntegerValue instance.
     */
    handleIntegerValue(socket, integerValue) {
        this.Debug('Received Integer Value:', integerValue);
        this.io.emit('updateIntegerValue', integerValue);
        this.Debug('Integer Value processed and broadcasted.');
    }



}

module.exports = AdminController;
