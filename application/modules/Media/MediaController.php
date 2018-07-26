<?php

namespace Modules\Media;

use Modules\Login\LoginModel;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class MediaController
{

    /**
     * MediaController constructor.
     */
    public function __construct()
    {
    }

    public function upload()
    {
        return function (ServerRequestInterface $request, ResponseInterface $response) {

            // upload
            $message = (new MediaModel($this->db))->uploadImage($_FILES['userfile']);
            return $response->withJson($message->jsonSerialize());
        };
    }

}