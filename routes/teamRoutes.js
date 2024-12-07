const express = require('express');
const router = express.Router();

module.exports = (gameplayController) => {
    // عرض الفرق كـ JSON
    router.get('/', (req, res) => {
        const teams = gameplayController.getTeams();
        res.json(teams);
    });

    // عرض الفرق على صفحة HTML
    router.get('/view', (req, res) => {
        const teams = gameplayController.getTeams();
        res.render('teams', { teams });
    });

    // إضافة لاعب إلى الفريق 1
    router.post('/team1/add', (req, res) => {
        const { playerID } = req.body;
        if (!playerID) {
            return res.status(400).json({ message: 'PlayerID is required' });
        }
        gameplayController.team1Players.push(playerID);
        res.json({
            message: `Player ${playerID} added to Team 1`,
            team1Players: gameplayController.team1Players
        });
    });

    // إضافة لاعب إلى الفريق 2
    router.post('/team2/add', (req, res) => {
        const { playerID } = req.body;
        if (!playerID) {
            return res.status(400).json({ message: 'PlayerID is required' });
        }
        gameplayController.team2Players.push(playerID);
        res.json({
            message: `Player ${playerID} added to Team 2`,
            team2Players: gameplayController.team2Players
        });
    });

    // إعادة تعيين الفرق
    router.post('/reset', (req, res) => {
        gameplayController.team1Players = [];
        gameplayController.team2Players = [];
        res.json({
            message: 'Teams have been reset',
            team1Players: gameplayController.team1Players,
            team2Players: gameplayController.team2Players
        });
    });

    return router;
};
