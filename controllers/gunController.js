const GunData = require('../models/gun/GunData');
const BulletData = require('../models/gun/BulletData');
const MainController = require('./mainController');

const GunsData = [
    new GunData(1, "none", 0, [0, 0, 0], [0, 0, 0], 30, 30, 7, 2),
    new GunData(2, "none", 0, [0, 0, 0], [0, 0, 0], 12, 12, 15, 1)
];

class GunController extends MainController{
    constructor(io) {
        super(io);
        this.initializeSocketEvents(io);
    }

    initializeSocketEvents(io) {
        io.on('connection', (socket) => {
            //console.log('New client connected to GunController');

            socket.on('sendGunData', (data) => this.handleGunData(socket, this.createGunData(data)));
            socket.on('sendBulletData', (data) => this.handleBulletData(socket, this.createBulletData(data)));
            socket.on('disconnect', () => console.log(''));
        });
    }

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

    createBulletData(data) {
        return new BulletData(data.gunID, data.playerID, data.teamID, data.damage);
    }

    findAndUpdateGun(gunID, updateFn) {
        const gun = GunsData.find(g => g.gunID === gunID);
        if (gun) {
            updateFn(gun);
            return gun;
        }
        return null;
    }

    emitAndLog(socket, event, data, successMessage, errorMessage) {
        if (data) {
            socket.emit(event, data);
            console.log(successMessage);
        } else {
            console.log(errorMessage);
        }
    }

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
        }

        this.emitAndLog(
            socket,
            'updateGunData',
            gun,
            "Gun Data => updated successfully",
            "Gun Data => not found, added new entry"
        );
    }

    handleBulletData(socket, bulletData) {
        console.log('Received Bullet Data:', bulletData);

        // Process and broadcast bullet data if necessary
        socket.emit('updateBulletData', bulletData);
        console.log("Bullet Data => processed and broadcasted");
    }
}

module.exports = GunController;
