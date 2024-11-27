const GunData = require('../models/gun/GunData');
const BulletData = require('../models/gun/BulletData');

const GunsData = [
    new GunData(1, "none", 0, [0, 0, 0], [0, 0, 0], 30, 30, 7, 2),
    new GunData(2, "none", 0, [0, 0, 0], [0, 0, 0], 12, 12, 15, 1)
];

class GunController {
    constructor(io) {
        this.io = io;

        io.on('connection', (socket) => {
            console.log('New client connected');

            socket.on('sendGunData', (data) => {
                this.handleGunData(socket, gunData);
            });

            socket.on('sendBulletData', (data) => {
                const bulletData = new BulletData(data.gunID, data.playerID, data.teamID, data.damage);
                this.handleBulletData(socket, bulletData);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    handleGunData(socket, data) {
        console.log('Received Gun Data:', data);

        // Process player data and broadcast if necessary

        const gun = GunsData.find(g => g.gunID == data.gunID);

        if (gun) {

            gun.playerID = data.playerID;
            gun.teamID = data.teamID;
            gun.position = data.position;
            gun.rotation = data.rotation;
            gun.maxBullets = data.maxBullets;
            gun.currentBullets = data.currentBullets;
            gun.damage = data.damage;
            gun.resetPoint = data.resetPoint;

            socket.emit('updateGunData', gun);

            console.log("Gun Data =>done");

        } else {
            const gunData = new GunData(
                data.playerID,
                data.teamID,
                data.position,
                data.rotation,
                data.maxBullets,
                data.currentBullets,
                data.damage,
                data.resetPoint
            );
            GunsData.push(gunData);

            socket.emit('updateGunData', gunData);

            console.log("Gun Data =>not found");
        }
    }

    handleBulletData(socket, bulletData) {
        console.log('Received Bullet Data:', bulletData);
        // Add any processing logic needed for bullet data
        socket.emit('updateBulletData', bulletData);
    }
}

module.exports = GunController;
