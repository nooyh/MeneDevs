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
    const allReports = await db.getReportsFor(req?.user?.email || 'guntech@gmail.com');
    res.render('agency/view-reports', { accountType: 'agency', allReports });
});

/* GET specific report page */
router.get('/report', checkAuthed, async (req, res, next) => {
    const { agency, id, create } = req.query;
    if (create) return res.render('agency/report', { accountType: 'agency', report: {} });
    else if (!agency || !id) return next();

    const report = await db.getReport(agency, id);
    if (!report.agency) return next();

    res.render('agency/report', { accountType: 'agency', report });
});

/* POST create report */
router.post('/report', checkAuthed, async (req, res, next) => {
    const { create, report } = req.body;
    if (!report) return res.status(502).json("missing 'agency' from body");

    if (create) await db.createReport(report.agency, report);
    else await db.updateReport(report.agency, report.id, report);

    res.json('success');
});

module.exports = router;