'use strict';

// application
(function (global) {

    global.application = {
        controllers: {},
        services: {},
        config: {},
    };

})(window);


'use strict';

// config
(function () {

    window.application.config = {
        base: {
            url: location.origin + '/',
        },
        api: {
            url: location.origin + '/api/v1/',
        },
    };

})();

'use strict';

// Service Feedback
(function (app, config) {
    window.application.services.feedback = {

        write: function (data) {
            return fetch(config.api.url + 'feedback', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
        },

    };
})(
    application.services,
    application.config
);
'use strict';

// Service Login
(function (config) {
    window.application.services.login = {

        signin: function (data) {
            return fetch(config.api.url + 'signin', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            });
        },

        signup: function (data) {
            return fetch(config.api.url + 'signup', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            });
        },

    };
})(application.config);

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
'use strict';

// Sign in
(function (config, LoginService) {

    var signin = document.querySelector('#js-sign-in');
    if (!signin) return;

    // onsubmit
    var form = signin.querySelector('form');
    form.onsubmit = function (event) {
        event.preventDefault();

        LoginService.signin({
            username: form.querySelector('input[name=email]').value,
            password: form.querySelector('input[name=password]').value,
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data.success) {
                $('#js-message-success').dimmer('show');
                setTimeout(function () {
                    $('#js-message-success').dimmer('hide');
                    location = config.base.url;
                }, 2000);
            } else {
                $('#js-message-errors').dimmer('show');

                // output errors
                var errors = '<ul>';
                data.errors.map(function (error) {
                    errors += '<li>' + error + '</li>';
                });
                errors += '</ul>';
                signin.querySelector('#js-message-errors').querySelector('.sub.header').innerHTML = errors;
            }
        });
    };

})(
    application.config,
    application.services.login
);

// Sign up
(function (config, LoginService) {
    var signup = document.querySelector('#js-sign-up');
    if (!signup) return;

    // vars
    var form = signup.querySelector('form');
    var username = signup.querySelector('input[name=username]');
    var email = signup.querySelector('input[name=email]');
    var phone = signup.querySelector('input[name=phone]');
    var password = signup.querySelector('input[name=password]');
    var passwordRepeat = signup.querySelector('input[name=password-repeat]');
    var submit = signup.querySelector('button[type=submit]');
    var data = {
        username: '',
        email: '',
        phone: '',
        password: '',
        passwordRepeat: '',
    };
    $('input[name=phone]').mask('(000) 000-00-00');

    // initialize vars
    submit.disabled = true;
    var activateSubmit = function () {
        if (errors.length > 0) submit.disabled = true;
        else submit.disabled = false;
    };
    var errors = ['username', 'email', 'password', 'password-repeat'];
    var deleteError = function (error) {
        var input = signup.querySelector('input[name=' + error + ']');
        if (input) input.nextElementSibling.classList.add('hidden');
        errors.forEach(function (er) {
            if (er === error)
                errors.splice(errors.indexOf(error), 1);
        });
    };
    var setError = function (error) {
        var input = signup.querySelector('input[name=' + error + ']');
        var input = signup.querySelector('input[name=' + error + ']');
        if (input) input.nextElementSibling.classList.remove('hidden');

        errors.forEach(function (er) {
            if (er === error)
                errors.splice(errors.indexOf(error), 1);
        });
        errors.push(error);
    };

    // validate username
    username.oninput = function (action) {
        action.preventDefault();

        var value = action.target.value;

        if (value.length > 0) deleteError('username');
        else setError('username');

        data['username'] = value;
        activateSubmit();
    };

    email.oninput = function (action) {
        action.preventDefault();

        var value = action.target.value;
        var errorMessage = action.target.nextElementSibling;
        var template = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!template.test(String(value).toLowerCase())) setError('email');
        else deleteError('email');

        data['email'] = value;
        activateSubmit();
    };

    // validate phone
    phone.oninput = function (action) {
        action.preventDefault();

        var value = action.target.value;

        if (value.length > 0) {
            if (value.length === 15) {
                deleteError('phone');
            } else {
                setError('phone');
            }
        } else {
            deleteError('phone');
        }

        data['phone'] = value;
        activateSubmit();
    };

    // validate password
    password.addEventListener('input', function (action) {
        action.preventDefault();

        var errorMessage = action.target.nextElementSibling;
        var value = action.target.value;

        if (value.length < 8) setError('password');
        else deleteError('password');

        if (value !== data['passwordRepeat']) setError('password-repeat');
        else deleteError('password-repeat');

        data['password'] = value;
        activateSubmit();
    });
    passwordRepeat.addEventListener('input', function (event) {
        event.preventDefault();

        var errorMessage = event.target.nextElementSibling;
        var value = event.target.value;

        if (value !== data['password']) setError('password-repeat');
        else deleteError('password-repeat');

        data['passwordRepeat'] = value;
        activateSubmit();
    });

    // send form
    form.onsubmit = function (event) {
        event.preventDefault();

        submit.disabled = true;
        LoginService.signup(data).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data.success) {
                $('#js-message-success').dimmer('show');
                setTimeout(function () {
                    $('#js-message-success').dimmer('hide');
                    location = config.base.url + 'signin';
                }, 2000);
            } else {
                submit.disabled = false;
                $('#js-message-errors').dimmer('show');

                // output errors
                var errors = '<ul>';
                data.errors.map(function (error) {
                    errors += '<li>' + error + '</li>';
                });
                errors += '</ul>';
                signup.querySelector('#js-message-errors').querySelector('.sub.header').innerHTML = errors;
            }
        }).catch(function (error) {
            submit.disabled = false;
            $('#js-message-error').dimmer('show');
        });
    };

})(
    application.config,
    application.services.login
);