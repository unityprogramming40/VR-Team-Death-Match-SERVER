const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const GunController = require('./controllers/gunController');
const AdminController = require('./controllers/adminController');
const PlayerController = require('./controllers/playerController');
const GameplayController = require('./controllers/gameplayController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


// Initialize Controllers with Socket.IO instance
// new GunController(io);
// new AdminController(io);
// new PlayerController(io);
new GameplayController(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
