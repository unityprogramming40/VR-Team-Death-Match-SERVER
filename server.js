const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Import controllers
const GunController = require('./controllers/gunController');
const AdminController = require('./controllers/adminController');
const PlayerController = require('./controllers/playerController');
const GameplayController = require('./controllers/gameplayController');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize controllers with the Socket.IO instance
const gunController = new GunController(io);
const playerController = new PlayerController(io);
const adminController = new AdminController(io, playerController);
const gameplayController = new GameplayController(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
