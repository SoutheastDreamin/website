const gulp = require('gulp');
const gulp_connect = require('gulp-connect');
const path = require('path');

const constants = require('./constants');

/**
 * Gets the path to the image files
 * @returns {string} The image file path
 */
function image_path() {
    return path.join(__dirname, '..', constants.IMG, '**/*.+(png|jpg|gif|svg|eps)');
}

/**
 * Outputs the images
 * @returns {Promise} A promise for when the images have been outputted
 */
function img() {
    const dist_path = path.join(constants.getDistDir(), constants.IMG);
    const config = {
        encoding: false
    };

    return gulp.src(image_path(), config)
        .pipe(gulp.dest(dist_path))
        .pipe(gulp_connect.reload());
}

/**
 * Watches the HTML files
 * @returns {undefined}
 */
function watch() {
    gulp.watch(image_path(), img);
}

module.exports = {
    default: img,
    watch: watch
};