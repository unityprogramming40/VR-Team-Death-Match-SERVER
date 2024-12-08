const TeamData = require('../models/team/TeamData');


class TeamController {
    /**
     * AdminController handles admin-related events via Socket.IO.
     * @param {object} io - The Socket.IO instance.
     * @param {object} playerControl - Reference to the PlayerController instance.
     */
    constructor(io) {
        this.io = io;
        this.playerControl = null;

        // Initialize teams
        this.teams = [
            new TeamData(1, 'Team Alpha', 0, []),
            new TeamData(2, 'Team Bravo', 0, [])
        ];

        this.initializeSocketEvents(io);
    }

    setPlayerController(playerController) {
        this.playerController = playerController;
    }

    /**
     * Initializes Socket.IO event listeners.
     * @param {object} io - The Socket.IO instance.
     */
    initializeSocketEvents(io) {
        io.on('connection', (socket) => {
            console.log('New client connected to admin controller');

            //
            socket.on('getTeams', () => this.sendTeams(socket));

            socket.on('disconnect', () => console.log('Client disconnected from admin controller'));
        });
    }



    sendTeams(socket) {
        try {
            console.log('ON-Received Get Teams');

            socket.emit('Teams', { team: this.teams });

        } catch (error) {
            console.error('Error in GetTeams:', error);
        }
    }

    getTeams() {
        return this.teams;
    }


    addPlayerToTeam(playerID, teamID) {

        const team = this.teams.find(team => team.teamID === teamID);
        
        if (team) {
            if (team.players.includes(playerID)) {
                console.log(`Player ${playerID} is already in Team ${teamID}`);
            } else {
                team.players.push(playerID);
                console.log('addPlayerTeam', this.teams);
            }
        } else {
            console.error(`Team ${teamID} does not exist.`);
        }

    }


    removePlayerFromTeam(playerID, teamID) {
        var team = this.teams.find(team => team.teamID === teamID);

        if (team) {
            if (team.players.includes(playerID)) {
                team.players = team.players.filter(id => id !== playerID);
                console.log('Player removed successfully:', playerID);
            } else {
                console.error(`Player ${playerID} does not exist in Team ${teamID}`);
            }
        } else {
            console.error(`Team ${teamID} does not exist.`);
        }
    }


    addTeamPoint(teamID) {
        const team = this.teams.find(teamID);

        team.teamPoints++;
        console.log('addTeamPoint', team)
    }

    resetPoints() {
        this.resetTeamPoints();
    }

    resetTeamPoints() {
        this.team1Killpoints = 0;
    }



}

module.exports = TeamController;
