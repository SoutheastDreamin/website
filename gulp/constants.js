const config = require('config');
const path = require('path');

const CSS = config.has('build.css') ? config.get('build.css') : 'css';
const FONT = config.has('build.font') ? config.get('build.font') : 'webfonts';
const HTML = config.has('build.html') ? config.get('build.html') : 'html';
const IMG = config.has('build.img') ? config.get('build.img') : 'img';
const JS = config.has('build.js') ? config.get('build.js') : 'js';
const PAGES = config.has('build.pages') ? config.get('build.pages') : 'pages';
const PUB = config.has('build.public') ? config.get('build.public') : 'public';
const ROOT = config.has('build.dist') ? config.get('build.dist') : 'dist';
const SASS = config.has('build.sass') ? config.get('build.sass') : 'sass';
const TEMPLATES = config.has('build.templates') ? config.get('build.templates') : 'templates';

/**
 * Gets the dist directory
 * @returns {String} The dist directory path
 */
function getDistDir() {
    return path.join(__dirname, '..', ROOT);
}

module.exports = {
    getDistDir: getDistDir,
    CSS: CSS,
    FONT: FONT,
    HTML: HTML,
    IMG: IMG,
    JS: JS,
    PAGES: PAGES,
    PUB: PUB,
    ROOT: ROOT,
    SASS: SASS,
    SITE_URL: config.get('site.url'),
    TEMPLATES: TEMPLATES
};