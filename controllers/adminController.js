const TeamChange = require('../models/TeamChange');
const PlayerNameChange = require('../models/PlayerNameChange');
const ChangePosition = require('../models/ChangePosition');
const IntegerValue = require('../models/IntegerValue');

class AdminController {
    constructor(io) {
        this.io = io;

        io.on('connection', (socket) => {
            console.log('New client connected to admin controller');

            socket.on('teamChange', (data) => {
                const teamChange = new TeamChange(data.playerID, data.newTeamID);
                this.handleTeamChange(socket, teamChange);
            });

            socket.on('playerNameChange', (data) => {
                const playerNameChange = new PlayerNameChange(data.playerID, data.playerName);
                this.handlePlayerNameChange(socket, playerNameChange);
            });

            socket.on('changePosition', (data) => {
                const changePosition = new ChangePosition(data.id, data.position);
                this.handleChangePosition(socket, changePosition);
            });

            socket.on('integerValue', (data) => {
                const integerValue = new IntegerValue(data.idValue);
                this.handleIntegerValue(socket, integerValue);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected from admin controller');
            });
        });
    }

    handleTeamChange(socket, teamChange) {
        console.log('Received Team Change:', teamChange);
        // Process team change and broadcast if necessary
        this.io.emit('updateTeamChange', teamChange);
    }

    handlePlayerNameChange(socket, playerNameChange) {
        console.log('Received Player Name Change:', playerNameChange);
        // Process player name change and broadcast if necessary
        this.io.emit('updatePlayerNameChange', playerNameChange);
    }

    handleChangePosition(socket, changePosition) {
        console.log('Received Change Position:', changePosition);
        // Process position change and broadcast if necessary
        this.io.emit('updateChangePosition', changePosition);
    }

    handleIntegerValue(socket, integerValue) {
        console.log('Received Integer Value:', integerValue);
        // Process integer value and broadcast if necessary
        this.io.emit('updateIntegerValue', integerValue);
    }
}

module.exports = AdminController;
