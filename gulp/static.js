const config = require('config');
const gulp = require('gulp');
const path = require('path');

const constants = require('./constants');

const SELECTOR_JS = 'static_files.js';
const SELECTOR_CSS = 'static_files.css';
const SELECTOR_FONT = 'static_files.fonts';

/**
 * Gets an array of absolute file paths
 * @param {string[]} file_list An array of relative files
 * @returns {string[]} An array of absolute files
 */
function buildFileList(file_list) {
    var files = [];

    file_list.forEach(function (file) {
        files.push(path.join(__dirname, '..', file));
    });

    return files;
}

/**
 * If the config has the selector
 * @param {string} selector The selector
 * @returns {boolean} If the file list is not an empty array
 */
function has(selector) {
    const files = config.get(selector);

    return (
        !Array.isArray(files) ||
        files.length !== 0
    );
}

/**
 * If the config has the CSS files
 * @returns {boolean} If the CSS file list is not an empty array
 */
function hasCSS() {
    return has(SELECTOR_CSS);
}

/**
 * If the config has the JS files
 * @returns {boolean} If the JS file list is not an empty array
 */
function hasJS() {
    return has(SELECTOR_JS);
}

/**
 * If the config has the font files
 * @returns {boolean} If the font file list is not an empty array
 */
function hasFont() {
    return has(SELECTOR_FONT);
}

/**
 * Gets the static files for a directory
 * @param {string} sub_directory The sub directory to save to
 * @param {string} selector The config selector
 * @returns {object} A stream for the when the files have been copied
 */
function static_files(sub_directory, selector) {
    const dest_path = path.join(constants.getDistDir(), sub_directory);
    const files = buildFileList(config.get(selector));
    const src_config = {
        encoding: false
    };

    return gulp.src(files, src_config).pipe(gulp.dest(dest_path));
}

/**
 * Copies the static Javascript files
 * @returns {object} A stream for the static Javascript files
 */
function static_js() {
    return static_files(constants.JS, SELECTOR_JS);
}

/**
 * Copies the static CSS files
 * @returns {object} A stream for the static CSS files
 */
function static_css() {
    return static_files(constants.CSS, SELECTOR_CSS);
}

/**
 * Copies the static font files
 * @returns {object} A stream for the static font files
 */
function static_font() {
    return static_files(constants.FONT, SELECTOR_FONT);
}

module.exports = {
    has: {
        css: hasCSS,
        js: hasJS,
        font: hasFont
    },
    css: static_css,
    js: static_js,
    font: static_font
};