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

/* GET all reports page. */
router.get('/', checkAuthed, async (req, res, next) => {
    const allReports = await db.getReportsFor(req?.user?.email || '');

    res.render('agency/view-reports', { accountType: 'agency', allReports });
});

/* GET specific report page */
router.get('/:reportId', checkAuthed, (req, res, next) => {
    const reportId = req.params.reportId;

    if (reportId == 'new') {
        return res.render('agency/report', { accountType: 'agency' });
    }

    // i'll add functionality later - alohabeach

    res.render('agency/report', { accountType: 'agency' });
});

/* POST create report */
router.post('/new', checkAuthed, async (req, res, next) => {
    if (!req.body.agency) return res.status(502).json("missing 'agency' from body");

    await db.createReport(req.body.agency, req.body);
    res.json('success');
});

module.exports = router;