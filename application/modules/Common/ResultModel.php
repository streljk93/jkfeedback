<?php

namespace Modules\Common;

class ResultModel
{

    private $info = [];

    private $success = false;

    private $errors = [];

    public function getInfo()
    {
        return $this->info;
    }

    public function setInfo($info)
    {
        $this->info = $info;
    }

    public function isSuccess()
    {
        return $this->success;
    }

    public function setSuccess($success)
    {
        if ($success) $this->errors = [];
        $this->success = $success;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function hasErrors()
    {
        return count($this->errors) > 0;
    }

    public function setError($error)
    {
        $this->errors[] = $error;
    }

    public function jsonSerialize()
    {
        $vars = get_object_vars($this);
        return $vars;
    }

}