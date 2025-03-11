/**
 * Represents a simple wrapper for an integer value.
 */
class IntegerValue {
    /**
     * @param {number} value - The integer value to store.
     */
    constructor(value) {
        if (typeof value !== 'number' || !Number.isInteger(value)) {
            throw new TypeError('idValue must be an integer.');
        }

        /**
         * @type {number} The integer value.
         */
        this.value = value;
    }
}

module.exports = IntegerValue;
