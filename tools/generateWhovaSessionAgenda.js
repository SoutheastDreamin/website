const commander = require('commander');
const lodash = require('lodash');
const path = require('path');
const moment = require('moment');
const utils = require('./utils');
const stripHtml = require('string-strip-html').stripHtml;

const program = new commander.Command();

program
    .name('Generate Whova Session Data')
    .description('Generates a CSV of session data formatted for Whova')
    .version('1.0.0')
    .requiredOption('--date <date>');

program.addOption(new commander.Option('--type <type>').choices([ 'sessions', 'hots' ]).makeOptionMandatory());
program.parse();

const options = program.opts();

const type = options.type;
const year = moment(options.date, 'MM/DD/YYYY').year();
const loadSessions = utils.loadJSONFile.bind(null, `html/pages/sessions/${year}/index.json`);

/**
 * Gets the speaker name
 * @param {object} speakers A map of speakers
 * @param {string} key The speaker id
 * @returns {string} The formatted speaker name
 */
function getSpeakerName(speakers, key) {
    const speaker = speakers[key];

    return `${speaker.first_name} ${speaker.last_name}`;
}

/**
 * Gets data from the slot
 * @param {object} slots The slots
 * @param {string} field The field to get
 * @param {string} key The slot id
 * @returns {string} The slot data
 */
function getSlotData(slots, field, key) {
    return lodash.get(slots[key], field);
}

/**
 * Gets the track name
 * @param {object} tracks The track map
 * @param {string} key The track id
 * @returns {string} The track name
 */
function getTrack(tracks, key) {
    return tracks[key].name;
}

/**
 * Gets the room name
 * @param {object} rooms The room map
 * @param {string} key The room id
 * @returns {string} The room name
 */
function getRoom(rooms, key) {
    return rooms[key].name;
}

/**
 * Collates the data into a format Whova expects
 * @param {object} data The session data
 * @returns {Promise} A promise for the collated data
 */
function collateData(data) {
    return new Promise(function (resolve) {
        const time_slots = type === 'sessions' ? data.session_time_slots : data.hot_time_slots;
        const results = [];
        const getSpeakerName_bound = getSpeakerName.bind(null, data.speakers);
        const getStart_bound = getSlotData.bind(null, time_slots, 'start');
        const getEnd_bound = getSlotData.bind(null, time_slots, 'end');
        const getTrack_bound = getTrack.bind(null, data.tracks);
        const getRoom_bound = getRoom.bind(null, data.rooms);

        lodash.each(data[type], function (session) {
            const speaker_names = [];

            lodash.each(session.speakers, function (speaker) {
                speaker_names.push(getSpeakerName_bound(speaker));
            });

            const abstract = stripHtml(session.abstract).result;

            results.push({
                date: options.date,
                start: getStart_bound(session.slot),
                end: getEnd_bound(session.slot),
                track: getTrack_bound(session.track),
                title: session.title,
                room: getRoom_bound(session.room),
                description: abstract,
                speakers: lodash.join(speaker_names, ';')
            });
        });

        resolve(results);
    });
}

/**
 * Writes the session data to disk
 * @param {object[]} data The session data to write to disk
 * @returns {Promise} A promise for when the data has been written
 */
function writeData(data) {
    const filename = path.join(__dirname, `../data/whova_schedule_${type}_${year}.csv`);

    return utils.writeCSVFile(filename, data);
}

loadSessions()
    .then(collateData)
    .then(writeData)
    .catch(console.error);