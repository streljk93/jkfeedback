<?php

namespace Modules\Common;

use phpseclib\Crypt\AES;

class EncryptionModel
{

    private $crypt = null;

    /**
     * EncryptionModel constructor.
     */
    public function __construct()
    {
        $this->crypt = new AES();
        $this->crypt->setKey('kdjas23423khkadsf2348sdfajafjdasdf');
    }

    public function encrypt($text)
    {
        return \bin2hex($this->crypt->encrypt($text));
    }

    public function decrypt($text)
    {
        return \hex2bin($this->crypt->decrypt($text));
    }
    
}