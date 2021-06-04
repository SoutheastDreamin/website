const gulp = require('gulp');
const gulp_connect = require('gulp-connect');
const gulp_sass = require('gulp-sass');
const path = require('path');

const constants = require('./constants');

gulp_sass.compiler = require('node-sass');

/**
 * Gets the path to the SASS files
 * @returns {String} The SASS path
 */
function sass_path() {
    return path.join(__dirname, '..', constants.SASS, '**/*.scss');
}

/**
 * Compiles the SASS files down to CSS files
 * @returns {Promise} A promise for when the SASS has been compiled
 */
function sass() {
    const dist_path = path.join(constants.getDistDir(), constants.CSS);

    const sass_config = {
        outputStyle: 'compressed'
    };

    return gulp.src(sass_path())
        .pipe(gulp_sass(sass_config).on('error', gulp_sass.logError))
        .pipe(gulp.dest(dist_path))
        .pipe(gulp_connect.reload());
}

/**
 * Watches for SASS changes
 * @returns {undefined}
 */
function watch() {
    gulp.watch(sass_path(), sass);
}

module.exports = {
    default: sass,
    watch: watch
};