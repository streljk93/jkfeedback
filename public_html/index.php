<?php
session_start();

use \Slim\App;

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