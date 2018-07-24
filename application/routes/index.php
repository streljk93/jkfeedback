<?php

$login = new \Modules\Login\LoginController();
$dashboard = new \Modules\Dashboard\DashboardController();

// Main routes
$app->get('/signin', $login->signinView());
$app->get('/signup', $login->signupView());
$app->get('/', $dashboard->index());

// Api routes
$app->post('/api/v1/signin', $login->signinAjax());
$app->post('/api/v1/signup', $login->signupAjax());

