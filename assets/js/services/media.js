'use strict';

// Service Media
(function (app, config) {
    app.media = {

        upload: function (file) {
            return fetch(config.api.url + 'media', {
                method: 'POST',
                body: file,
                headers: {
                    'Content-Disposition': 'attachment; filename="avatar.png"',
                },
            });
        },

    };
})(
    application.services,
    application.config
);