const express = require('express');
const router = express.Router();

module.exports = (teamController) => {

    // عرض الفرق على صفحة HTML
    router.get('/players', (req, res) => {
        const teams = teamController.getTeams();
        res.render('teamPlayers', { teams });
    });
    
    return router;
};
