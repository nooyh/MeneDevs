const express = require('express');
const router = express.Router();
const ReportDB = require('../utils/report-db');
const db = new ReportDB();

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
router.get('/reports', checkAuthed, async (req, res, next) => {
    // const reports = await db.getReportsFor(req.user.email);
    const reports = {
        'agency@gmail.com': [
            {
                agency: 'agency',
                area: 'test',
                location: 'test',
                contact: '808 123 1233',
            }
        ],
    };
    req.flash('reports', 'test');
    res.render('agency-reports', { accountType: 'agency', reports });
});

/* GET create report page. */
router.get('/reports/new', checkAuthed, (req, res, next) => {
    res.render('agency-form', { accountType: 'agency' });
});

/* POST create report */
router.post('/reports/new', checkAuthed, async (req, res, next) => {
    if (!req.body.agency) return res.status(502).json("missing 'agency' from body");

    await db.createReport(req.body.agency, req.body);
    res.json('success');
});

module.exports = router;