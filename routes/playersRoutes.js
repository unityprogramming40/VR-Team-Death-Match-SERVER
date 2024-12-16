const express = require('express');
const router = express.Router();

module.exports = (playerController) => {


    router.get('/data', (req, res) => {
        const players = playerController.getAllPlayers(); 
        res.render('playersModel', { players }); 
    });
    

    return router;
};
