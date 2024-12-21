const GunData = require('../models/gun/GunData');
const BulletData = require('../models/gun/BulletData');
const MainController = require('./mainController');

const GunsData = [
    new GunData(1, "none", 0, [0, 0, 0], [0, 0, 0], 30, 30, 7, 2),
    new GunData(2, "none", 0, [0, 0, 0], [0, 0, 0], 12, 12, 15, 1)
];

/**
 * GunController manages gun-related operations and Socket.IO events.
 */
class GunController extends MainController {
    /**
     * @param {object} io - The Socket.IO instance.
     */
    constructor(io) {
        super(io);
        this.initializeSocketEvents(io);
    }

    /**
     * Initializes Socket.IO event listeners.
     * @param {object} io - The Socket.IO instance.
     */
    initializeSocketEvents(io) {
        io.on('connection', (socket) => {
            //console.log('New client connected to GunController');

            socket.on('sendGunData', (data) => this.handleGunData(socket, this.createGunData(data)));
            socket.on('playerShoot', (data) => this.handlePlayerShoot(socket, data));

            //socket.on('disconnect', () => console.log('Client disconnected from GunController'));
        });
    }

    /**
     * Creates a new GunData instance from raw data.
     * @param {object} data - The raw gun data.
     * @returns {GunData} A new GunData instance.
     */
    createGunData(data) {
        return new GunData(
            data.gunID,
            data.playerID,
            data.teamID,
            data.position,
            data.rotation,
            data.maxBullets,
            data.currentBullets,
            data.damage,
            data.resetPoint
        );
    }

    /**
     * Creates a new BulletData instance from raw data.
     * @param {object} data - The raw bullet data.
     * @returns {BulletData} A new BulletData instance.
     */
    createBulletData(data) {
        return new BulletData(data.gunID, data.playerID, data.teamID, data.damage);
    }

    /**
     * Finds a gun by its ID and applies an update function.
     * @param {number} gunID - The ID of the gun to find.
     * @param {Function} updateFn - The function to update the gun.
     * @returns {GunData|null} The updated GunData instance, or null if not found.
     */
    findAndUpdateGun(gunID, updateFn) {
        const gun = GunsData.find(g => g.gunID === gunID);
        if (gun) {
            updateFn(gun);
            return gun;
        }
        return null;
    }

    /**
     * Handles incoming gun data updates or additions.
     * @param {object} socket - The client's socket instance.
     * @param {GunData} data - The GunData instance.
     */
    handleGunData(socket, data) {
        console.log('Received Gun Data:', data);

        const updateGunData = (gun) => {
            gun.playerID = data.playerID;
            gun.teamID = data.teamID;
            gun.position = data.position;
            gun.rotation = data.rotation;
            gun.maxBullets = data.maxBullets;
            gun.currentBullets = data.currentBullets;
            gun.damage = data.damage;
            gun.resetPoint = data.resetPoint;
        };

        let gun = this.findAndUpdateGun(data.gunID, updateGunData);

        if (!gun) {
            gun = this.createGunData(data);
            GunsData.push(gun);
            console.log(`Gun with ID ${data.gunID} added to GunsData.`);
        } else {
            console.log(`Gun with ID ${data.gunID} updated in GunsData.`);
        }

        this.emitAndLog(
            socket,
            'updateGunData',
            gun,
            `Gun Data => updated successfully for gunID: ${data.gunID}`,
            `Gun Data => could not find or create gunID: ${data.gunID}`
        );
    }

    /**
     * Handles incoming bullet data.
     * @param {object} socket - The client's socket instance.
     * @param {BulletData} bulletData - The BulletData instance.
     */
    handlePlayerShoot(socket, bulletData) {
        console.log('Received Bullet Data:', bulletData);

        this.SendSocketEmit(socket,'playerShoot', bulletData,"Player Shoot"+bulletData.playerID,"Player Shoot Failed");
        this.SendSocketBroadcast(socket,'playerShoot', bulletData,"Player Shoot"+bulletData.playerID,"Player Shoot Failed");

    }
}

module.exports = GunController;
