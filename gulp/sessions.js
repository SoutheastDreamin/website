const gulp = require('gulp');
const vinyl = require('vinyl');
const stream = require('stream');
const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const nunjucks = require('nunjucks');

const constants = require('./constants');

/**
 * Gets all the session folders
 * @returns {Promise} A promise for all the session folders
 */
function find_session_dirs() {
    return new Promise(function (resolve, reject) {
        const session_directories = [];
        const readdir_opts = {
            withFileTypes: true
        };

        fs.readdir(constants.getSessionsDir(), readdir_opts, function (error, files) {
            if (error) {
                reject(error);
            } else {
                files.forEach(function (file) {
                    if (file.isDirectory()) {
                        session_directories.push(file.name);
                    }
                });

                resolve(session_directories);
            }
        });
    });
}

/**
 * Handles a session
 * @param {Object} read_this The this from the stream read
 * @param {Object} rooms A map of rooms
 * @param {Object} tracks A map of tracks
 * @param {Object} time_slots A map of time slots
 * @param {Object} session The session to create
 * @returns {Promise} A promise for when the session has been added
 */
function handle_session(read_this, rooms, tracks, time_slots, session) {
    return new Promise(function (resolve) {
        nunjucks.configure(constants.getNunjucksConfig().path);
        const data = {
            session: session,
            rooms: rooms,
            tracks: tracks,
            time_slots: time_slots
        };

        read_this.push(new vinyl({
            path: `sessions/${session.year}/${session.id}/index.html`,
            contents: Buffer.from(nunjucks.render(constants.getSessionTemplate(), data), 'utf-8')
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
        const filename = path.join(constants.getSessionsDir(), directory, 'index.json');

        jsonfile.readFile(filename, function (error, data) {
            if (error) {
                reject(error);
            } else {
                const handle_session_bound = handle_session.bind(null, read_this, data.rooms, data.tracks, data.time_slots);

                data.sessions.forEach(function (session) {
                    promises.push(handle_session_bound(session));
                });
            }

            Promise.all(promises)
                .then(resolve)
                .catch(reject);
        });
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
 * Generates a stream of session files
 * @returns {Object} The stream
 */
function generate_sessions() {
    const stream_opts = {
        objectMode: true
    };
    const src = stream.Readable(stream_opts);

    src._read = function () {
        const read_this = this;
        const handle_dirs_bound = handle_dirs.bind(null, read_this);

        find_session_dirs()
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
 * Takes the session json file and converts it into a set of session pages
 * @returns {Promise} A promise for when the session pages have been created
 */
function sessions() {
    return generate_sessions()
        .pipe(gulp.dest(constants.getDistDir()));
}

module.exports = sessions;