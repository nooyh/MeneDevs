const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    const accountType = req?.user?.type;
    res.redirect(`/${accountType || 'login'}`);
});

module.exports = router;