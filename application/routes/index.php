<?php

// Controllers
use \Application\Login\LoginController;

$login = new LoginController();

// Main routes
$app->get('/signin', $login->signin());
$app->get('/signup', $login->signup());

// Api routes
$app->post('/api/v1/signin', $login->loginAjax());