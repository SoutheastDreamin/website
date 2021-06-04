const gulp = require('gulp');
const gulp_connect = require('gulp-connect');
const path = require('path');

const constants = require('./constants');

const IGNORED_FILES = [
    'README.md'
];

/**
 * Gets the path to the image files
 * @returns {String} The image file path
 */
function public_path() {
    const paths = [
        path.join(__dirname, '..', constants.PUB, '**/*')
    ];

    IGNORED_FILES.forEach(function (value) {
        paths.push(`!${path.join(__dirname, '..', constants.PUB, value)}`);
    });

    return paths;
}

/**
 * Outputs the images
 * @returns {Promise} A promise for when the images have been outputted
 */
function pub() {
    return gulp.src(public_path())
        .pipe(gulp.dest(constants.getDistDir()))
        .pipe(gulp_connect.reload());
}

/**
 * Watches the HTML files
 * @returns {undefined}
 */
function watch() {
    gulp.watch(public_path(), pub);
}

module.exports = {
    default: pub,
    watch: watch
};