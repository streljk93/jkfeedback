<?php

use \Slim\App;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';

// APP
$settings = require __DIR__ . '/../application/config/settings.php';
$app = new App($settings);

// CONTAINER
require __DIR__ . '/../application/config/container.php';

// MIDDLEWARES
require __DIR__ . '/../application/middlewares/index.php';

// ROUTES
require __DIR__ . '/../application/routes/index.php';

$app->run();