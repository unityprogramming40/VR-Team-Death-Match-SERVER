const GunData = require('../models/gun/GunData');
const BulletData = require('../models/gun/BulletData');

class GunController {
    constructor(io) {
        this.io = io;

        io.on('connection', (socket) => {
            console.log('New client connected');

            socket.on('sendGunData', (data) => {
                const gunData = new GunData(data.gunID, data.playerID, data.teamID, data.position, data.rotation, data.maxBullets, data.currentBullets, data.damage, data.resetPoint);
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

    handleGunData(socket, gunData) {
        console.log('Received Gun Data:', gunData);
        // Here, add any processing logic needed for gun data
        // Broadcast to all clients if necessary
        this.io.emit('updateGunData', gunData);
    }

    handleBulletData(socket, bulletData) {
        console.log('Received Bullet Data:', bulletData);
        // Add any processing logic needed for bullet data
        this.io.emit('updateBulletData', bulletData);
    }
}

module.exports = GunController;
