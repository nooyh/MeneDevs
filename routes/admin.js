const express = require('express');
const router = express.Router();

const checkAuthed = (req, res, next) => {
    // if (!req.isAuthenticated() || req?.user?.type != 'admin') {
    //     return res.redirect('/login');
    // }

    next();
};

/* GET home page. */
router.get('/', checkAuthed, (req, res, next) => {
    res.render('admin-home', { accountType: 'admin' });
});

/* GET edit global form page */
router.get('/edit', checkAuthed, (req, res, next) => {
    res.render('admin-edit', { accountType: 'admin' });
});

/* GET logs page. */
router.get('/logs', checkAuthed, (req, res, next) => {
    res.render('admin-logs', { accountType: 'admin' });
});

module.exports = router;