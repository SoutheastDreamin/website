const jQuery = require('jquery');

jQuery(document).ready(function () {
    jQuery('.navbar-burger').click(function () {
        jQuery('.navbar-burger').toggleClass('is-active');
        jQuery('.navbar-menu').toggleClass('is-active');
    });
});