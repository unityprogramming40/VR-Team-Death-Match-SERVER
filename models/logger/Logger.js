class Logger {
    constructor() {
        this.logHistory = {}; // Store log messages and their counts
    }

    /**
     * Logs a debug message to the console, collapsing duplicates.
     * @param {string} message - The debug message to log.
     */
    Debug(message) {
        this._logMessage(message, "DEBUG");
    }

    /**
     * Logs an error message to the console, collapsing duplicates.
     * @param {string} message - The error message to log.
     */
    DebugError(message) {
        this._logMessage(message, "ERROR");
    }

    /**
     * Generic method to handle logging with duplicate collapsing.
     * @param {string} message - The message to log.
     * @param {string} level - The log level ("DEBUG" or "ERROR").
     * @private
     */
    _logMessage(message, level) {
        const key = `[${level}]: ${message}`;

        // Increment count or initialize the log entry
        if (this.logHistory[key]) {
            this.logHistory[key]++;
        } else {
            this.logHistory[key] = 1;
        }

        // Display the entire log history without clearing
        this._printLogs();
    }

    /**
     * Prints the entire log history to the console.
     * @private
     */
    _printLogs() {
        console.clear(); // Clears the console for clean display
        console.groupCollapsed("Log Summary:");
        Object.entries(this.logHistory).forEach(([logMessage, count]) => {
            console.log(`${logMessage}${count > 1 ? ` (x${count})` : ""}`);
        });
        console.groupEnd();
    }
}

// Example Usage
// 
/*
const logger = new Logger();
logger.Debug("System initialized");
logger.Debug("System initialized");
logger.Debug("Loading configuration");
logger.DebugError("File not found");
logger.DebugError("File not found");
logger.DebugError("File not found");
*/

module.exports = Logger;
