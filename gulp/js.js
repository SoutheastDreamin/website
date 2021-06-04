const gulp = require('gulp');
const gulp_bro = require('gulp-bro');
const gulp_connect = require('gulp-connect');
const path = require('path');

const constants = require('./constants');

/**
 * Gets the path to the javascript files
 * @returns {String} The javascript file path
 */
function js_path() {
    return path.join(__dirname, '..', constants.JS, '**/*.js');
}

/**
 * Outputs the javascript
 * @returns {Promise} A promise for when the javascript have been outputted
 */
function js() {
    const dist_path = path.join(constants.getDistDir(), constants.JS);

    return gulp.src(js_path())
        .pipe(gulp_bro())
        .pipe(gulp.dest(dist_path))
        .pipe(gulp_connect.reload());
}

/**
 * Watches the HTML files
 * @returns {undefined}
 */
function watch() {
    gulp.watch(js_path(), js);
}

module.exports = {
    default: js,
    watch: watch
};