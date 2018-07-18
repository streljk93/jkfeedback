var application = {
    controllers: {},
    services: {},
};
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
console.log(application);

// Sign in
(function (LoginService) {

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
            console.log(response);
        });
    };

})(application.services.login);

// Sign up
(function (application) {

    var signup = document.querySelector('#js-sign-up');
    if (!signup) return;

})(application.services);