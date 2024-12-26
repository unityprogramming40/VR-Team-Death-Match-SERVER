class TransformJSON {
    /**
     * Represents a player in a 3D space with positional and rotational data.
     *
     * @param {string} ID - The unique ID of the player.
     * @param {number[]}  Position 
     * @param {number[]}  Rotation 
    
    */
    constructor(Position, Rotation,) {

        this.Position = Position;
        this.Rotation = Rotation;
    }


}

module.exports = TransformJSON;
