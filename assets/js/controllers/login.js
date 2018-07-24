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
(function (LoginService) {

    // vars
    var signup = document.querySelector('#js-sign-up');
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

    if (!signup) return;

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

        LoginService.signup(data).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log(json);
        });
    };

})(application.services.login);