/**
 * Represents a simple wrapper for an integer value.
 */
class IntegerValue {
    /**
     * @param {number} idValue - The integer value to store.
     */
    constructor(idValue) {
        if (typeof idValue !== 'number' || !Number.isInteger(idValue)) {
            throw new TypeError('idValue must be an integer.');
        }

        /**
         * @type {number} The integer value.
         */
        this.idValue = idValue;
    }
}

module.exports = IntegerValue;
