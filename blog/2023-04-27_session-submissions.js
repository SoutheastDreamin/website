const by_track = {
    'Executives': 14,
    'Business Analysis': 9,
    'Administrators': 95,
    'Developers': 27,
    'Marketing Cloud / Pardot': 5,
    'End Users': 4,
    'Non-Profit': 8
};

const chosen_by_track = {
    'Executives': 3,
    'Business Analysis': 2,
    'Administrators': 14,
    'Developers': 6,
    'Marketing Cloud / Pardot': 4,
    'End Users': 2,
    'Non-Profit': 4
};

const submission_dates = {
    '2022-12-05': '2',
    '2022-12-06': '2',
    '2022-12-07': '2',
    '2022-12-08': '3',
    '2022-12-09': '3',
    '2022-12-10': '3',
    '2022-12-11': '3',
    '2022-12-12': '3',
    '2022-12-13': '6',
    '2022-12-14': '6',
    '2022-12-15': '6',
    '2022-12-16': '6',
    '2022-12-17': '6',
    '2022-12-18': '6',
    '2022-12-19': '6',
    '2022-12-20': '6',
    '2022-12-21': '6',
    '2022-12-22': '7',
    '2022-12-23': '8',
    '2022-12-24': '8',
    '2022-12-25': '8',
    '2022-12-26': '10',
    '2022-12-27': '10',
    '2022-12-28': '10',
    '2022-12-29': '10',
    '2022-12-30': '10',
    '2022-12-31': '10',
    '2023-01-01': '10',
    '2023-01-02': '10',
    '2023-01-03': '17',
    '2023-01-04': '17',
    '2023-01-05': '17',
    '2023-01-06': '20',
    '2023-01-07': '21',
    '2023-01-08': '21',
    '2023-01-09': '21',
    '2023-01-10': '24',
    '2023-01-11': '25',
    '2023-01-12': '29',
    '2023-01-13': '29',
    '2023-01-14': '32',
    '2023-01-15': '32',
    '2023-01-16': '36',
    '2023-01-17': '36',
    '2023-01-18': '36',
    '2023-01-19': '36',
    '2023-01-20': '44',
    '2023-01-21': '44',
    '2023-01-22': '44',
    '2023-01-23': '44',
    '2023-01-24': '44',
    '2023-01-25': '44',
    '2023-01-26': '46',
    '2023-01-27': '48',
    '2023-01-28': '48',
    '2023-01-29': '48',
    '2023-01-30': '50',
    '2023-01-31': '50',
    '2023-02-01': '50',
    '2023-02-02': '50',
    '2023-02-03': '50',
    '2023-02-04': '50',
    '2023-02-05': '50',
    '2023-02-06': '50',
    '2023-02-07': '51',
    '2023-02-08': '51',
    '2023-02-09': '52',
    '2023-02-10': '52',
    '2023-02-11': '52',
    '2023-02-12': '54',
    '2023-02-13': '54',
    '2023-02-14': '58',
    '2023-02-15': '58',
    '2023-02-16': '59',
    '2023-02-17': '59',
    '2023-02-18': '59',
    '2023-02-19': '59',
    '2023-02-20': '60',
    '2023-02-21': '60',
    '2023-02-22': '61',
    '2023-02-23': '62',
    '2023-02-24': '63',
    '2023-02-25': '63',
    '2023-02-26': '64',
    '2023-02-27': '75',
    '2023-02-28': '75',
    '2023-03-01': '77',
    '2023-03-02': '78',
    '2023-03-03': '81',
    '2023-03-04': '81',
    '2023-03-05': '82',
    '2023-03-06': '84',
    '2023-03-07': '84',
    '2023-03-08': '84',
    '2023-03-09': '89',
    '2023-03-10': '91',
    '2023-03-11': '92',
    '2023-03-12': '92',
    '2023-03-13': '96',
    '2023-03-14': '103',
    '2023-03-15': '109',
    '2023-03-16': '123',
    '2023-03-17': '152',
    '2023-03-18': '162'
};

const speaker_gender = {
    'Female': 23,
    'Male': 27,
    'Non-Binary': 2,
    'Female, Non-Binary, Genderqueer/Non-conforming': 1
};

const speaker_race = {
    'Asian': 6,
    'Black or African American': 6,
    'Black or African American, Hispanic or Latino': 1,
    'Hispanic or Latino': 3,
    'Hispanic or Latino, White': 1,
    'MENA': 1,
    'White': 31,
    'Prefer not to say': 4
};

