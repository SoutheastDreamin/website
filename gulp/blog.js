const gulp = require('gulp');
const fs = require('fs');
const stream = require('stream');
const path = require('path');
const jsonfile = require('jsonfile');
const moment = require('moment');
const vinyl = require('vinyl');
const nunjucks = require('nunjucks');

const constants = require('./constants');

/**
 * Gets all the blog posts
 * @returns {Promise} A promise for all the blog posts
 */
function find_blog_posts() {
    return new Promise(function (resolve, reject) {
        const blog_posts = [];
        const readdir_opts = {
            withFileTypes: true
        };

        fs.readdir(constants.getBlogDir(), readdir_opts, function (error, files) {
            if (error) {
                reject(error);
            } else {
                files.forEach(function (file) {
                    if (
                        !file.isDirectory() &&
                        file.name.endsWith('.html')
                    ) {
                        blog_posts.push(file.name);
                    }
                });

                resolve(blog_posts);
            }
        });
    });
}

/**
 * Reads the blog metadata
 * @param {string} file_name The blog file name
 * @returns {Promise} A promise for the metadata
 */
function readMetadata(file_name) {
    return new Promise(function (resolve, reject) {
        const file_path = path.parse(file_name);
        const metadata_path = {
            dir: constants.getBlogDir(),
            name: file_path.name,
            ext: '.json'
        };
        const metadata_file = path.format(metadata_path);
        jsonfile.readFile(metadata_file)
            .then(resolve)
            .catch(reject);
    });
}

/**
 * Handles an individual blog post
 * @param {object} read_this The this from the stream read
 * @param {string} file_name The filename
 * @returns {Promise} A promise for when the blog post has been added
 */
function handlePost(read_this, file_name) {
    return new Promise(function (resolve, reject) {
        readMetadata(file_name)
            .then(function (metadata) {
                return new Promise(function (inner_resolve) {
                    nunjucks.configure(constants.getNunjucksConfig().path);

                    const date_m = moment(metadata.date);
                    const filename = path.join(
                        constants.BLOG,
                        date_m.format('YYYY'),
                        date_m.format('MM'),
                        date_m.format('DD'),
                        metadata.name,
                        'index.html'
                    );

                    const data = {
                        post: metadata
                    };

                    data.post.content = fs.readFileSync(path.join(constants.getBlogDir(), file_name));

                    read_this.push(new vinyl({
                        path: filename,
                        contents: Buffer.from(
                            nunjucks.render(
                                constants.getBlogTemplate(),
                                data
                            )
                        )
                    }));

                    inner_resolve();
                });
            })
            .then(resolve)
            .catch(reject);
    });
}

/**
 * Handles an individual blog post script
 * @param {object} read_this The this from the stream read
 * @param {string} file_name The filename
 * @returns {Promise} A promise for when the blog post has been added
 */
function handleScript(read_this, file_name) {
    return new Promise(function (resolve, reject) {
        readMetadata(file_name)
            .then(function (metadata) {
                return new Promise(function (inner_resolve) {
                    const file_path = path.parse(file_name);
                    const script_path = {
                        dir: constants.getBlogDir(),
                        name: file_path.name,
                        ext: '.js'
                    };
                    const script_file = path.format(script_path);

                    if (fs.existsSync(script_file)) {
                        const script_content = fs.readFileSync(script_file);

                        const date_m = moment(metadata.date);
                        const filename = path.join(
                            constants.BLOG,
                            date_m.format('YYYY'),
                            date_m.format('MM'),
                            date_m.format('DD'),
                            metadata.name,
                            'index.js'
                        );

                        read_this.push(new vinyl({
                            path: filename,
                            contents: script_content
                        }));
                    }

                    inner_resolve();
                });
            })
            .then(resolve)
            .catch(reject);
    });
}

/**
 * Handles all the blog posts
 * @param {object} read_this The this from the stream read
 * @param {string[]} file_names The blog post files
 * @returns {Promise} A promise for when the stream has been populated
 */
function handlePosts(read_this, file_names) {
    return new Promise(function (resolve, reject) {
        const handle_post_bound = handlePost.bind(null, read_this);
        const handle_script_bound = handleScript.bind(null, read_this);
        const promises = [];

        file_names.forEach(function (file) {
            promises.push(handle_post_bound(file));
            promises.push(handle_script_bound(file));
        });

        Promise.all(promises)
            .then(resolve)
            .catch(reject);
    });
}

/**
 * Generates a stream of blog posts
 * @returns {object} The stream
 */
function generate_posts() {
    const stream_opts = {
        objectMode: true
    };
    const src = stream.Readable(stream_opts);

    src._read = function () {
        const read_this = this;
        const handle_posts_bound = handlePosts.bind(null, read_this);

        find_blog_posts()
            .then(handle_posts_bound)
            .catch(console.error)
            .finally(function () {
                // Must be done or gulp will hang indefinitely
                read_this.push(null);
            });
    };

    return src;
}

/**
 * Takes the blog directory and generate blog posts
 * @returns {Promise} A promise for when the blogs have been generated
 */
function blogs() {
    return generate_posts()
        .pipe(gulp.dest(constants.getDistDir()));
}

/**
 * Watch for changes to blog files
 * @returns {undefined}
 */
function watch() {
    gulp.watch(constants.getBlogDir(), blogs);
}

module.exports = {
    default: blogs,
    watch: watch
};