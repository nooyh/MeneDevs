module.exports = class DB {
    /**
     * Loads up DynamoDB (Used https://docs.aws.amazon.com/dynamodb/index.html)
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
     * 
     * @param {String} tableName The name of the table
     * @returns AWS promised object
     */
    list(tableName) {
        if (typeof tableName != 'string') throw new Error('Expected tableName to be a string');

        return this._parseList(this.dynamodb.scan({ TableName: tableName, ReturnConsumedCapacity: 'TOTAL' }).promise());
    }

    /**
     * Converts the aws item list into a regular object
     * 
     * @param {Object} awsList The aws object response
     * @returns The aws object with the newly converted item list
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
     * 
     * @param {Object} info This holds the stuff ur looking for in the DB
     * @param {String} info.TableName This is the name of the table (case sensistive)
     * @param {Object} info.Key Looks for a match in this object
     * @returns AWS promised object
     */
    find(info) {
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        return this._baseMethods('get', info);
    }

    /**
     * Shoves info into the DB
     * 
     * @param {Object} info This holds the stuff ur putting in the DB
     * @param {String} info.TableName This is the name of the table (case sensistive)
     * @param {Object} info.Item This will hold ur actual data
     * @param {String} info.Item.ADD_PARTITION_KEY_HERE This should be the name of ur primary sorter
     * @param {?String} info.Item.ADD_SORT_KEY_HERE (optional) This should be the name of ur range attribute
     * @returns AWS promised object
     */
    put(info) {
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        return this._baseMethods('put', info);
    }

    /**
     * Removes info from the DB
     * 
     * @param {Object} info This holds the stuff ur removing from the DB
     * @param {String} info.TableName This is the name of the table (case sensistive)
     * @param {Object} info.Key This holds the actuall data u wanna look for and delete
     * @returns AWS promised object
     */
    remove(info) {
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        return this._baseMethods('delete', info);
    }

    /**
     * Looks in the db for a match according to ur info
     * 
     * @param {String} method Can either be get or put
     * @param {Object} info This holds the info ur looking for
     * @param {String} info.TableName This is the name of the table (case sensitive)
     * @param {Object} info.ADD_TYPE_HERE The type should be 'Item' for put methods, 'Key' for get & delete methods
     * @param {String} info.ADD_TYPE_HERE.ADD_PARTITION_KEY_HERE This should be the name of ur primary sorter
     * @param {?String} info.ADD_TYPE_HERE.ADD_SORT_KEY_HERE (optional) This should be the name of ur range attribute
     * @returns AWS promised object
     */
    async _baseMethods(method, info) {
        if (typeof method != 'string') throw new Error('Expected method to be a string');
        if (typeof info != 'object') throw new Error('Expected info to be an object');

        const response = await this.dynamodb[`${method}Item`](info).promise();

        return response.Item ? this._parseItem(response.Item) : response;
    }

    /**
     * Converts the shitty AWS format to a regular one
     * 
     * @param {Object} item The item u want fixed
     * @returns The new regular object
     */
    _parseItem(item) {
        if (typeof item != 'object') throw new Error('Expected item to be an object');

        return this.unmarshall(item);
    }
};