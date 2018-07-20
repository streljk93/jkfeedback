<?php

namespace Middlewares;

class Database {

    public function connect()
    {
        $this->db = new \PDO('mysql:host=localhost;dbname=jkfeedback;', 'root', '13771993');
        return $this->db;
    }

    public function __invoke($request, $response, $next)
    {
        $this->connect();
        return $next($request, $response);
    }

}