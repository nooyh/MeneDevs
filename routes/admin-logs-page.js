const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('admin-logs-page');
});

module.exports = router;