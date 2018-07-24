<?php

namespace Modules\Login;

class LoginModel {

    private $connect;

    /**
     * LoginModel constructor.
     */
    public function __construct($connect)
    {
        $this->connect = $connect;
    }

}