const del = require('del');

const constants = require('./constants');

/**
 * Removes the output file
 * @returns {Promise} A promise for when the folder has been removed
 */
function clean() {
    return del(constants.getDistDir());
}

module.exports = clean;