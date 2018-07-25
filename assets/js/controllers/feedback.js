'use strict';

// Controller Feedback - Writing
(function (RecaptchaService, FeedbackService, config) {
    var main = document.querySelector('#js-feedback-writing');
    if (!main) return;

    // vars
    var form = main.querySelector('form');
    var submit = form.querySelector('button[type=submit]');
    var checkbox = main.querySelectorAll('.ui.checkbox');
    var textarea = main.querySelector('textarea');
    var recaptcha = null;
    var data = {
        message: '',
        rate: 'good',
        recaptcha: '',
    };
    var errors = ['message', 'recaptcha'];
    var messageError = main.querySelector('#js-message-errors');
    var messageSuccess = main.querySelector('#js-message-success');

    // common functions
    var activateSubmit = function () {
        if (errors.length === 0) {
            submit.disabled = false;
        } else {
            submit.disabled = true;
        }
    };
    activateSubmit();
    var showErrorMessage = function (name) {
        var field = main.querySelector('#js-field-' + name);
        if (field) {
            var label = field.querySelector('.label');
            errors.map(function (error) {
                if (name === error) {
                    label.classList.remove('hidden');
                } else {
                    label.classList.add('hidden');
                }
            });
        }
    };
    var setError = function (name) {
        errors.map(function (error) {
            if (error === name) {
                errors.splice(errors.indexOf(name), 1);
            }
        });
        errors.push(name);
        showErrorMessage(name);
        activateSubmit();
    };
    var deleteError = function (name) {
        errors.map(function (error) {
            if (error === name) {
                errors.splice(errors.indexOf(name), 1);
            }
        });
        showErrorMessage(name);
        activateSubmit();
    };

    // actions
    // action textarea
    textarea.addEventListener('input', function (event) {
        event.preventDefault();

        var value = event.target.value;

        if (value.length > 0) deleteError('message');
        else setError('message');

        data.message = value;
    });

    // checkbox
    $(checkbox).checkbox({
        onChange: function () {
            data.rate = this.value;
        },
    });

    // recaptcha
    window.onloadRecaptcha = function () {
        RecaptchaService.render('g-recaptcha', {
            sitekey: '6LfgRGYUAAAAAM_0AbtnPtio6mnTqBP0kz05q-Bl',
            callback: function (text) {
                if (text) deleteError('recaptcha');
                data.recaptcha = text;
            },
        });
    };

    // form
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (errors.length > 0) return;

        FeedbackService.write(data).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data.success) {
                $(messageSuccess).dimmer('show');
                setTimeout(function () {
                    location = config.base.url;
                }, 2000);
            } else {
                $(messageError).dimmer('show');

                // output errors
                var errors = '<ul>';
                data.errors.map(function (error) {
                    errors += '<li>' + error + '</li>';
                });
                errors += '</ul>';
                messageError.querySelector('.sub.header').innerHTML = errors;
            }
        });
    });

})(
    window.grecaptcha,
    application.services.feedback,
    application.config
);