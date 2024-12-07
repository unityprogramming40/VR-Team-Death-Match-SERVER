const express = require('express');
const router = express.Router();

module.exports = (gameplayController) => {

    // عرض الفرق على صفحة HTML
    router.get('/players', (req, res) => {
        const players = gameplayController.getTeams();
        res.render('teamPlayers', { players });
    });
    
    return router;
};
