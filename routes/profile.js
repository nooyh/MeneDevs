const express = require('express');
const router = express.Router();

const checkAuthed = (req, res, next) => {
    if (!req.isAuthenticated() || !req?.user?.type) {
        return res.redirect('/login');
    }

    next();
};

/* GET profile page. */
router.get('/', checkAuthed, (req, res, next) => {
    res.render('profile', { accountType: req?.user?.type });
});

/* POST logout request */
router.post('/', checkAuthed, (req, res, next) => {
    req.logout(console.error);
    res.redirect('/login');
});

module.exports = router;