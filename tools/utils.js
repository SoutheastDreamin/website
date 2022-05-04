const jsonfile = require('jsonfile');
const chalk = require('chalk');
const fs = require('fs');
const Table = require('cli-table');
const lodash = require('lodash');

/**
 * Gets the data from a JSON file
 * @param {String} filename The filename
 * @returns {Promise} A promise for the contents of the JSON file
 */
function loadJSONFile(filename) {
    return new Promise(function (resolve, reject) {
        jsonfile.readFile(filename, function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Gets a checkmark or an X based on the value
 * @param {Boolean} value The value
 * @return {String} The display value
 */
function checkmark(value) {
    return value ? chalk.green.bold('✔') : chalk.red.bold('✘');
}

/**
 * Checks if the file exists
 * @param {String} filename The filename
 * @returns {Boolean} If the file exists
 */
function fileExists(filename) {
    return fs.existsSync(filename);
}

/**
 * Generate the display data
 * @param {Object[]} table_data The table data
 * @returns {Object[]} The display data
 */
function generateDisplay(table_data) {
    const formatted_data = [];

    lodash.each(table_data, function (row) {
        const formatted_row = [];

        lodash.each(row, function (data) {
            if (lodash.isBoolean(data)) {
                formatted_row.push(checkmark(!data));
            } else {
                formatted_row.push(data);
            }
        });

        formatted_data.push(formatted_row);
    });

    return formatted_data;
}

/**
 * Builds a table
 * @param {Object} table_metadata The table metadata
 * @param {Boolean} is_verbose Is the table verbose
 * @param {Function} checker The checker function
 * @param {Object[]} data The first string
 * @returns {Object} The table
 */
function buildTable(table_metadata, is_verbose, checker, data) {
    const table = new Table(table_metadata);

    const table_data = lodash.map(data, checker);
    let sub_data = [];
    sub_data.push(...table_data);

    if (!is_verbose) {
        sub_data = [];

        lodash.each(table_data, function (row) {
            lodash.each(row, function (row_data) {
                if (
                    lodash.isBoolean(row_data) &&
                    row_data
                ) {
                    sub_data.push(row);
                }
            });
        });
    }

    table.push(...generateDisplay(sub_data));

    return table;
}

module.exports = {
    loadJSONFile: loadJSONFile,
    checkmark: checkmark,
    fileExists: fileExists,
    buildTable: buildTable
};