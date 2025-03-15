const GunData = require('../models/gun/GunData');
const BulletData = require('../models/gun/BulletData');
const MainController = require('./mainController');

const GunsData = [
          
    new GunData(1, "", 0, [0, 0, 0], [0, 0, 0], 12, 12, 20, 2),
    new GunData(2, "", 0, [0, 0, 0], [0, 0, 0], 12, 12, 20, 2),
    new GunData(3, "", 0, [0, 0, 0], [0, 0, 0], 12, 12, 20, 3),
    new GunData(4, "", 0, [0, 0, 0], [0, 0, 0], 12, 12, 20, 4),
    
    new GunData(101, "", 0, [0, 0, 0], [0, 0, 0], 15, 15, 30, 1),
    new GunData(102, "", 0, [0, 0, 0], [0, 0, 0], 30, 30, 20, 2),
    new GunData(103, "", 0, [0, 0, 0], [0, 0, 0], 35, 35, 15, 3),
    new GunData(104, "", 0, [0, 0, 0], [0, 0, 0], 40, 40, 10, 1),
    new GunData(1011, "", 0, [0, 0, 0], [0, 0, 0], 15, 15, 30, 1),
    new GunData(1022, "", 0, [0, 0, 0], [0, 0, 0], 30, 30, 20, 2),
    new GunData(1033, "", 0, [0, 0, 0], [0, 0, 0], 35, 35, 15, 3),
    new GunData(1044, "", 0, [0, 0, 0], [0, 0, 0], 40, 40, 10, 1),
    
    new GunData(201, "", 0, [0, 0, 0], [0, 0, 0], 15, 15, 30, 1),
    new GunData(202, "", 0, [0, 0, 0], [0, 0, 0], 30, 30, 20, 2),
    new GunData(203, "", 0, [0, 0, 0], [0, 0, 0], 35, 35, 15, 3),
    new GunData(204, "", 0, [0, 0, 0], [0, 0, 0], 40, 40, 10, 1),
    new GunData(2011, "", 0, [0, 0, 0], [0, 0, 0], 15, 15, 30, 1),
    new GunData(2022, "", 0, [0, 0, 0], [0, 0, 0], 30, 30, 20, 2),
    new GunData(2033, "", 0, [0, 0, 0], [0, 0, 0], 35, 35, 15, 3),
    new GunData(2044, "", 0, [0, 0, 0], [0, 0, 0], 40, 40, 10, 1),

    new GunData(301, "", 0, [0, 0, 0], [0, 0, 0], 15, 15, 30, 1),
    new GunData(302, "", 0, [0, 0, 0], [0, 0, 0], 30, 30, 20, 2),
    new GunData(303, "", 0, [0, 0, 0], [0, 0, 0], 35, 35, 15, 3),
    new GunData(304, "", 0, [0, 0, 0], [0, 0, 0], 40, 40, 10, 1),
    new GunData(3011, "", 0, [0, 0, 0], [0, 0, 0], 15, 15, 30, 1),
    new GunData(3022, "", 0, [0, 0, 0], [0, 0, 0], 30, 30, 20, 2),
    new GunData(3033, "", 0, [0, 0, 0], [0, 0, 0], 35, 35, 15, 3),
    new GunData(3044, "", 0, [0, 0, 0], [0, 0, 0], 40, 40, 10, 1),
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
            //this.Debug('New client connected to GunController');

            this.SendSocketEmit(socket, 'getGuns', { models: GunsData }, 'send guns sucessed', 'send guns failed');

            socket.on('getAllGuns', _ =>  this.SendSocketEmit(socket, 'getGuns', { models: GunsData }, 'send guns sucessed', 'send guns failed'));


            socket.on('sendGunData', (data) => this.handleGunData(socket, this.createGunData(data)));
            socket.on('updateGunData', (data) => this.handleGunData(socket, data));
            socket.on('playerShoot', (data) => this.handlePlayerShoot(socket, data));
            socket.on('reloadGun', (data) => this.handleReloadGun(socket, data));
            socket.on('restGun', (data) => this.handleRestGun(socket, data));
            
            //socket.on('disconnect', () => this.Debug('Client disconnected from GunController'));
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

    gunShoot(gunID) {
        const gun = GunsData.find(g => g.gunID === gunID);
        if (gun) {
            gun.currentBullets -= 1
        }
    }

    ReloadGun(gunID) {
        const gun = GunsData.find(g => g.gunID === gunID);
        if (gun) {
            gun.currentBullets = gun.maxBullets;
        }
    }

    /**
     * Handles incoming gun data updates or additions.
     * @param {object} socket - The client's socket instance.
     * @param {GunData} data - The GunData instance.
     */
    handleGunData(socket, data) {
        this.Debug('Received Gun Data:', data);

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
            this.Debug(`Gun with ID ${data.gunID} added to GunsData.`);
        } else {
            this.Debug(`Gun with ID ${data.gunID} updated in GunsData.`);
        }

        this.SendSocketBroadcast(
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
        this.Debug('handle Player Shoot:', bulletData);
        this.gunShoot(bulletData.gunID);
        this.SendSocketALL(socket, 'playerShoot', bulletData, "Player Shoot: " + bulletData.playerID, "Player Shoot Failed");

    }

    handleReloadGun(socket, gunData) {
        this.Debug('handle Reload:', gunData);

        this.ReloadGun(gunData.gunID);
        
        this.SendSocketALL(socket, 'reloadGun', gunData,"","");

    }

    handleRestGun(socket, data) {
        this.Debug('handle Reload:', data);

        this.ReloadGun(data.ID);
        
        this.SendSocketALL(socket, 'restGun', data,"","");

    }
}

module.exports = GunController;
