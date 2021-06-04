const config = require('config');
const gulp_connect = require('gulp-connect');

const constants = require('./constants');
const css = require('./css');
const html = require('./html');
const img = require('./img');
const js = require('./js');
const pub = require('./public');
const sass = require('./sass');

/**
 * Watches for changes and serves them out to port 9000
 * @returns {undefined}
 */
function watch() {
    css.watch();
    html.watch();
    img.watch();
    js.watch();
    pub.watch();
    sass.watch();

    const server_config = {
        root: constants.getDistDir(),
        host: config.get('server.host'),
        port: config.get('server.port'),
        livereload: config.get('server.livereload')
    };

    gulp_connect.server(server_config);
}

module.exports = watch;