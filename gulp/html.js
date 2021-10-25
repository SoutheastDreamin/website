const fs = require('fs');
const gulp = require('gulp');
const gulp_connect = require('gulp-connect');
const gulp_data = require('gulp-data');
const gulp_nunjucks = require('gulp-nunjucks-render');
const path = require('path');

const constants = require('./constants');

/**
 * Gets the path to the HTML page files
 * @returns {String} The HTML page file path
 */
function page_path() {
    return path.join(__dirname, '..', constants.HTML, constants.PAGES, '**/*.+(html|nunjucks)');
}

/**
 * Gets the path to the HTML template files
 * @returns {String} The HTML template file path
 */
function template_path() {
    return path.join(__dirname, '..', constants.HTML, constants.TEMPLATES, '**/*.+(html|nunjucks)');
}

/**
 * Loads the JSON data
 * @param {String} file The filename
 * @returns {String} The json data
 */
function getJsonForFile(file) {
    const extension = 'html';
    const data_file = path.join(path.dirname(file.path), path.basename(file.path, '.' + extension) + '.json');

    var data = {};

    try {
        data.data = JSON.parse(fs.readFileSync(data_file));
    } catch (err) {
        // It's ok if we don't have supplemental data
    }

    return data;
}

/**
 * Outputs the HTML
 * @returns {Promise} A promise for when the HTML has been outputted
 */
function html() {
    const nunjucks_config = {
        path: [
            path.join(__dirname, '..', constants.HTML, constants.TEMPLATES)
        ]
    };

    return gulp.src(page_path())
        .pipe(gulp_data(getJsonForFile))
        .pipe(gulp_nunjucks(nunjucks_config))
        .pipe(gulp.dest(constants.getDistDir()))
        .pipe(gulp_connect.reload());
}

/**
 * Watches the HTML files
 * @returns {undefined}
 */
function watch() {
    gulp.watch(page_path(), html);
    gulp.watch(template_path(), html);
}

module.exports = {
    default: html,
    watch: watch
};