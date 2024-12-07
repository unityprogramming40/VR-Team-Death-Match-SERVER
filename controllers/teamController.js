class TeamController {
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

            //
            socket.on('getTeams', () => this.getTeams(socket));

            socket.on('disconnect', () => console.log('Client disconnected from admin controller'));
        });
    }



    getTeams(socket) {
        try {
            console.log('ON-Received Get Teams');

            socket.emit('Teams', { team: this.teams });
            
        } catch (error) {
            console.error('Error in GetTeams:', error);
        }
    }


}

module.exports = TeamController;
