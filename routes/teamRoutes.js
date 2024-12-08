const express = require('express');
const router = express.Router();

module.exports = (teamController) => {

    // عرض الفرق على صفحة HTML
    router.get('/players', (req, res) => {
        const players = teamController.getTeams();
        res.render('teamPlayers', { players });
    });
    
    return router;
};
