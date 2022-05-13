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

program.parse();

const options = program.opts();

const year = moment(options.date, 'MM/DD/YYYY').year();
const loadSessions = utils.loadJSONFile.bind(null, `html/pages/sessions/${year}/index.json`);

/**
 * Gets the speaker name
 * @param {Object} speakers A map of speakers
 * @param {String} key The speaker id
 * @returns {String} The formatted speaker name
 */
function getSpeakerName(speakers, key) {
    const speaker = speakers[key];

    return `${speaker.first_name} ${speaker.last_name}`;
}

/**
 * Gets data from the slot
 * @param {Object} slots The slots
 * @param {String} field The field to get
 * @param {String} key The slot id
 * @returns {String} The slot data
 */
function getSlotData(slots, field, key) {
    return lodash.get(slots[key], field);
}

/**
 * Gets the track name
 * @param {Object} tracks The track map
 * @param {String} key The track id
 * @returns {String} The track name
 */
function getTrack(tracks, key) {
    return tracks[key].name;
}

/**
 * Gets the room name
 * @param {Object} rooms The room map
 * @param {String} key The room id
 * @returns {String} The room name
 */
function getRoom(rooms, key) {
    return rooms[key].name;
}

/**
 * Collates the data into a format Whova expects
 * @param {Object} data The session data
 * @returns {Promise} A promise for the collated data
 */
function collateData(data) {
    return new Promise(function (resolve) {
        const results = [];
        const getSpeakerName_bound = getSpeakerName.bind(null, data.speakers);
        const getStart_bound = getSlotData.bind(null, data.session_time_slots, 'start');
        const getEnd_bound = getSlotData.bind(null, data.session_time_slots, 'end');
        const getTrack_bound = getTrack.bind(null, data.tracks);
        const getRoom_bound = getRoom.bind(null, data.rooms);

        lodash.each(data.sessions, function (session) {
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
 * @param {Object[]} data The session data to write to disk
 * @returns {Promise} A promise for when the data has been written
 */
function writeData(data) {
    const filename = path.join(__dirname, `../data/whova_schedule_${year}.csv`);

    return utils.writeCSVFile(filename, data);
}

loadSessions()
    .then(collateData)
    .then(writeData)
    .catch(console.error);