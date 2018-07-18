<?php

namespace Application\Database;

class DatabaseController {

    private static $db = null;

    private function __construct() {}

    public static function connect()
    {
        if (isset(self::$db)) {
            return self::$db;
        }

        self::$db = new \mysqli('localhost', 'root', '13771993', 'jkfeedback');
        return self::$db;
    }

}