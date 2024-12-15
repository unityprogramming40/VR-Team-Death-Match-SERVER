/**
 * Represents a change in position for an object or player.
 */
class ChangePosition {
    /**
     * @param {string} id - The unique identifier for the object or player.
     * @param {number[]} position - An array of floats representing the new position.
     */
    constructor(id, position) {
        if (typeof id !== 'string') {
            throw new TypeError('id must be a string.');
        }
        if (!Array.isArray(position) || !this.isValidFloatArray(position)) {
            throw new TypeError('position must be an array of numbers (floats).');
        }

        /**
         * @type {string} The unique identifier for the object or player.
         */
        this.id = id;

        /**
         * @type {number[]} An array of floats representing the new position.
         */
        this.position = position;
    }

    /**
     * Validates that all elements in an array are numbers (floats).
     *
     * @param {number[]} array - The array to validate.
     * @returns {boolean} - True if all elements are numbers, false otherwise.
     */
    isValidFloatArray(array) {
        return array.every(item => typeof item === 'number');
    }
}

module.exports = ChangePosition;
