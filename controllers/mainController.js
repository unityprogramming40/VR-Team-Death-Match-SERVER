const Logger = require("../models/Logger/Logger");

/**
 * MainController handles socket communication and logging in the application.
 */
class MainController {
    /**
     * @param {object} io - The socket.io instance for managing socket connections.
     */
    constructor(io) {
        this.io = io;
        this.logger = new Logger();

        this.admin = false;
    }



    /**
     * Logs a debug message to the console.
     * @param {string} message - The debug message to log.
     */
    Debug(message) {
        //this.logger.Debug(message);
        console.log(message)
    }

    /**
     * Logs an error message to the console.
     * @param {string} message - The error message to log.
     */
    DebugError(message) {
        //this.logger.DebugError(message);
        console.error(message)

    }

    SendSocketEmit(socket, event, data, successMessage = '', errorMessage = '', logSuccess = true) {
        if (data) {
            socket.emit(event, data);
            if (logSuccess && successMessage) this.Debug(successMessage);
        } else if (errorMessage) {
            this.DebugError(errorMessage);
        }
    }
    
    /**
     * Broadcasts a socket event to all connections except the sender.
     * @param {object} socket - The socket connection initiating the broadcast.
     * @param {string} event - The event name.
     * @param {object} data - The data to send with the event.
     * @param {string} [successMessage] - A message to log on successful broadcast.
     * @param {string} [errorMessage] - A message to log on failure.
     * @param {boolean} [logSuccess=true] - Whether to log the success message.
     */
    SendSocketBroadcast(socket, event, data, successMessage = '', errorMessage = '', logSuccess = true) {
        if (data) {
            socket.broadcast.emit(event, data);
            if (logSuccess && successMessage) this.Debug(successMessage);
        } else if (errorMessage) {
            this.DebugError(errorMessage);
        }
    }
    
    /**
     * Sends a socket event to all connections, including the sender.
     * @param {object} socket - The socket connection initiating the broadcast.
     * @param {string} event - The event name.
     * @param {object} data - The data to send with the event.
     * @param {string} [successMessage] - A message to log on successful broadcast.
     * @param {string} [errorMessage] - A message to log on failure.
     * @param {boolean} [logSuccess=true] - Whether to log the success message.
     */
    SendSocketALL(socket, event, data, successMessage = '', errorMessage = '', logSuccess = true) {
        if (data) {
            socket.emit(event, data);
            socket.broadcast.emit(event, data);
            if (logSuccess && successMessage) this.Debug(successMessage);
        } else if (errorMessage) {
            this.DebugError(errorMessage);
        }
    }
    
}

module.exports = MainController;
