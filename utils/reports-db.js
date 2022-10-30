const DB = require('./dynamo-db');
const QuestionsDB = require('./questions-db');

module.exports = class ReportsDB extends DB {
    /**
     * Loads reports db in dynamo
     */
    constructor() {
        super();
        this.questionsDB = new QuestionsDB();

        this.TABLE_NAME = 'Reports';
        this.PARTITION_KEY = 'id';
        this.SORT_KEY = 'email';
    }

    /**
     * Gives you literally all the reports in the DB
     * 
     * @returns Promised array of all reports
     */
    async getAllReports() {
        return (await this.list(this.TABLE_NAME)).Items;
    }

    /**
     * Gives you reports only for the email you specified
     * 
     * @param {String} email Whatever email you want
     * @returns Promised array of reports that only correspond with the given email
     */
    async getReportsFor(email) {
        if (typeof email != 'string') throw new Error('Expected email to be a string');

        const reports = await this.getAllReports();
        const sorted = [];

        for (const report of reports) {
            if (report.email.toLowerCase() == email.toLowerCase()) {
                sorted.push(report);
            }
        }

        return sorted;
    }

    /**
     * Gets a specific report based on id and email
     * 
     * @param {String} id The id of the report
     * @param {String} email The email of the agency
     * @returns Promised report info
     */
    getReport(id, email) {
        if (typeof id != 'string') throw new Error('Expected id to be a string');
        if (typeof email != 'string') throw new Error('Expected email to be a string');

        return this.find({
            TableName: this.TABLE_NAME,
            Key: {
                [this.PARTITION_KEY]: { S: id },
                [this.SORT_KEY]: { S: email },
            },
        });
    }

    /**
     * Makes a new report from scratch
     * 
     * @param {String} email This is the agency's email address
     * @param {Object} info This holds all the report info
     * @returns Empty promise
     */
    async createReport(email, info) {
        if (typeof email != 'string') throw new Error('Expected email to be a string');
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        const params = {
            TableName: this.TABLE_NAME,
            Item: {
                [this.PARTITION_KEY]: { S: Date.now().toString() },
                [this.SORT_KEY]: { S: email },
            },
        };

        for (const [key, value] of Object.entries(info)) {
            if (value != null) {
                params.Item[key] = { S: value.toString() };
            }
        }

        await this.put(params);
    }

    /**
     * Adds new info to an existing report
     * 
     * @param {String} id The id of the report
     * @param {String} email The agency's email address
     * @param {Object} newInfo The new info u wanna add
     * @returns Empty promise
     */
    async updateReport(id, email, newInfo) {
        if (typeof id != 'string') throw new Error('Expected id to be a string');
        if (typeof email != 'string') throw new Error('Expected email to be a string');
        if (typeof newInfo != 'object') throw new Error('Expected newInfo to be an object');

        const report = await this.getReport(id, email);
        const params = {
            TableName: this.TABLE_NAME,
            Item: {
                [this.PARTITION_KEY]: { S: id },
                [this.SORT_KEY]: { S: email },
            },
        };

        const add = (object) => {
            for (const [key, value] of Object.entries(object)) {
                if (value != null) {
                    params.Item[key] = { S: value.toString() };
                }
            }
        };

        add(report);
        add(newInfo);

        await this.put(params);
    }

    /**
     * Gets rid of a report entirely from the DB
     * 
     * @param {String} id The id of the report to delete
     * @param {String} email The agency's email address
     * @returns The old report
     */
    async deleteReport(id, email) {
        if (typeof id != 'string') throw new Error('Expected id to be an string');
        if (typeof email != 'string') throw new Error('Expected email to be a string');

        const oldReport = await this.getReport(id, email);

        await this.remove({
            TableName: this.TABLE_NAME,
            Key: {
                [this.PARTITION_KEY]: { S: id },
                [this.SORT_KEY]: { S: email },
            },
        });

        return oldReport;
    }
};