const express = require('express');
const router = express.Router();
const ReportsDB = require('../utils/reports-db');
const QuestionsDB = require('../utils/questions-db');

const reportsDB = new ReportsDB();
const questionsDB = new QuestionsDB();

const checkAuthed = (req, res, next) => {
    if (!req.isAuthenticated() || req?.user?.type != 'agency') {
        return res.redirect('/login');
    }

    next();
};

/* GET all reports page. */
router.get('/', checkAuthed, async (req, res, next) => {
    const allReports = await reportsDB.getReportsFor(req?.user?.email);
    const questions = await questionsDB.getQuestions();
    res.render('agency/view-reports', { accountType: 'agency', allReports, questions });
});

/* GET specific report page */
router.get('/report', checkAuthed, async (req, res, next) => {
    const { id, create } = req.query;
    if (!create && !id) return next();

    const questions = await questionsDB.getQuestions();

    if (create) {
        return res.render('agency/report', { accountType: req?.user?.type, report: {}, questions });
    } else {
        const report = await reportsDB.getReport(id, req?.user?.email);
        if (Object.keys(report).length == 0) return next();

        res.render('agency/report', { accountType: 'agency', report, questions });
    }
});

/* POST create report */
router.post('/report', checkAuthed, async (req, res, next) => {
    const { create, report } = req.body;
    if (!report) return res.status(502).json("missing 'report' from body");

    if (create) await reportsDB.createReport(req?.user?.email, report);
    else await reportsDB.updateReport(report.id, report.email, report);

    res.json('success');
});

module.exports = router;