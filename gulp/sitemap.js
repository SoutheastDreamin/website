const gulp = require('gulp');
const gulp_sitemap = require('gulp-sitemap');
const path = require('path');

const constants = require('./constants');

/**
 * Gets the path to the output files
 * @returns {String} The output file path
 */
function dist_path() {
    return path.join(constants.getDistDir(), '**/*.html');
}

/**
 * Outputs the javascript
 * @returns {Promise} A promise for when the javascript have been outputted
 */
function sitemap() {
    const src_opts = {
        read: false
    };

    const sitemap_opts = {
        siteUrl: constants.SITE_URL
    };

    return gulp.src(dist_path(), src_opts)
        .pipe(gulp_sitemap(sitemap_opts))
        .pipe(gulp.dest(constants.getDistDir()));
}

module.exports = sitemap;