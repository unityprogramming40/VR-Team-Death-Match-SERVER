const TeamData = require('../models/team/teamData');
const MainController = require('./mainController');

/**
 * TeamController manages team-related operations and events via Socket.IO.
 */
class TeamController extends MainController {
    /**
     * @param {object} io - The Socket.IO instance.
     */
    constructor(io) {
        super(io);

        this.playerController = null;

        // Initialize teams
        this.Teams = [
            new TeamData(1, 'Team Alpha', 0, []),
            new TeamData(2, 'Team Bravo', 0, [])
        ];

        this.initializeSocketEvents(io);
    }

    /**
     * Sets the PlayerController instance.
     * @param {object} playerController - The PlayerController instance.
     */
    setPlayerController(playerController) {
        this.playerController = playerController;
    }

    /**
     * Initializes Socket.IO event listeners.
     * @param {object} io - The Socket.IO instance.
     */
    initializeSocketEvents(io) {
        io.on('connection', (socket) => {

            this.sendTeams(socket)

            socket.on('renameTeam', (data) => this.renameTeam(socket, data));

            // socket.on('disconnect', () => this.Debug('Client disconnected from TeamController.'));
        });
    }

    /**
     * Sends all teams to the connected client.
     * @param {object} socket - The client's socket instance.
     */
    sendTeams(socket) {
        try {
            this.SendSocketEmit(socket, 'Teams', { Teams: this.Teams }, "Teams Sent to Client", "Failed Send Teams");
        } catch (error) {
            this.DebugError('Error in sendTeams:', error);
        }
    }

    /**
     * Returns all teams.
     * @returns {TeamData[]} The list of teams.
     */
    getTeams() {
        return this.Teams;
    }
 
    FindTeam(teamID) {
        return this.Teams.find(t=>t.teamID==teamID);
    }

    /**
     * Renames a team based on the provided data.
     * @param {object} socket - The client's socket instance.
     * @param {object} data - The data containing `iValue` (teamID) and `sID` (new name).
     */
    renameTeam(socket, data) {
        if (!data || typeof data.iValue !== 'number' || typeof data.sID !== 'string') {
            this.DebugError('Invalid data received for renameTeam:', data);
            return;
        }

        const team = this.FindTeam(data.iValue);
        if (team) {
            team.teamName = data.sID;
            this.Debug(`Renamed Team ${data.iValue} to "${data.sID}".`, team);
        } else {
            this.DebugError(`Team with ID ${data.iValue} not found.`);
        }
    }

    /**
     * Adds a player to a team.
     * @param {string} playerID - The ID of the player to add.
     * @param {number} teamID - The ID of the team.
     */
    addPlayerToTeam(playerID, teamID) {
        const team = this.FindTeam(teamID);

        if (team) {
            if (team.players.includes(playerID)) {
                this.Debug(`Player ${playerID} is already in Team ${teamID}.`);
            } else {
                team.players.push(playerID);
                this.Debug(`Player ${playerID} added to Team ${teamID}.`, team);
            }
            
        } else {
            this.DebugError(`Team with ID ${teamID} not found.`);
        }
    }

    /**
     * Removes a player from a team.
     * @param {string} playerID - The ID of the player to remove.
     * @param {number} teamID - The ID of the team.
     */
    removePlayerFromTeam(playerID, teamID) {
        const team = this.FindTeam(teamID);

        if (team) {
            if (team.players.includes(playerID)) {
                team.players = team.players.filter(id => id !== playerID);
                
                this.Debug(`Player ${playerID} removed from Team ${teamID}.`, team);
            } else {
                this.DebugError(`Player ${playerID} not found in Team ${teamID}.`);
            }
        } else {
            this.DebugError(`Team with ID ${teamID} not found.`);
        }
    }

    /**
     * Adds a point to a team's score.
     * @param {number} teamID - The ID of the team.
     */
    addTeamPoint(socket,teamID) {
        const team = this.FindTeam(teamID);

        if (team) {
            team.teamPoints++;
            this.SendSocketALL(socket, 'updateTeamPoints', team, 'Team send successfully', 'updateTeam Failded');

            this.Debug(`Point added to Team ${teamID}. Current points: ${team.teamPoints}.`, team);
        } else {
            this.DebugError(`Team with ID ${teamID} not found.`);
        }
    }

    /**
     * Resets a team's points and all associated players' kill points.
     * @param {number} teamID - The ID of the team.
     */
    resetTeamPoints(teamID) {
        const team = this.FindTeam(teamID);

        if (team) {
            team.teamPoints = 0;

            team.players.forEach(playerID => {
                const player = this.playerController?.FindPlayer(playerID);
                if (player) {
                    player.killpoints = 0;
                }
            });

            this.Debug(`Points reset for Team ${teamID}.`, team);
        } else {
            this.DebugError(`Team with ID ${teamID} not found.`);
        }
    }
}

module.exports = TeamController;
