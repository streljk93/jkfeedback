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
(function (config, LoginService, MediaService) {
    var signup = document.querySelector('#js-sign-up');
    if (!signup) return;

    // vars
    var form = signup.querySelector('form');
    var modal = signup.querySelector('.ui.modal');
    var modalSave = modal.querySelector('#js-cropper-save');
    var modalCancel = modal.querySelector('#js-cropper-cancel');
    var upload = signup.querySelector('#js-upload-file');
    var cropper = null;
    var cropperImage = signup.querySelector('#js-cropper-image');
    var username = signup.querySelector('input[name=username]');
    var email = signup.querySelector('input[name=email]');
    var phone = signup.querySelector('input[name=phone]');
    var password = signup.querySelector('input[name=password]');
    var passwordRepeat = signup.querySelector('input[name=password-repeat]');
    var submit = signup.querySelector('button[type=submit]');
    var data = {
        avatar: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/user-male-icon.png',
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

    // actions
    // upload file
    upload.addEventListener('change', function (event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {

                var binary = e.target.result;
                cropperImage.src = binary;
                cropper = new Cropper(cropperImage, {
                    dragCrop: false,
                    autoCropArea: 0,
                    highlight: false,
                    zoomable: false,
                    checkCrossOrigin: false,
                    modal: true,
                    guides: true,
                    center: true,
                    background: true,
                    autoCrop: true,
                    cropBoxMovable: true,
                    aspectRatio: 1 / 1,
                });
                $(modal).modal('show');

            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // cropper save
    modalSave.addEventListener('click', function (event) {
        event.preventDefault();

        if (cropper.getCroppedCanvas()) {
            cropper.getCroppedCanvas().toBlob(function (blob) {
                var file = new File([blob], 'file');
                var formData = new FormData();
                formData.append('userfile', file)

                MediaService.upload(formData).then(function (response) {
                    return response.json();
                }).then(function (response) {
                    if (response.success) {
                        data.avatar = response.info;
                    }
                });
            });
        }
    });

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
    application.services.login,
    application.services.media
);