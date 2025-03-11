
const http = require('http');
const socketIo = require('socket.io');
const expressApp = require('./app'); // ملف إعدادات Express

const teamRoutes = require('./routes/teamRoutes'); // ملف المسارات
const playersRoutes = require('./routes/playersRoutes');
const gameplayRoutes = require('./routes/gameplayRoutes');

// Import controllers
const GunController = require('./controllers/gunController');
const AdminController = require('./controllers/adminController');
const PlayerController = require('./controllers/playerController');
const GameplayController = require('./controllers/gameplayController');
const TeamController = require('./controllers/teamController');

// إعداد Express
const app = expressApp();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize controllers with the Socket.IO instance
const gunController = new GunController(io);
const teamController = new TeamController(io);
const playerController = new PlayerController(io);
const gameplayController = new GameplayController(io);
const adminController = new AdminController(io);

gameplayController.setTeamController(teamController);
teamController.setPlayerController(playerController);

playerController.setTeamController(teamController);

adminController.setGunController(gunController);
adminController.setTeamController(teamController);
adminController.setPlayerController(playerController);
adminController.setGameplayController(gameplayController);


// استخدام مسارات الفرق
app.use('/teams', teamRoutes(teamController));
app.use('/players', playersRoutes(playerController));
app.use('/gameplay', gameplayRoutes(gameplayController));

// تشغيل الخادم
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
