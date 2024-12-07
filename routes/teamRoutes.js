const express = require('express');
const router = express.Router();

module.exports = (gameplayController) => {

    // عرض الفرق على صفحة HTML
    router.get('/view', (req, res) => {
        const teams = gameplayController.getTeams();
        res.render('teams', { teams });
    });

    return router;
};
