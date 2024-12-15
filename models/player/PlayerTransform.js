class PlayerTransform {
/**
 * Represents a player in a 3D space with positional and rotational data.
 *
 * @param {string} playerID - The unique ID of the player.
 * @param {number[]} headPosition - The position of the player's head as an array of numbers.
 * @param {number[]} headRotation - The rotation of the player's head as an array of numbers.
 * @param {number[]} rHandPosition - The position of the player's right hand as an array of numbers.
 * @param {number[]} rHandRotation - The rotation of the player's right hand as an array of numbers.
 * @param {number[]} lHandPosition - The position of the player's left hand as an array of numbers.
 * @param {number[]} lHandRotation - The rotation of the player's left hand as an array of numbers.
 */
    constructor(playerID, headPosition, headRotation, rHandPosition, rHandRotation, lHandPosition, lHandRotation) {
       
        this.playerID = playerID;
        this.headPosition = headPosition;
        this.headRotation = headRotation;
        this.rHandPosition = rHandPosition;
        this.rHandRotation = rHandRotation;
        this.lHandPosition = lHandPosition;
        this.lHandRotation = lHandRotation;
    }


    getPosition(rig) {
        switch (rig) {
            case 'head':
                return this.convertToVector3(this.headPosition);
            case 'rightHand':
                return this.convertToVector3(this.rHandPosition);
            case 'leftHand':
                return this.convertToVector3(this.lHandPosition);
            default:
                return { x: 0, y: 0, z: 0 };
        }
    }

    getRotation(rig) {
        switch (rig) {
            case 'head':
                return this.convertToQuaternion(this.headRotation);
            case 'rightHand':
                return this.convertToQuaternion(this.rHandRotation);
            case 'leftHand':
                return this.convertToQuaternion(this.lHandRotation);
            default:
                return { x: 0, y: 0, z: 0, w: 1 };
        }
    }

    convertToVector3(values) {
        if (values.length !== 3) return { x: 0, y: 0, z: 0 };
        return { x: values[0], y: values[1] - 0.3, z: values[2] };
    }

    convertToQuaternion(values) {
        if (values.length !== 3) return { x: 0, y: 0, z: 0, w: 1 };
        return { x: values[0], y: values[1], z: values[2], w: 1 };
    }
}

module.exports = PlayerTransform;
