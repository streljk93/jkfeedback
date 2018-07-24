<?php

namespace Middlewares;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class Database {

    public function connect()
    {
        return new \PDO('mysql:host=localhost;dbname=jkfeedback;', 'root', '13771993');
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, $next)
    {
        $db = $this->connect();
        $request = $request->withAttribute('db', $db);
        return $next($request, $response);
    }

}