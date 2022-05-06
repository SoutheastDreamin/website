const gulp = require('gulp');
const vinyl = require('vinyl');
const stream = require('stream');
const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const nunjucks = require('nunjucks');

const constants = require('./constants');

/**
 * Gets all the sponsor folders
 * @returns {Promise} A promise for all the sponsor folders
 */
function find_sponsor_dirs() {
    return new Promise(function (resolve, reject) {
        const sponsor_directories = [];
        const readdir_opts = {
            withFileTypes: true
        };

        fs.readdir(constants.getSponsorDir(), readdir_opts, function (error, files) {
            if (error) {
                reject(error);
            } else {
                files.forEach(function (file) {
                    if (file.isDirectory()) {
                        sponsor_directories.push(file.name);
                    }
                });

                resolve(sponsor_directories);
            }
        });
    });
}

/**
 * Handles a sponsor
 * @param {Object} read_this The this from the stream read
 * @param {String} year The year
 * @param {Object} sponsor The sponsor to create
 * @returns {Promise} A promise for when the sponsor has been added
 */
function handle_sponsor(read_this, year, sponsor) {
    return new Promise(function (resolve) {
        nunjucks.configure(constants.getNunjucksConfig().path);
        const data = {
            sponsor: sponsor
        };

        read_this.push(new vinyl({
            path: `sponsors/${year}/${sponsor.id}/index.html`,
            contents: Buffer.from(nunjucks.render(constants.getSponsorTemplate(), data), 'utf-8')
        }));

        resolve();
    });
}

/**
 * Handles a single year
 * @param {Object} read_this The this from the stream read
 * @param {String} directory The directory to load
 * @returns {Promise} A promise for when the stream has been populated
 */
function handle_dir(read_this, directory) {
    return new Promise(function (resolve, reject) {
        const promises = [];
        const filename = path.join(constants.getSponsorDir(), directory, 'index.json');

        if (!fs.existsSync(filename)) {
            resolve();
        } else {
            jsonfile.readFile(filename, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    const handle_sponsor_bound = handle_sponsor.bind(null, read_this, data.sponsor_year);

                    data.sponsor_types.forEach(function (type) {
                        if (type.fullpage) {
                            type.sponsors.forEach(function (sponsor) {
                                promises.push(handle_sponsor_bound(sponsor));
                            });
                        }
                    });
                }

                Promise.all(promises)
                    .then(resolve)
                    .catch(reject);
            });
        }
    });
}

/**
 * Handles all the years
 * @param {Object} read_this The this from the stream read
 * @param {String[]} directories The directories to load
 * @returns {Promise} A promise for when the stream has been populated
 */
function handle_dirs(read_this, directories) {
    return new Promise(function (resolve, reject) {
        const handle_dir_bound = handle_dir.bind(null, read_this);
        const promises = [];

        directories.forEach(function (directory) {
            promises.push(handle_dir_bound(directory));
        });

        Promise.all(promises)
            .then(resolve)
            .catch(reject);
    });
}

/**
 * Generates a stream of sponsor files
 * @returns {Object} The stream
 */
function generate_sponsors() {
    const stream_opts = {
        objectMode: true
    };
    const src = stream.Readable(stream_opts);

    src._read = function () {
        const read_this = this;
        const handle_dirs_bound = handle_dirs.bind(null, read_this);

        find_sponsor_dirs()
            .then(handle_dirs_bound)
            .catch(console.error)
            .finally(function () {
                // Must be done or gulp will hang indefinitely
                read_this.push(null);
            });
    };

    return src;
}

/**
 * Takes the sponsors json file and converts it into a set of sponsor pages
 * @returns {Promise} A promise for when the sponsor pages have been created
 */
function sponsors() {
    return generate_sponsors()
        .pipe(gulp.dest(constants.getDistDir()));
}

module.exports = sponsors;