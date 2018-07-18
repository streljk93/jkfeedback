application.services.login = {

    signin: function (data) {
        return fetch(location.origin + '/api/v1/signin', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },

};