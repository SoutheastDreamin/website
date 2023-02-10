const jQuery = require('jquery');

jQuery(document).ready(function () {
    jQuery('.navbar-burger').click(function () {
        jQuery('.navbar-burger').toggleClass('is-active');
        jQuery('.navbar-menu').toggleClass('is-active');
    });
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