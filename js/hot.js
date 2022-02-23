const jQuery = require('jquery');
require('form-serializer');
const lodash = require('lodash');

const url = 'https://script.google.com/macros/s/AKfycbycKt7GU8eMqjFX-dw-zyL8rFbSi6TmYY4qZG8uRn4jc5Seu4uNeY_U0c70cHkCHfjB/exec';
const hidden = 'is-hidden';
const danger = 'is-danger';
const loading = 'is-loading';
const disabled = 'disabled';

const $form = jQuery('form#hot');
const $fieldset = jQuery('#hot_fieldset');
const $submit = jQuery('#submit');

const required_text_fields = [
    'first_name',
    'last_name',
    'email',
    'session_title',
    'session_abstract',
    'speaker_info'
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