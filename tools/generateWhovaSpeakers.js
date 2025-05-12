const commander = require('commander');
const lodash = require('lodash');
const path = require('path');
const utils = require('./utils');

const program = new commander.Command();

program
    .name('Generate Whova Speaker Data')
    .description('Generates a CSV of speaker data formatted for Whova')
    .version('1.0.0')
    .requiredOption('--year <year>');

program.parse();

const options = program.opts();

const year = options.year;
const loadSessions = utils.loadJSONFile.bind(null, `html/pages/sessions/${year}/index.json`);

/**
 * Collates the data into a format Whova expects
 * @param {object} data The session data
 * @returns {Promise} A promise for the collated data
 */
function collateData(data) {
    return new Promise(function (resolve) {
        const speakers = data.speakers;
        const results = [];

        lodash.each(speakers, function (speaker) {
            const whova_speaker = {
                first_name: speaker.first_name,
                last_name: speaker.last_name,
                email: '',
                affiliation: speaker.company,
                position: speaker.title
            };

            results.push(whova_speaker);
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
    const filename = path.join(__dirname, `../data/whova_speakers_${year}.csv`);
    return utils.writeCSVFile(filename, data);
}

loadSessions()
    .then(collateData)
    .then(writeData)
    .catch(console.error);