module.exports = class DB {
    /**
     * Loads up DynamoDB
     */
    constructor() {
        const AWS = require('aws-sdk');
        this.unmarshall = require('@aws-sdk/util-dynamodb').unmarshall;

        AWS.config.update({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        this.dynamodb = new AWS.DynamoDB();
    }

    /**
     * Gives u everything inside whatever table ya want
     * @param {String} tableName The name of the table
     * @returns {Promise} AWS promised object
     */
    list(tableName) {
        if (typeof tableName != 'string') throw new Error('Expected tableName to be a string');

        return this._parseList(this.dynamodb.scan({ TableName: tableName, ReturnConsumedCapacity: 'TOTAL' }).promise());
    }

    /**
     * Converts the aws item list into a regular object
     * @param {Object} awsList The aws object response
     * @returns {Object} The aws object with the newly converted item list
     */
    async _parseList(awsList) {
        if (typeof awsList != 'object') throw new Error('Expected awsList to be an object');
        awsList = await awsList;

        for (let i = 0; i < awsList.Items.length; i++) {
            awsList.Items[i] = this._parseItem(awsList.Items[i]);
        }

        return awsList;
    }

    /**
     * Looks for stuff in the DB
     * @param {Object} info This holds the stuff ur looking for in the DB
     * @param {String} info.TableName This is the name of the table (case sensistive)
     * @param {Object} info.Key Looks for a match in this object
     * @returns {Promise} AWS promised object
     */
    find(info) {
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        return this._baseMethods('get', info);
    }

    /**
     * Shoves info into the DB
     * @param {Object} info This holds the stuff ur putting in the DB
     * @param {String} info.TableName This is the name of the table (case sensistive)
     * @param {Object} info.Item This will hold ur actual data
     * @param {String} info.Item.PARTITION_KEY_HERE This should be the name of ur primary sorter
     * @param {String} info.Item.SORT_KEY_HERE This should be the name of ur range attribute
     */
    put(info) {
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        return this._baseMethods('put', info);
    }

    /**
     * Removes info from the DB
     * @param {Object} info This holds the stuff ur removing from the DB
     * @param {String} info.TableName This is the name of the table (case sensistive)
     * @param {Object} info.Key This holds the actuall data u wanna look for and delete
     */
    remove(info) {
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        return this._baseMethods('delete', info);
    }

    /**
     * Looks in the db for a match according to ur info
     * @param {String} method Can either be get or put
     * @param {Object} info This holds the info ur looking for
     * @param {String} info.TableName This is the name of the table (case sensitive)
     * @param {Object} info.TYPE_HERE The type should be Item = put methods, Key = get & delete methods
     * @param {String} info.TYPE_HERE.PARTITION_KEY_HERE This should be the name of ur primary sorter
     * @param {String} info.TYPE_HERE.SORT_KEY_HERE This should be the name of ur range attribute
     * @returns {Promise} AWS promised object
     */
    async _baseMethods(method, info) {
        if (typeof method != 'string') throw new Error('Expected method to be a string');
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        const response = await this.dynamodb[`${method}Item`](info).promise();

        return response.Item ? this._parseItem(response.Item) : response;
    }

    /**
     * Converts the shitty AWS format to a regular one
     * @param {Object} item The item u want fixed
     * @returns {Object} The new regular object
     */
    _parseItem(item) {
        if (typeof item != 'object') throw new Error('Expected item to be an object');

        return this.unmarshall(item);
    }
};