const jQuery = require('jquery');
const moment = require('moment');

const SIZE_CLASSES = new Map([
    [ 'small', 'is-small' ],
    [ 'medium', 'is-medium' ],
    [ 'large', 'is-large' ]
]);

const COLOR_CLASSES = new Map([
    [ 'dark', 'is-dark' ],
    [ 'primary', 'is-primary' ],
    [ 'link', 'is-link' ],
    [ 'info', 'is-info' ],
    [ 'success', 'is-success' ],
    [ 'warning', 'is-warning' ],
    [ 'danger', 'is-danger' ]
]);

const HEADER_CLASSES = new Map([]);

/**
 * Loads the banners and displays them
 * @returns {undefined}
 */
function loadBanners() {
    let banners = [];
    //let banner = '<article class="message is-small"><div class="message-header"><p>Hello World</p><button class="delete is-small" aria-label="delete"></button></div><div class="message-body">This is a test message</div></article>';

    jQuery.getJSON('/static/banner.json', function (data) {
        data.data.forEach(function (item) {
            if (!moment().isBetween(item.start, item.end, undefined, '[]')) {
                return;
            }

            let currentPath = window.location.pathname;

            if (item.exclude) {
                for (let i = 0; i < item.exclude.length; i += 1) {
                    let re = new RegExp(item.exclude[i]);
                    if (re.test(currentPath)) {
                        return;
                    }
                }
            }

            if (item.include) {
                let pathFound = false;

                for (let i = 0; i < item.include.length; i += 1) {
                    let re = new RegExp(item.include[i]);
                    if (re.test(currentPath)) {
                        pathFound = true;
                    }
                }

                if (!pathFound) {
                    return;
                }
            }

            let sizeClass = SIZE_CLASSES.has(item.size) ? SIZE_CLASSES.get(item.size) : '';
            let colorClass = COLOR_CLASSES.has(item.level) ? COLOR_CLASSES.get(item.level) : '';
            let headerClass = HEADER_CLASSES.has(item.size) ? HEADER_CLASSES.get(item.size) : 'm-0';

            let banner = [
                `<article class="message ${sizeClass} ${colorClass}" id="${item.id}">`
            ];

            if (item.title) {
                banner.push('<div class="message-header">');
                banner.push(`<p class="${headerClass}">${item.title}</p>`);

                if (!item.sticky) {
                    banner.push(`<button class="delete ${sizeClass}" aria-label="delete"></button>`);
                }

                banner.push('</div>');
            }

            banner.push(`<div class="message-body">${item.content}</div>`);
            banner.push('</article>');

            banners.push(banner.join(''));
        });

        jQuery('.content:first').prepend(banners.join(''));
    });
}

jQuery(document).ready(function () {
    jQuery('.navbar-burger').click(function () {
        jQuery('.navbar-burger').toggleClass('is-active');
        jQuery('.navbar-menu').toggleClass('is-active');
    });

    loadBanners();
});

document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    /**
     * Opens the modal
     * @param {Object} $el The target
     * @returns {undefined}
     */
    function openModal($el) {
        $el.classList.add('is-active');
    }

    /**
     * Closes the modal
     * @param {Object} $el The target
     * @returns {undefined}
     */
    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });
});