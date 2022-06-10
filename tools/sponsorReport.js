const commander = require('commander');
const lodash = require('lodash');
const chalk = require('chalk');
const path = require('path');
const stringStripHtml = require('string-strip-html');
const utils = require('./utils');

const program = new commander.Command();

program
    .name('Check sponsor data')
    .description('Checks the session data and outputs a table')
    .version('1.0.0')
    .requiredOption('--year <year>')
    .option('--verbose');

program.parse();

const options = program.opts();
const loadSponsors = utils.loadJSONFile.bind(null, `html/pages/sponsors/${options.year}/index.json`);

const SPONSOR_METADATA = {
    head: [
        'Name',
        'Description',
        'Description Length',
        'URL',
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

/**
 * Checks the sponsor
 * @param {Object} level The sponsor level
 * @param {Object} sponsor The sponsor
 * @returns {Object[]} The result
 */
function check_sponsor(level, sponsor) {
    const bad_description = lodash.isEmpty(lodash.get(sponsor, 'description'));
    const strippedDescription = stringStripHtml.stripHtml(lodash.get(sponsor, 'description'));
    const bad_description_length = level.maxwords === undefined ? false : lodash.size(lodash.split(strippedDescription, ' ')) > level.maxwords;
    const bad_url = lodash.isEmpty(lodash.get(sponsor, 'url'));
    const bad_image = !utils.fileExists(path.join(__dirname, `..${sponsor.logo}`));

    return [
        sponsor.name,
        bad_description,
        bad_description_length,
        bad_url,
        bad_image
    ];
}

/**
 * Check the sponsor types
 * @param {Object} sponsor_type The sponsor type
 * @returns {undefined}
 */
function check_type(sponsor_type) {
    const bad_label = lodash.isEmpty(sponsor_type.label);
    const bad_size = lodash.isEmpty(sponsor_type.size);

    console.log(chalk.bold(sponsor_type.type));
    console.log(`${utils.checkmark(!bad_label)} - Label`);
    console.log(`${utils.checkmark(!bad_size)} - Size`);

    const check_sponsor_bound = check_sponsor.bind(null, sponsor_type);

    const table = utils.buildTable(SPONSOR_METADATA, options.verbose, check_sponsor_bound, sponsor_type.sponsors);

    if (table.length !== 0) {
        console.log(chalk.bold('Sponsors'));
        console.log(table.toString());
    } else {
        console.log(`${utils.checkmark(true)} Sponsors`);
    }
}

/**
 * Checks the data
 * @param {Object} data The sponsor data
 * @returns {Promise} A promise for when the data has been checked
 */
function checkData(data) {
    return new Promise(function (resolve) {
        const bad_year = data.sponsor_year !== options.year;

        console.log(`${utils.checkmark(!bad_year)} - Year`);

        lodash.each(data.sponsor_types, function (sponsor_type) {
            check_type(sponsor_type);
        });

        resolve(data);
    });
}

loadSponsors()
    .then(checkData)
    .catch(console.error);