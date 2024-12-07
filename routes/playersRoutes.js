const express = require('express');
const router = express.Router();

module.exports = (playerController) => {


    router.get('/data', (req, res) => {
        const playersData = playerController.getPlayersData(); 
        res.render('playersData', { playersData }); 
    });
    

    router.get('/transform', (req, res) => {
        const playersTransform = playerController.getPlayersTransform();
        res.render('playersTransform', { playersTransform });
    });

    return router;
};
