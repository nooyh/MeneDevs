const express = require('express');
const router = express.Router();
const ReportsDB = require('../utils/reports-db');
const QuestionsDB = require('../utils/questions-db');

const reportsDB = new ReportsDB();
const questionsDB = new QuestionsDB();

const checkAuthed = (req, res, next) => {
    if (!req.isAuthenticated() || req?.user?.type != 'admin') {
        return res.redirect('/login');
    }

    next();
};

/* GET all reports page. */
router.get('/', checkAuthed, async (req, res, next) => {
    const allReports = await reportsDB.getAllReports();
    const questions = await questionsDB.getQuestions();
    res.render('admin/view-reports', { accountType: req?.user?.type, allReports, questions });
});

/* GET specific report page */
router.get('/report', checkAuthed, async (req, res, next) => {
    const { id } = req.query;
    if (!id) return next();

    const report = await reportsDB.getReport(id, req?.user?.email);
    if (Object.keys(report).length == 0) return next();

    const questions = await questionsDB.getQuestions();
    res.render('admin/report', { accountType: req?.user?.type, report, questions });
});

/* GET edit global form page */
router.get('/edit', checkAuthed, async (req, res, next) => {
    const questions = await questionsDB.getQuestions();
    res.render('admin/edit-global-report', { accountType: req?.user?.type, questions });
});

/* POST edit global form page */
router.post('/edit', checkAuthed, (req, res, next) => {
    if (!req.body) res.status(502).json('Invalid body');

    questionsDB.saveQuestions(req.body);
    res.json('success');
});

module.exports = router;