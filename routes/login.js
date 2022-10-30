const passport = require('passport');
const express = require('express');
const router = express.Router();

/* GET login. */
router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) res.redirect('/');
    else res.render('login', { accountType: req?.user?.type });
});

/* POST login. */
router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

module.exports = router;