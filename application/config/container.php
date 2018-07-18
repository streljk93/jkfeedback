<?php

use \Slim\Container;
use \Slim\Views\Twig;
use \Slim\Views\TwigExtension;

/** @var \Slim\App $app */
$container = $app->getContainer();

// Activating routes in a subfolder
$container['environment'] = function () {
    // $scriptName = $_SERVER['SCRIPT_NAME'];
    // $_SERVER['SCRIPT_NAME'] = dirname(dirname($scriptName)) . '/' . basename($scriptName);
    return new Slim\Http\Environment($_SERVER);
};

// View
$container['view'] = function ($container) {
    $view = new Twig([
        __DIR__ . '/../modules',
        __DIR__ . '/../layouts',
    ], [
        'cache' => false,
    ]);

    $view->addExtension(new TwigExtension(
        $container['router'],
        $container['request']->getUri()
    ));

    return $view;
};