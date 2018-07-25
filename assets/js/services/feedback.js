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