const DB = require('./dynamo-db');

module.exports = class QuestionsDB extends DB {
    /**
     * Loads questions db in dynamo
     */
    constructor() {
        super();

        this.TABLE_NAME = 'Global_Questions';
        this.PARTITION_KEY = 'questions';
    }

    /**
     * Gives you all the questions saved
     * 
     * @returns Promised array of questions
     */
    async getQuestions() {
        return this._parseQuestions(await this.find({
            TableName: this.TABLE_NAME,
            Key: {
                [this.PARTITION_KEY]: { S: this.PARTITION_KEY },
            },
        }));
    }

    /**
     * Saves a new set of questions in the db
     * 
     * @param {Object} questions Please put the question as the key and its type as the value
     * @returns Emptry promise
     */
    async saveQuestions(questions) {
        const params = {
            TableName: this.TABLE_NAME,
            Item: {
                [this.PARTITION_KEY]: { S: this.PARTITION_KEY},
            },
        };

        for (const [question, type] of Object.entries(questions)) {
            params.Item[question] = { S: type };
        }

        await this.put(params);
    }

    /**
     * Converts the database array to a regular list of questions
     * 
     * @param {Object} questions The original list of questions from the db
     * @returns Object of questions
     */
    _parseQuestions(questions) {
        const newObj = {};
        for (const [question, type] of Object.entries(questions)) {
            if (type != this.PARTITION_KEY) newObj[question] = type;
        }
        return newObj;
    }
}