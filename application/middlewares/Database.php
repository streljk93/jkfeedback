<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

namespace Application\Middleware;

class Database {

    public function connect()
    {
        self::$db = new \mysqli('localhost', 'root', '13771993', 'jkfeedback');
        return self::$db;
    }

    public function __invoke(Request $request, Response $response, $next)
    {

    }

}