/**
 * MainController handles socket communication and logging in the application.
 */
class MainController {
    /**
     * @param {object} io - The socket.io instance for managing socket connections.
     */
    constructor(io) {
        this.io = io;
    }

    /**
     * @type {string|null} Static player ID, shared across all instances of MainController.
     */
    static playerId = null;

    /**
     * @type {boolean} Indicates if the current instance has admin privileges.
     */
    static admin = false;

    /**
     * Sets the static player ID.
     * @param {string|null} id - The player ID to set.
     */
    static setPlayerId(id) {
        if (typeof id !== 'string' && id !== null) {
            throw new TypeError('playerId must be a string or null.');
        }
        this.playerId = id;
    }

    /**
     * Gets the static player ID.
     * @returns {string|null} The player ID.
     */
    getPlayerId() {
        return MainController.playerId;
    }

    /**
     * Logs a debug message to the console.
     * @param {string} message - The debug message to log.
     */
    Debug(message) {
        console.log(`[DEBUG]: ${message}`);
    }

    /**
     * Logs an error message to the console.
     * @param {string} message - The error message to log.
     */
    DebugError(message) {
        console.error(`[ERROR]: ${message}`);
    }

    /**
     * Emits a socket event to a specific socket connection.
     * @param {object} socket - The socket connection to emit the event to.
     * @param {string} event - The event name.
     * @param {object} data - The data to send with the event.
     * @param {string} [successMessage] - A message to log on successful emit.
     * @param {string} [errorMessage] - A message to log on failure.
     */
    SendSocketEmit(socket, event, data, successMessage = '', errorMessage = '') {
        if (data) {
            socket.emit(event, data);
            if (successMessage) this.Debug(successMessage);
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
     */
    SendSocketBroadcast(socket, event, data, successMessage = '', errorMessage = '') {
        if (data) {
            socket.broadcast.emit(event, data);
            if (successMessage) this.Debug(successMessage);
        } else if (errorMessage) {
            this.DebugError(errorMessage);
        }
    }
}

module.exports = MainController;
