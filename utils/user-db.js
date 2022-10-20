const DB = require('./dynamo-db');

module.exports = class UserDB extends DB {
    /**
     * Loads user db in dynamo
     */
    constructor() {
        super();

        this.TABLE_NAME = 'Users';
        this.PARTITION_KEY = 'email';
        this.SORT_KEY = 'password';
    }

    /**
     * Looks for an account with the same email and password given
     * @param {String} email The email of the acc
     * @param {String} password The password of the acc
     * @returns {Promise} promised boolean
     */
    async findAccount(email, password) {
        if (typeof email != 'string') throw new Error('Expected email to be a string');
        if (typeof password != 'string') throw new Error('Expected password to be a string');

        return this.find({
            TableName: this.TABLE_NAME,
            Key: {
                [this.PARTITION_KEY]: { S: email },
                [this.SORT_KEY]: { S: password },
            },
        });
    }

    /**
     * Creates a new account with the given credentials
     * @param {String} email The acc email
     * @param {String} password The acc password
     * @param {String} type States whether this is an agency or admin acc
     */
    addAccount(email, password, type) {
        if (typeof email != 'string') throw new Error('Expected email to be a string');
        if (typeof password != 'string') throw new Error('Expected password to be a string');
        if (typeof type != 'string') throw new Error('Expected type to be a string');

        this.put({
            TableName: this.TABLE_NAME,
            Item: {
                [this.PARTITION_KEY]: { S: email },
                [this.SORT_KEY]: { S: password },
                type: { S: type },
            },
        });
    }

    /**
     * Removes account from the database
     * @param {String} email The acc email
     * @param {String} password The acc password
     * @param {?String} type (optional) States whether this is an agency or admin acc
     */
    removeAccount(email, password, type) {
        if (typeof email != 'string') throw new Error('Expected email to be a string');
        if (typeof password !=  'string') throw new Error('Expected password to be a string');
        if (type != null && typeof type != 'undefined' && typeof type != 'string') throw new Error('Expected type to be a string, undefined, or null');

        this.remove({
            TableName: this.TABLE_NAME,
            Key: {
                [this.PARTITION_KEY]: { S: email },
                [this.SORT_KEY]: { S: password },
                type: type ? { S: type } : null,
            },
        });
    }
};