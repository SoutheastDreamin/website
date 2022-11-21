const config = require('config');
const path = require('path');
const lodash = require('lodash');

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
const SESSIONS = config.has('build.sessions') ? config.get('build.sessions') : 'html/pages/sessions';
const SESSION_TEMPLATE = config.has('build.session_template') ? config.get('build.session_template') : 'html/templates/session.html';
const SPONSOR = config.has('build.sponsor') ? config.get('build.sponsor') : 'html/pages/sponsors';
const SPONSOR_TEMPLATE = config.has('build.sponsor_template') ? config.get('build.sponsor_template') : 'html/templates/sponsor.html';
const BLOG = config.has('build.blog') ? config.get('build.blog') : 'blog';
const BLOG_TEMPLATE = config.has('build.blog_template') ? config.get('build.blog_template') : 'html/templates/blog.html';

/**
 * Gets the dist directory
 * @returns {String} The dist directory path
 */
function getDistDir() {
    return path.join(__dirname, '..', ROOT);
}

/**
 * Gets the sessions directory
 * @returns {String} The sessions directory path
 */
function getSessionsDir() {
    return path.join(__dirname, '..', SESSIONS);
}

/**
 * Gets the session template path
 * @returns {String} The path to the session template
 */
function getSessionTemplate() {
    return path.join(__dirname, '..', SESSION_TEMPLATE);
}

/**
 * Gets the sponsor directory
 * @returns {String} The sponsor directory path
 */
function getSponsorDir() {
    return path.join(__dirname, '..', SPONSOR);
}

/**
 * Gets the sponsor template path
 * @returns {String} The path to the sponsor template
 */
function getSponsorTemplate() {
    return path.join(__dirname, '..', SPONSOR_TEMPLATE);
}

/**
 * Gets the blog directory
 * @returns {String} The blog directory path
 */
function getBlogDir() {
    return path.join(__dirname, '..', BLOG);
}

/**
 * Gets the blog template path
 * @returns {String} The path to the blog template
 */
function getBlogTemplate() {
    return path.join(__dirname, '..', BLOG_TEMPLATE);
}

/**
 * A where filter for nunjucks
 * @param {Object} obj The object
 * @param {String} selector The selector
 * @param {String} match The match
 * @returns {Boolean} If the selector returns the match
 */
function filter_where(obj, selector, match) {
    const filter = {
        [selector]: match
    };
    return lodash.filter(obj, filter);
}

/**
 * Sets up custom filters in nunjucks
 * @param {Object} environment The nunjucks environment
 * @returns {undefined}
 */
const manageEnvironment = function (environment) {
    const merge = lodash.merge.bind(null, {});

    environment.addFilter('map', lodash.map);
    environment.addFilter('uniq', lodash.uniq);
    environment.addFilter('where', filter_where);
    environment.addGlobal('concat', lodash.concat);
    environment.addGlobal('merge', merge);
};

/**
 * Gets the Nunjucks config
 * @returns {Object} The Nunjucks config
 */
function getNunjucksConfig() {
    return {
        path: [
            path.join(__dirname, '..', HTML, TEMPLATES)
        ],
        manageEnv: manageEnvironment
    };
}

module.exports = {
    getDistDir: getDistDir,
    getSessionsDir: getSessionsDir,
    getNunjucksConfig: getNunjucksConfig,
    getSessionTemplate: getSessionTemplate,
    getSponsorDir: getSponsorDir,
    getSponsorTemplate: getSponsorTemplate,
    getBlogDir: getBlogDir,
    getBlogTemplate: getBlogTemplate,
    BLOG: BLOG,
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