const gulp = require('gulp');
const gulp_connect = require('gulp-connect');
const path = require('path');

const constants = require('./constants');

/**
 * Gets the path to the css files
 * @returns {String} The css file path
 */
function css_path() {
    return path.join(__dirname, '..', constants.CSS, '**/*.css');
}

/**
 * Outputs the css files
 * @returns {String} A stream for when the css files
 */
function css() {
    const dist_path = path.join(constants.getDistDir(), constants.CSS);

    return gulp.src(css_path())
        .pipe(gulp.dest(dist_path))
        .pipe(gulp_connect.reload());
}

/**
 * Watches the HTML files
 * @returns {undefined}
 */
function watch() {
    gulp.watch(css_path(), css);
}

module.exports = {
    default: css,
    watch: watch
};