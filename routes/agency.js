const express = require('express');
const router = express.Router();

const checkAuthed = (req, res, next) => {
    // if (!req.isAuthenticated() || req?.user?.type != 'agency') {
    //     return res.redirect('/login');
    // }

    next();
};

/* GET home page. */
router.get('/', checkAuthed, (req, res, next) => {
    res.render('agency-home', { accountType: 'agency' });
});

/* GET reports page. */
router.get('/reports', checkAuthed, (req, res, next) => {
    res.render('agency-reports', { accountType: 'agency' });
});

module.exports = router;