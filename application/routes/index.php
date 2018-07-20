<?php

$login = new \Modules\Login\LoginController();
$dashboard = new \Modules\Dashboard\DashboardController();

// Main routes
$app->get('/signin', $login->signin());
$app->get('/signup', $login->signup());
$app->get('/', $dashboard->index());

// Api routes
$app->post('/api/v1/signin', $login->loginAjax());