const TeamChange = require('../models/admin/TeamChange');
const PlayerNameChange = require('../models/admin/PlayerNameChange');
const ChangePosition = require('../models/admin/ChangePosition');
const IntegerValue = require('../models/admin/IntegerValue');

class AdminController {
    /**
     * AdminController handles admin-related events via Socket.IO.
     * @param {object} io - The Socket.IO instance.
     * @param {object} playerControl - Reference to the PlayerController instance.
     */
    constructor(io, playerControl) {
        this.io = io;
        this.playerControl = playerControl;

        // Initialize teams
        this.teams = [
            { teamID: 1, teamName: 'Team Alpha', players: [] },
            { teamID: 2, teamName: 'Team Bravo', players: [] }
        ];

        this.initializeSocketEvents(io);
    }

    /**
     * Initializes Socket.IO event listeners.
     * @param {object} io - The Socket.IO instance.
     */
    initializeSocketEvents(io) {
        io.on('connection', (socket) => {
            console.log('New client connected to admin controller');

            socket.on('teamChange', (data) => this.handleTeamChange(socket, new TeamChange(data.playerID, data.newTeamID)));
            socket.on('playerNameChange', (data) => this.handlePlayerNameChange(socket, new PlayerNameChange(data.playerID, data.playerName)));
            socket.on('changePosition', (data) => this.handleChangePosition(socket, new ChangePosition(data.id, data.position)));
            socket.on('integerValue', (data) => this.handleIntegerValue(socket, new IntegerValue(data.idValue)));

            socket.on('disconnect', () => console.log('Client disconnected from admin controller'));
        });
    }

    /**
     * Handles team change requests and updates the teams array.
     * @param {object} socket - The client's socket instance.
     * @param {object} teamChange - The TeamChange instance.
     */
    handleTeamChange(socket, teamChange) {
        console.log('Received Team Change:', teamChange);

        // Validate input
        if (!teamChange.playerID || typeof teamChange.newTeamID !== 'number') {
            console.error('Invalid team change data:', teamChange);
            socket.emit('teamChangeError', { error: 'Invalid team change data.' });
            return;
        }

        const player = this.playerControl.PlayersData.find(p => p.playerID === teamChange.playerID);

        if (player) {
            const oldTeamID = player.teamID;
            player.teamID = teamChange.newTeamID;

            // Update teams array
            this.removePlayerFromTeam(player.playerID, oldTeamID);
            this.addPlayerToTeam(player.playerID, teamChange.newTeamID);

            console.log(`Player ${player.playerID} moved from Team ${oldTeamID} to Team ${player.teamID}.`);

            // Broadcast the change
            this.io.emit('updateTeamChange', {
                playerID: player.playerID,
                oldTeamID,
                newTeamID: player.teamID
            });

            // Acknowledge success
            socket.emit('teamChangeSuccess', {
                message: `Player ${player.playerID} successfully moved to Team ${player.teamID}.`
            });
        } else {
            console.error(`Player ID ${teamChange.playerID} not found.`);
            socket.emit('teamChangeError', { error: `Player ID ${teamChange.playerID} not found.` });
        }
    }

    /**
     * Adds a player to the specified team.
     * @param {string} playerID - The ID of the player to add.
     * @param {number} teamID - The ID of the team.
     */
    addPlayerToTeam(playerID, teamID) {
        const team = this.teams.find(t => t.teamID === teamID);
        if (team) {
            team.players.push(playerID);
            console.log(`Player ${playerID} added to ${team.teamName}.`);
        } else {
            console.error(`Team ID ${teamID} not found.`);
        }
    }

    /**
     * Removes a player from their current team.
     * @param {string} playerID - The ID of the player to remove.
     * @param {number} teamID - The ID of the team.
     */
    removePlayerFromTeam(playerID, teamID) {
        const team = this.teams.find(t => t.teamID === teamID);
        if (team) {
            team.players = team.players.filter(id => id !== playerID);
            console.log(`Player ${playerID} removed from ${team.teamName}.`);
        } else {
            console.error(`Team ID ${teamID} not found.`);
        }
    }

    /**
     * Handles player name change requests.
     * @param {object} socket - The client's socket instance.
     * @param {object} playerNameChange - The PlayerNameChange instance.
     */
    handlePlayerNameChange(socket, playerNameChange) {
        console.log('Received Player Name Change:', playerNameChange);

        const player = this.playerControl.PlayersData.find(p => p.playerID === playerNameChange.playerID);

        if (player) {
            player.name = playerNameChange.playerName;

            // Broadcast the updated player name
            this.io.emit('updatePlayerName', playerNameChange);

            console.log("Player Name Change processed successfully.");
        } else {
            console.error(`Player ID ${playerNameChange.playerID} not found.`);
            socket.emit('playerNameChangeError', { error: `Player ID ${playerNameChange.playerID} not found.` });
        }
    }

    /**
     * Handles position change requests.
     * @param {object} socket - The client's socket instance.
     * @param {object} changePosition - The ChangePosition instance.
     */
    handleChangePosition(socket, changePosition) {
        console.log('Received Change Position:', changePosition);

        // Broadcast the position change event
        this.io.emit('updateChangePosition', changePosition);
        console.log("Position Change processed and broadcasted.");
    }

    /**
     * Handles integer value updates.
     * @param {object} socket - The client's socket instance.
     * @param {object} integerValue - The IntegerValue instance.
     */
    handleIntegerValue(socket, integerValue) {
        console.log('Received Integer Value:', integerValue);

        // Broadcast the integer value update
        this.io.emit('updateIntegerValue', integerValue);
        console.log("Integer Value processed and broadcasted.");
    }
}

module.exports = AdminController;
