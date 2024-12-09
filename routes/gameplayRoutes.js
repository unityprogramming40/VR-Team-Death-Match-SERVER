const express = require('express');
const router = express.Router();

module.exports = (gameplayController) => {

    // عرض الفرق على صفحة HTML
    router.get('/data', (req, res) => {
        const gameData = gameplayController.gameData;
        res.render('gameplayData', { gameData });
    });
    
    return router;
};
