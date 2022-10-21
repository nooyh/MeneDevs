const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { accountType: req?.user?.type || 'guest' });
});

module.exports = router;