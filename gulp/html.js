const fs = require('fs');
const gulp = require('gulp');
const gulp_connect = require('gulp-connect');
const gulp_data = require('gulp-data');
const gulp_nunjucks = require('gulp-nunjucks-render');
const path = require('path');
const lodash = require('lodash');

const constants = require('./constants');
const config = require('../config.json');

const ADDITIONAL_DATA = {
    'html/pages/schedule/index.html': [
        `html/pages/schedule/${config.year}/index.json`,
        `html/pages/sessions/${config.year}/index.json`
    ],
    'html/pages/sessions/index.html': [
        `html/pages/sessions/${config.year}/index.json`
    ],
    'html/pages/sponsors/index.html': [
        `html/pages/sponsors/${config.year}/index.json`
    ],
    'html/pages/team/index.html': [
        `html/pages/team/${config.year}/index.json`
    ],
    'html/pages/index.html': [
        `html/pages/sponsors/${config.year}/index.json`
    ]
};

/**
 * List the years for the schedule
 * @returns {String[]} A list of years
 */
function list_years() {
    const schedule_path = 'html/pages/schedule/';
    const opts = {
        withFileTypes: true
    };
    return fs.readdirSync(schedule_path, opts)
        .filter(function (file) {
            return file.isDirectory();
        })
        .map(function (file) {
            return file.name;
        });
}

lodash.each(list_years(), function (year) {
    const key = `html/pages/schedule/${year}/index.html`;

    ADDITIONAL_DATA[key] = [];
    ADDITIONAL_DATA[key].push(`html/pages/sessions/${year}/index.json`);
});

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
        data.data = {};
        // It's ok if we don't have supplemental data
    }

    lodash.each(ADDITIONAL_DATA, function (supplemental_data_paths, filename) {
        if (lodash.endsWith(file.path, filename)) {
            lodash.each(supplemental_data_paths, function (supplemental_data_path) {
                try {
                    lodash.merge(data.data, JSON.parse(fs.readFileSync(supplemental_data_path)));
                } catch (err) {
                    // It's ok if the additional data fails too
                }
            });
        }
    });

    return data;
}

/**
 * Outputs the HTML
 * @returns {Promise} A promise for when the HTML has been outputted
 */
function html() {
    const nunjucks_config = constants.getNunjucksConfig();

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