const speaker_lgbtqai = {
    'Yes': 4,
    'No': 29,
    'Prefer not to say': 2
};

const speaker_disability = {
    'Yes': 7,
    'No': 31
};

/**
 * Builds a legend
 * @param {Object} data The data
 * @returns {String[]} The legend
 */
function buildLegend(data) {
    const legend = [];

    for (const key in data) {
        legend.push(key);
    }

    return legend;
}

/**
 * Builds a dataset
 * @param {String[]} legend The legend
 * @param {String} label The dataset label
 * @param {Object[]} data The data
 * @returns {Object} The dataset
 */
function buildDataset(legend, label, data) {
    const dataset = [
        {
            label: label,
            data: [],
            pointStyle: false
        }
    ];

    legend.forEach(function (key) {
        dataset[0].data.push(data[key]);
    });

    return dataset;
}

/**
 * Renders out a pie chat
 * @param {String} canvas_id The id of the canvas
 * @param {String} title The chart title
 * @param {Object} data The chart data
 * @returns {undefined}
 */
function drawPieChart(canvas_id, title, data) {
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    };

    const ctx = document.getElementById(canvas_id);
    new Chart(ctx, config);
}

/**
 * Generates a pie chart
 * @param {String} canvas_id The id of the canvas
 * @param {String} title The chart title
 * @param {String} label The dataset label
 * @param {Object} src_data The data
 * @returns {undefined}
 */
function generatePieChart(canvas_id, title, label, src_data) {
    const labels = buildLegend(src_data);

    const data = {
        labels: labels,
        datasets: buildDataset(labels, label, src_data)
    };

    drawPieChart(canvas_id, title, data);
}

/**
 * Adds a row to the table
 * @param {String} table_id The id of the table
 * @param {String[]} values The values to add
 * @returns {undefined}
 */
function addRow(table_id, values) {
    const table = document.getElementById(table_id);
    const row = table.insertRow(-1);

    values.forEach(function (value) {
        const col = row.insertCell(-1);
        col.innerHTML = value;
    });
}

/**
 * Renders pie chart of sessions by track
 * @returns {undefined}
 */
function renderByTrack() {
    generatePieChart('chart-by-track', 'Sessions by track', 'Sessions', by_track);
}

/**
 * Renders pie chart of chosen sessions by track
 * @returns {undefined}
 */
function renderByTrackChosen() {
    generatePieChart('chart-by-track-chosen', 'Sessions selected by track', 'Sessions', chosen_by_track);
}

/**
 * Generates the track data table
 * @returns {undefined}
 */
function generateTrackTable() {
    let total = 0;
    for (const key in by_track) {
        total += by_track[key];
    }

    for (const key in by_track) {
        const value = by_track[key];
        addRow('table-by-track', [ key, value, `${Math.round(value / total * 100)}%` ]);
    }
}

/**
 * Renders line chart of sessions by time
 * @returns {undefined}
 */
function renderByDate() {
    const data = {
        labels: [],
        datasets: [
            {
                label: 'Sessions',
                data: [],
                pointStyle: false
            }
        ]
    };

    for (const key in submission_dates) {
        data.labels.push(key);
        data.datasets[0].data.push(submission_dates[key]);
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sessions by date'
                }
            }
        }
    };

    const ctx = document.getElementById('chart-by-date');
    new Chart(ctx, config);
}

/**
 * Renders a chart of gender statistics
 * @returns {undefined}
 */
function renderByGender() {
    generatePieChart('chart-by-gender', 'Speakers by gender', 'Speakers', speaker_gender);
}

/**
 * Renders a chart of race statistics
 * @returns {undefined}
 */
function renderByRace() {
    generatePieChart('chart-by-race', 'Speakers by race', 'Speakers', speaker_race);
}

/**
 * Renders a chart of LGBTQAI statistics
 * @returns {undefined}
 */
function renderByLGBTQAI() {
    generatePieChart('chart-by-lgbtqai', 'Speakers by LGBTQAI+', 'Speakers', speaker_lgbtqai);
}

/**
 * Renders a chart of disability statistics
 * @returns {undefined}
 */
function renderByDisability() {
    generatePieChart('chart-by-disability', 'Speakers by disability', 'Speakers', speaker_disability);
}

/**
 * Renders all charts
 * @returns {undefined}
 */
function renderAllCharts() {
    renderByTrack();
    generateTrackTable();
    renderByTrackChosen();
    renderByDate();
    renderByGender();
    renderByRace();
    renderByLGBTQAI();
    renderByDisability();
}

document.addEventListener('DOMContentLoaded', renderAllCharts);