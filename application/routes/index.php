<?php

// HTTP
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

// Controllers
use \Application\Modules\Login\LoginController;

$login = new LoginController();

$app->get('/index', $login->index());