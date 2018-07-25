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
