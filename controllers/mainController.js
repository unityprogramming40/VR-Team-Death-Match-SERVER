class MainController {

    constructor(io) {
        this.io = io;

    }

    static playerId = null;
    static admin = false;

    // Static method to set the playerId
    static setPlayerId(id) {
        this.playerId = id;
    }

    // Instance method to get the playerId
    getPlayerId() {
        return MainController.playerId;
    }

    Debug(message) {
        console.log(message);
    }

    DebugError(message) {
        console.error(message);
    }


    SendSocketEmit(socket, event, data, successMessage, errorMessage) {
        if (data) {
            socket.emit(event, data);

            //this.Debug(successMessage);
        } else {
            this.DebugError(errorMessage);
        }

    }

    SendSocketBroadcast(socket, event, data, successMessage, errorMessage) {
        if (data) {
            socket.broadcast.emit(event, data);

            //this.Debug(successMessage);
        } else {
            this.DebugError(errorMessage);
        }

    }

}

module.exports = MainController;
