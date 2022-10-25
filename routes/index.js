const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    const accountType = req?.user?.type;

    if (!accountType) {
        return res.render('index', { accountType: accountType || 'guest' });
    }

    res.redirect(`/${accountType}`);
});

module.exports = router;