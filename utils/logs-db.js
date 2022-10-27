const DB = require('./dynamo-db');
const emitter = require('./emitter');

module.exports = class LogsDB extends DB {
    /**
     * Loads reports db in dynamo
     */
    constructor() {
        super();

        this.TABLE_NAME = 'Logs';
        this.PARTITION_KEY = 'timestamp';
        this.SORT_KEY = 'category';

        this.filters = {
            Category: 'category',
            Agency: 'agency',
            Name: 'name',
            Date: 'timestamp',
        };

        this._listenToReportEvents();
    }

    _listenToReportEvents() {
        emitter.on('reportAdd', (report) => this._addLog('add', report));
        emitter.on('reportUpdate', (report) => this._addLog('edit', report));
        emitter.on('reportDelete', (report) => this._addLog('delete', report));
    }

    /**
     * Makes a new log from scratch
     * 
     * @param {String} category The category of log (add, edit, delete)
     * @param {Object} report The report object from report-db
     * @param {String} report.stationArea Name of TOD station area
     * @param {String} report.projectName Name of project
     * @param {String} report.totalArea Total area of project (in acres)
     * @param {String} report.location Name of project location
     * @param {?String} report.tmk (optional) Tax Map Key Numbers
     * @param {String} report.phase Project phase [Planning/Pre-planning]
     * @param {?String} report.status (optional) Project status
     * @param {String} report.date Date of report DD/MM/YYYY
     * @param {String} report.contact Contact information as phone number
     * @param {String} report.email Email address
     * @param {?String} report.budget (optional) The budget amount
     * @returns Empty promise
     */
    async _addLog(category, report) {
        if (!['add', 'edit', 'delete'].includes(category)) throw new Error("Expected category to be 'add', 'edit', or 'delete'");
        if (typeof report != 'object') throw new Error('Expected report to be an object');
        if (!this.logs) await this._loadSavedLogs();

        const params = {
            TableName: this.TABLE_NAME,
            Item: {
                [this.PARTITION_KEY]: { S: Date.now().toString() },
                [this.SORT_KEY]: { S: category },
                agency: { S: report.agency },
                name: { S: report.projectName },
                reportId: { S: report.id },
            },
        };
        const parsedItem = this._parseItem(params.Item);

        await this.put(params);
        this.logs.push(parsedItem);
        this._filterLogs();
    }

    /**
     * This will populate the filter objects and sort them from newest to oldest based on the timestamp
     */
    _filterLogs() {
        // reset filters
        for (const filter in this.filters) {
            this[`filterBy${filter}`] = {};
        }

        // start filtering
        for (const log of this.logs) {
            for (const [name, key] of Object.entries(this.filters)) {
                const filter = this[`filterBy${name}`];
                if (!filter[log[key]]) filter[log[key]] = [];
                filter[log[key]].push(log);
            }
        }

        // start sorting
        for (const name of Object.keys(this.filters)) {
            for (const [key, filteredLogs] of Object.entries(this[`filterBy${name}`])) {
                this[`filterBy${name}`][key] = this._mergeSort(filteredLogs, (a, b) => {
                    if (a.timestamp === b.timestamp) return 0;
                    return a.timestamp > b.timestamp ? -1 : 1;
                });
            }
        }
    }

    /**
     * Cuts the arrays a bunch of times then gives it to the merge function (https://www.geeksforgeeks.org/merge-sort/)
     * 
     * @param {Array} arr The list of stuff u wanna sort
     * @param {Function} compare This is how u wanna compare the values to determine which is greater or less
     * @returns Gives you the sorted array
     */
    _mergeSort(arr, compare) {
        const { length } = arr;

        if (length > 1) {
            const middle = Math.floor(length / 2);
            const left = this._mergeSort(arr.slice(0, middle), compare);
            const right = this._mergeSort(arr.slice(middle, length), compare);
            arr = this._merge(left, right, compare);
        }

        return arr;
    }

    /**
     * Merges and sorts together the two split arrays (https://www.geeksforgeeks.org/merge-sort/)
     * 
     * @param {Array} left Left side of the split array
     * @param {Array} right Right side of the split array
     * @param {Function} compare This is how u wanna compare the values to determine which is greater or less
     * @returns The merged arrays
     */
    _merge(left, right, compare) {
        let i = 0;
        let j = 0;
        const result = [];
        while (i < left.length && j < right.length) {
            result.push(compare(left[i], right[j]) === -1 ? left[i++] : right[j++]);
        }
        return result.concat(i < left.length ? left.slice(i) : right.slice(j));
    }

    /**
     * This gets all the reports from dynamo, saves them locally, then filters and sorts them
     */
    async _loadSavedLogs() {
        this.logs = (await this.list(this.TABLE_NAME)).Items;
        this._filterLogs();
    }
};