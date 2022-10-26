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

/* GET reports page. */
router.get('/', checkAuthed, async (req, res, next) => {
    // const allReports = await db.getReportsFor(req.user.email);
    const allReports = [
        {
            agency: "test",
            id: "1666685257541",
            contact: "1231231233",
            email: "agency@gmail.com",
            location: "test",
            phase: "Pre-planning",
            projectName: "test",
            stationArea: "test",
        },
    ];

    res.render('agency-reports', { accountType: 'agency', allReports });
});

/* GET create report page. */
router.get('/new', checkAuthed, (req, res, next) => {
    res.render('agency-form', { accountType: 'agency' });
});

/* POST create report */
router.post('/new', checkAuthed, async (req, res, next) => {
    if (!req.body.agency) return res.status(502).json("missing 'agency' from body");

    // await db.createReport(req.body.agency, req.body);
    res.json('success');
});

module.exports = router;