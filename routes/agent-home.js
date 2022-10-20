const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    
    res.render('agent-home');
});

module.exports = router;