const jQuery = require('jquery');
require('form-serializer');
const lodash = require('lodash');

const url = 'https://script.google.com/macros/s/AKfycby_BTxGVFxm8C5XC5SReDGJcPpOa_jD-q-L-5T_K-xlw3-HUpfIXukGn4jhWjZoB7N44w/exec';
const hidden = 'is-hidden';
const danger = 'is-danger';
const loading = 'is-loading';
const disabled = 'disabled';

const $form = jQuery('form#cfp');
const $fieldset = jQuery('#cfp_fieldset');
const $submit = jQuery('#submit');

const required_text_fields = [
    'first_name',
    'last_name',
    'email',
    'session_title',
    'session_abstract'
];

const required_select_fields = [
    'track',
    'length'
];

/**
 * Checks to see if an email is valid
 * @param {String} elementValue The email to validate
 * @returns {Boolean} If the email is valid
 */
function validateEmail(elementValue) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue);
}

$submit.on('click', function (e) {
    let ready = true;
    const formValues = $form.serializeObject();

    $fieldset.attr(disabled, true);
    $submit.addClass(loading);
    e.preventDefault();

    required_text_fields.forEach(function (id) {
        const $field = jQuery(`#${id}`);
        $field.removeClass(danger);

        const trim_val = lodash.trim($field.val());
        const isEmpty = lodash.isEmpty(trim_val);
        const isEmail = id === 'email';
        let invalid = isEmpty;

        if (isEmail && !validateEmail(trim_val)) {
            invalid = true;
        }

        if (invalid) {
            ready = false;
            $field.addClass(danger);
        }
    });

    required_select_fields.forEach(function (id) {
        const $field = jQuery(`#${id}`);
        $field.parent().removeClass(danger);

        if (lodash.isEmpty(lodash.trim($field.val()))) {
            ready = false;
            $field.parent().addClass(danger);
        }
    });

    if (!ready) {
        $fieldset.attr(disabled, false);
        $submit.removeClass(loading);
    } else {
        jQuery.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            data: formValues
        }).done(function () {
            $form.addClass(hidden);
            jQuery('#submitted').removeClass(hidden);
        });
    }
});