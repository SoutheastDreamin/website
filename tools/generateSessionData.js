const commander = require('commander');
const csv = require('csvtojson');
const jsonfile = require('jsonfile');
const lodash = require('lodash');

const SCHEDULE_FILE = 'html/pages/schedule/index.json';
const SESSION_KEY = 'sessions';

const program = new commander.Command();

program
    .name('Generate Session Data')
    .description('Reads a selected session CSV and generates json for the schedule page')
    .version('1.0.0')
    .requiredOption('--csv <file>');

program.parse();

const options = program.opts();

/**
 * Load the CSV from disk
 * @returns {Promise} A promise for the CVS data
 */
function loadCsv() {
    return new Promise(function (resolve, reject) {
        csv()
            .fromFile(options.csv)
            .then(resolve)
            .catch(reject);
    });
}

/**
 * Filters out only the selected sessions
 * @param {Object[]} sessions The session data
 * @returns {Promise} A promise for the filtered data
 */
function filterSelected(sessions) {
    return new Promise(function (resolve) {
        resolve(lodash.filter(sessions, 'selected'));
    });
}

/**
 * Transforms the session data for web display
 * @param {Object[]} sessions The selected sessions
 * @returns {Promise} A promise for the transformed session data
 */
function transformSessions(sessions) {
    return new Promise(function (resolve) {
        const web_data = [];
        lodash.forEach(sessions, function (session) {
            web_data.push({
                title: session.session_title,
                abstract: session.session_abstract,
                track: session.track,
                room: '',
                slot: '',
                speaker: {
                    first_name: session.first_name,
                    last_name: session.last_name,
                    pronouns: '',
                    title: '',
                    company: '',
                    image: ''
                }
            });
        });

        resolve(web_data);
    });
}

/**
 * Writes the session data out to the schedule JSON
 * @param {Object[]} sessions The selected sessions
 * @returns {Promise} A promise for when the session data is written
 */
function writeSessionData(sessions) {
    return new Promise(function (resolve, reject) {
        jsonfile.readFile(SCHEDULE_FILE)
            .then(function (schedule_data) {
                const json_opts = {
                    spaces: 4
                };

                lodash.set(schedule_data, SESSION_KEY, sessions);

                jsonfile.writeFile(SCHEDULE_FILE, schedule_data, json_opts)
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}

loadCsv()
    .then(filterSelected)
    .then(transformSessions)
    .then(writeSessionData)
    .catch(console.error);