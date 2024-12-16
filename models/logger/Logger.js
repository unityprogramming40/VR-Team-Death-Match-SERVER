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

        // Display logs (collapsed by default)
        console.clear(); // Clear the console for a clean view
        console.groupCollapsed(`${level} Logs (${Object.keys(this.logHistory).length} unique)`);
        Object.entries(this.logHistory).forEach(([logMessage, count]) => {
            console.log(`${logMessage}${count > 1 ? ` (x${count})` : ""}`);
        });
        console.groupEnd();
    }
}/*

// Example Usage
logger.Debug("System initialized");
logger.Debug("System initialized");
logger.Debug("Loading configuration");
logger.DebugError("File not found");
logger.DebugError("File not found");
logger.DebugError("File not found");
*/

module.exports = Logger;
