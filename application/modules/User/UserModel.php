<?php

namespace Modules\User;

use Modules\Common\EncryptionModel;
use Modules\Common\ResultModel;

class UserModel
{

    private $connect = null;

    private $result = null;

    private $crypt = null;

    private $username;

    private $email;

    private $phone;

    private $password;

    /**
     * UserModel constructor.
     */
    public function __construct($connect)
    {
        $this->connect = $connect;
        $this->result = new ResultModel();
        $this->crypt = new EncryptionModel();
    }

    public function setUser($data)
    {
        $this->username = htmlspecialchars(addslashes($data['username'])) ?? '';
        $this->email = htmlspecialchars(addslashes($data['email'])) ?? '';
        $this->phone = htmlspecialchars(addslashes($data['phone'])) ?? null;
        $this->password = htmlspecialchars(addslashes($data['password'])) ?? '';

        return $this;
    }

    public function validate()
    {
        $this->validateUsername() || $this->result->setError('Username already exists!');
        $this->validateEmail() || $this->result->setError('Email already exists!');
        $this->validatePhone() || $this->result->setError('Number Phone is wrong!');
        $this->validatePassword() || $this->result->setError('Low secure of password! Password must be at least 8 letter.');
        return $this;
    }

    private function validateUsername()
    {
        $result = $this->connect->query("
            SELECT *
            FROM `user`
            WHERE `username` = '{$this->crypt->encrypt($this->username)}'
        ", \PDO::FETCH_ASSOC);

        return count($result->fetchAll()) === 0;
    }

    private function validateEmail()
    {
        $result = $this->connect->query("
            SELECT *
            FROM `user`
            WHERE `email` = '{$this->crypt->encrypt($this->email)}'
        ", \PDO::FETCH_ASSOC);

        return count($result->fetchAll()) === 0;
    }

    private function validatePhone()
    {
        return true;
    }

    private function validatePassword()
    {
        return strlen($this->password) >= 8;
    }

    public function createUser()
    {
        if ($this->result->hasErrors()) return $this->result;

        $statement = $this->connect->prepare("
            INSERT INTO `user` (username, email, phone, password)
            VALUES (?, ?, ?, ?)
        ");
        $statement->bindParam(1, $this->crypt->encrypt($this->username));
        $statement->bindParam(2, $this->crypt->encrypt($this->email));
        $statement->bindParam(3, $this->crypt->encrypt($this->phone));
        $statement->bindParam(4, $this->crypt->encrypt($this->password));
        $statement->execute();
        if ($statement->rowCount() > 0) {
            $this->result->setSuccess(true);
            return $this->result;
        }
        $this->result->setSuccess(false);
        return $this->result;
    }

}