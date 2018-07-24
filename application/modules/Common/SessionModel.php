<?php

namespace Modules\Common;

class SessionModel
{

    private $crypt = null;

    /**
     * SessionModel constructor.
     */
    public function __construct()
    {
        $this->crypt = new EncryptionModel();
    }

    public function get($name)
    {
        return json_decode($this->crypt->decrypt($_SESSION[$name]), true);
    }

    public function set($name, $value)
    {
        $_SESSION[$name] = $this->crypt->encrypt(json_encode($value));
    }

    public function delete($name)
    {
        unset($_SESSION[$name]);
    }

}