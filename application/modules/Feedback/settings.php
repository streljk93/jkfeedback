<?php
return [
    'settings' => [

        // Common
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // Renderer
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Database
        'db' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'dbname' => 'id6606212_jkfeedback',
            'user' => 'id6606212_root',
            'password' => '13771993',
        ],

        // Credentials
        'credentials' => [
            'recaptcha' => [
                'url' => 'https://www.google.com/recaptcha/api/siteverify',
                'openkey' => '6LfgRGYUAAAAAM_0AbtnPtio6mnTqBP0kz05q-Bl',
                'secretkey' => '',
            ],
        ],
    ],
];