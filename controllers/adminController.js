const TeamChange = require('../models/admin/TeamChange');
const PlayerNameChange = require('../models/admin/PlayerNameChange');
const ChangePosition = require('../models/admin/ChangePosition');
const IntegerValue = require('../models/admin/IntegerValue');

class AdminController {
    constructor(io, playerControl) {
        this.io = io;
        this.playerControl = playerControl;

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
        socket.emit('updateTeamChange', teamChange);
    }

    handlePlayerNameChange(socket, data) {
        console.log('Received Player Name Change:', data);

        const player = this.playerControl.PlayersData.find(p => p.playerID == data.playerID);

        if (player) {
            player.name = data.playerName;
            socket.emit('updatePlayerName', data);

            console.log("Player Change Name =>done");
        }
        else {
            console.log("Player Change Name ID =>not found");
        }
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
