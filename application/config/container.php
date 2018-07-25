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

$container['db'] = function ($container) {
    $db = $container['settings']['db'];
    $pdo =  new \PDO(
        "{$db['driver']}:host={$db['host']};dbname={$db['dbname']};",
        $db['user'],
        $db['password']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

$container['credentials'] = function ($container) {
    return $container['settings']['credentials'];
};
