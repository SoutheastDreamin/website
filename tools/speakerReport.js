const commander = require('commander');
const jsonfile = require('jsonfile');
const lodash = require('lodash');
const chalk = require('chalk');
const Table = require('cli-table');
const fs = require('fs');
const path = require('path');

const program = new commander.Command();

program
    .name('Generate Session Data')
    .description('Reads a selected session CSV and generates json for the schedule page')
    .version('1.0.0')
    .requiredOption('--year <year>')
    .option('--verbose');

program.parse();

const options = program.opts();

/**
 * Load the session data
 * @returns {Promise} A promise for the session data
 */
function loadSessions() {
    return new Promise(function (resolve, reject) {
        const SCHEDULE_FILE = `html/pages/sessions/${options.year}/index.json`;

        jsonfile.readFile(SCHEDULE_FILE, function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Gets a checkmark or an X based on the value
 * @param {Boolean} value The value
 * @return {String} The display value
 */
function checkmark(value) {
    return value ? chalk.green.bold('✔') : chalk.red.bold('✘');
}

/**
 * Checks the speakers
 * @param {Object} session_data The session data
 * @returns {Promise} A promise after the speakers have been checked
 */
function checkSpeakers(session_data) {
    return new Promise(function (resolve) {
        const table = new Table({
            head: [
                'Name',
                'Id',
                'Mismatch',
                'Image Path',
                'Image'
            ]
        });

        lodash.each(session_data.speakers, function (speaker, id) {
            const bad_id = lodash.isEmpty(lodash.get(speaker, 'id'));
            const id_mismatch = !lodash.isEqual(lodash.get(speaker, 'id'), id);
            const image_path = `img/sessions/${options.year}/speakers/${speaker.id}.jpg`;
            const bad_image_path = !lodash.isEqual(lodash.get(speaker, 'image'), `/${image_path}`);
            const image_file_path = path.join(__dirname, '..', speaker.image.substring(1));
            const bad_image = !fs.existsSync(image_file_path);

            const in_error = bad_id || id_mismatch || bad_image || bad_image_path ;

            if (in_error || options.verbose) {
                table.push([
                    `${speaker.first_name} ${speaker.last_name}`,
                    checkmark(!bad_id),
                    checkmark(!id_mismatch),
                    checkmark(!bad_image_path),
                    checkmark(!bad_image)
                ]);
            }
        });

        if (table.length !== 0) {
            console.log(table.toString());
        } else {
            console.log(`${checkmark(true)} Speakers`);
        }

        resolve(session_data);
    });
}

/**
 * Checks the sessions
 * @param {Object} session_data The session data
 * @param {String} session_key The key for the sessions to use
 * @param {String} slot_key The key for what slots to use
 * @returns {Promise} A promise for when the sessions have been checked
 */
function checkSessionGeneric(session_data, session_key, slot_key) {
    const table = new Table({
        head: [
            'Title',
            'Id',
            'Year',
            'Slot',
            'Room',
            'Track',
            'Speaker',
            'Image'
        ],
        colWidths: [
            50,
            8,
            8,
            8,
            8,
            8,
            8,
            8
        ]
    });

    lodash.each(lodash.get(session_data, session_key), function (session) {
        const bad_id = lodash.isEmpty(lodash.get(session, 'id'));
        const bad_year = options.year !== session.year;
        const bad_slot = !lodash.has(lodash.get(session_data, slot_key), session.slot);
        const bad_room = !lodash.has(session_data.rooms, session.room);
        const bad_track = !lodash.has(session_data.tracks, session.track);
        let bad_speaker = false;

        if (!lodash.isArray(session.speakers)) {
            bad_speaker = true;
        } else {
            lodash.each(session.speakers, function (speaker) {
                if (!lodash.has(session_data.speakers, speaker)) {
                    bad_speaker = true;
                }
            });
        }

        let bad_image = false;

        if (lodash.isArray(session.speakers)) {
            if (lodash.size(session.speakers) === 1) {
                const image_path = path.join(__dirname, `../img/sessions/${options.year}/${session.id}.png`);
                if (!fs.existsSync(image_path)) {
                    bad_image = true;
                }
            } else {
                lodash.each(session.speakers, function (speaker) {
                    const image_path = path.join(__dirname, `../img/sessions/${options.year}/${session.id}_${speaker}.png`);
                    if (!fs.existsSync(image_path)) {
                        bad_image = true;
                    }
                });
            }
        }

        const in_error = bad_id || bad_year || bad_slot || bad_room || bad_track || bad_speaker || bad_image;

        if (in_error || options.verbose) {
            table.push([
                session.title,
                checkmark(!bad_id),
                checkmark(!bad_year),
                checkmark(!bad_slot),
                checkmark(!bad_room),
                checkmark(!bad_track),
                checkmark(!bad_speaker),
                checkmark(!bad_image)
            ]);
        }
    });

    return table;
}

/**
 * Checks the hots
 * @param {Object} session_data The session data
 * @returns {Promise} A promise after the speakers have been checked
 */
function checkHots(session_data) {
    return new Promise(function (resolve) {
        const table = checkSessionGeneric(session_data, 'hots', 'hot_time_slots');

        if (table.length !== 0) {
            console.log(table.toString());
        } else {
            console.log(`${checkmark(true)} Hots`);
        }

        resolve(session_data);
    });
}

/**
 * Checks the sessions
 * @param {Object} session_data The session data
 * @returns {Promise} A promise after the speakers have been checked
 */
function checkSessions(session_data) {
    return new Promise(function (resolve) {
        const table = checkSessionGeneric(session_data, 'sessions', 'session_time_slots');

        if (table.length !== 0) {
            console.log(table.toString());
        } else {
            console.log(`${checkmark(true)} Sessions`);
        }

        resolve(session_data);
    });
}

loadSessions()
    .then(checkSpeakers)
    .then(checkHots)
    .then(checkSessions)
    .catch(console.error);