const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
router.get('/', (req, res) => res.send('Welcome'))
router.get('/dashboaard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        user: req.user.name
    }));

module.exports = router; 