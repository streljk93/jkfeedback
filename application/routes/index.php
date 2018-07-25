<?php

// controllers
$login = new \Modules\Login\LoginController();
$dashboard = new \Modules\Dashboard\DashboardController();
$feedback = new \Modules\Feedback\FeedbackController();

// base routes
$app->get('/signin', $login->signinView());
$app->get('/signup', $login->signupView());
$app->get('/signout', $login->signout());
$app->get('/', $dashboard->index());
$app->get('/write-feedback', $feedback->writingView());

// Api routes
$app->post('/api/v1/signin', $login->signinAjax());
$app->post('/api/v1/signup', $login->signupAjax());
$app->post('/api/v1/feedback', $feedback->writingAjax());

