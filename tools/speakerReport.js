const commander = require('commander');
const lodash = require('lodash');
const chalk = require('chalk');
const path = require('path');
const utils = require('./utils');

const program = new commander.Command();

program
    .name('Checks Session Data')
    .description('Checks the session data and outputs a table')
    .version('1.0.0')
    .requiredOption('--year <year>')
    .option('--verbose');

program.parse();

const options = program.opts();
const loadSessions = utils.loadJSONFile.bind(null, `html/pages/sessions/${options.year}/index.json`);

const SPEAKER_METADATA = {
    head: [
        'Name',
        'Id',
        'Mismatch',
        'Image Path',
        'Image'
    ],
    colWidths: [
        50,
        8,
        8,
        8,
        8
    ]
};

const SESSION_METADATA = {
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
};

/**
 * Checks the speaker
 * @param {Object} speaker The speaker
 * @param {String} id The id
 * @returns {Object[]} The result
 */
function check_speaker(speaker, id) {
    const bad_id = lodash.isEmpty(lodash.get(speaker, 'id'));
    const id_mismatch = !lodash.isEqual(lodash.get(speaker, 'id'), id);
    const image_path = `img/sessions/${options.year}/speakers/${speaker.id}.jpg`;
    const bad_image_path = !lodash.isEqual(lodash.get(speaker, 'image'), `/${image_path}`);
    const image_file_path = path.join(__dirname, '..', speaker.image.substring(1));
    const bad_image = !utils.fileExists(image_file_path);

    return [
        `${speaker.first_name} ${speaker.last_name}`,
        bad_id,
        id_mismatch,
        bad_image_path,
        bad_image
    ];
}

/**
 * Checks a session
 * @param {Object} rooms The rooms
 * @param {Object} tracks The tracks
 * @param {Object} slots The slots
 * @param {Object} speakers The speakers
 * @param {Object} session The session
 * @returns {Object[]} The session check
 */
function check_session(rooms, tracks, slots, speakers, session) {
    const bad_id = lodash.isEmpty(lodash.get(session, 'id'));
    const bad_year = options.year !== session.year;
    const bad_slot = !lodash.has(slots, session.slot);
    const bad_room = !lodash.has(rooms, session.room);
    const bad_track = !lodash.has(tracks, session.track);
    let bad_speaker = false;

    if (!lodash.isArray(session.speakers)) {
        bad_speaker = true;
    } else {
        lodash.each(session.speakers, function (speaker) {
            if (!lodash.has(speakers, speaker)) {
                bad_speaker = true;
            }
        });
    }

    let bad_image = false;

    if (lodash.isArray(session.speakers)) {
        if (lodash.size(session.speakers) === 1) {
            if (!utils.fileExists(path.join(__dirname, `../img/sessions/${options.year}/${session.id}.png`))) {
                bad_image = true;
            }
        } else {
            lodash.each(session.speakers, function (speaker) {
                if (!utils.fileExists(path.join(__dirname, `../img/sessions/${options.year}/${session.id}_${speaker}.png`))) {
                    bad_image = true;
                }
            });
        }
    }

    return [
        session.title,
        bad_id,
        bad_year,
        bad_slot,
        bad_room,
        bad_track,
        bad_speaker,
        bad_image
    ];
}

/**
 * Checks the speakers
 * @param {Object} session_data The session data
 * @returns {Promise} A promise after the speakers have been checked
 */
function checkSpeakers(session_data) {
    return new Promise(function (resolve) {
        const table = utils.buildTable(SPEAKER_METADATA, options.verbose, check_speaker, session_data.speakers);

        if (table.length !== 0) {
            console.log(chalk.bold('Speakers'));
            console.log(table.toString());
        } else {
            console.log(`${utils.checkmark(true)} Speakers`);
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
    const check_speaker_bound = check_session.bind(
        null,
        session_data.rooms,
        session_data.tracks,
        lodash.get(session_data, slot_key),
        session_data.speakers
    );

    return utils.buildTable(SESSION_METADATA, options.verbose, check_speaker_bound, lodash.get(session_data, session_key));
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
            console.log(chalk.bold('Hots'));
            console.log(table.toString());
        } else {
            console.log(`${utils.checkmark(true)} Hots`);
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
            console.log(chalk.bold('Sessions'));
            console.log(table.toString());
        } else {
            console.log(`${utils.checkmark(true)} Sessions`);
        }

        resolve(session_data);
    });
}

loadSessions()
    .then(checkSpeakers)
    .then(checkHots)
    .then(checkSessions)
    .catch(console.error);