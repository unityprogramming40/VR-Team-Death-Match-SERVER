class TeamData {
    /**
     * Represents a team's data in the game.
     *
     * @param {number} teamID - The unique ID of the team.
     * @param {string} teamName - The name of the team.
     * @param {number} teamPoints - The team's total points.
     * @param {string[]} players - An array of player names or IDs belonging to the team.
     */
    constructor(teamID, teamName, teamPoints, players) {
        if (typeof teamID !== 'number') {
            throw new TypeError('teamID must be a number.');
        }
        if (typeof teamName !== 'string') {
            throw new TypeError('teamName must be a string.');
        }
        if (typeof teamPoints !== 'number') {
            throw new TypeError('teamPoints must be a number.');
        }
        if (!Array.isArray(players)) {
            throw new TypeError('players must be an array.');
        }
        if (!players.every(player => typeof player === 'string')) {
            throw new TypeError('All elements in players must be strings.');
        }

        this.teamID = teamID;
        this.teamName = teamName;
        this.teamPoints = teamPoints;
        this.players = players;
    }
}

module.exports = TeamData;
