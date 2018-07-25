<?php

namespace Modules\Login;

use Modules\Common\EncryptionModel;
use Modules\Common\ResultModel;
use Modules\Common\SessionModel;

class LoginModel {

    private $connect = null;

    private $result = null;

    private $crypt = null;

    private $session = null;

    private $username;

    private $password;

    /**
     * LoginModel constructor.
     */
    public function __construct($connect)
    {
        $this->connect = $connect;
        $this->result = new ResultModel();
        $this->crypt = new EncryptionModel();
        $this->session = new SessionModel();
    }

    public function withUsername($username)
    {
        $this->username = htmlspecialchars(addslashes($username));
        return clone $this;
    }

    public function withPassword($password)
    {
        $this->password = htmlspecialchars(addslashes($password));
        return clone $this;
    }

    public function signin()
    {
        $statement = $this->connect->prepare("
            SELECT *
            FROM `user`
            WHERE (`user`.`username` = ?
            OR `user`.`email` = ?)
            AND `user`.`password` = ?
        ");
        $statement->bindParam(1, $this->crypt->encrypt($this->username));
        $statement->bindParam(2, $this->crypt->encrypt($this->username));
        $statement->bindParam(3, $this->crypt->encrypt($this->password));
        $statement->execute();

        if ($user = $statement->fetch()) {
            $this->result->setInfo($this->makeUser($user));
            $this->result->setSuccess(true);
            $this->session->set('user', $this->makeUser($user));
        } else {
            $this->result->setError('Username or Password is wrong!');
        }

        return $this->result;
    }

    private function makeUser($data)
    {
        return [
            'id' => $data['id'],
            'username' => $this->crypt->decrypt($data['username']),
            'email' => $this->crypt->decrypt($data['email']),
            'phone' => $this->crypt->decrypt($data['phone']),
            'password' => $this->crypt->decrypt($data['password']),
            'isactive' => $data['isactive'],
            'lastupdated' => $data['lastupdated'],
        ];
    }

    public function check()
    {
        $user = $this->session->get('user');
        $this->withUsername($user['username'])
            ->withPassword($user['password'])
            ->signin();

        return $this;
    }

    public function redirect($to)
    {
        if (!$this->result->isSuccess()) {
            header("Location: {$to}");
            exit;
        }
        return $this;
    }

    public function getResult()
    {
        return $this->result;
    }

}