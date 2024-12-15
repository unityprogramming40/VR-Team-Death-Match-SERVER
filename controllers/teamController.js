const TeamData = require('../models/team/TeamData');
const MainController = require('./mainController');


class TeamController extends MainController{
    /**
     * AdminController handles admin-related events via Socket.IO.
     * @param {object} io - The Socket.IO instance.
     * @param {object} playerControl - Reference to the PlayerController instance.
     */
    
    constructor(io) {
        super(io);

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
            //console.log('New client connected to admin controller');

            //
            socket.on('getTeams', () => this.sendTeams(socket));
            socket.on('renameTeam', (data) => this.RenameTeam(socket, data));

            socket.on('disconnect', () => console.log(''));
        });
    }



    sendTeams(socket) {
        try {
            //console.log('ON-Received Get Teams');

            socket.emit('Teams', { team: this.teams });

        } catch (error) {
            console.error('Error in GetTeams:', error);
        }
    }

    getTeams() {
        return this.teams;
    }



    RenameTeam(socket, data) {
        const team = this.teams.find(t => t.teamID === data.iValue);
        if (data) {
            if (team) {
                team.teamName = data.sID;
                console.log('RenamedTeam', team)
                
            } else {
                console.error('Team is Null')
            }
        } else {
            console.error('Data is Null')

        }


    }

    addPlayerToTeam(playerID, teamID) {

        const team = this.teams.find(team => team.teamID === teamID);

        if (team) {
            if (team.players.includes(playerID)) {
                console.log(`Player ${playerID} is already in Team ${teamID}`);
            } else {
                team.players.push(playerID);
                console.log('addPlayerTeam', team);
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
        console.log('addedTeamPoint', team)
    }

    resetTeamPoints(teamID) {
        const team = this.teams.find(teamID);
        team.teamPoints = 0;

        const players = team.players;
        players.forEach(playerID => {
            const player = this.playerController.FindPlayer(playerID)

            player.killpoints = 0;

        });

        console.log('resetTeamPoints', team)
    }





}

module.exports = TeamController;
