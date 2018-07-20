<?php

namespace Modules\Login;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

// Models

class LoginController {

    public function signin()
    {
        return function (Request $request, Response $response) {
            return $this->view->render($response, 'Login/signin.twig');
        };
    }

    public function signup()
    {
        return function (Request $request, Response $response) {
            return $this->view->render($response, 'Login/signup.twig');
        };
    }

    public function loginAjax()
    {
        return function (Request $request, Response $response) {
            $data = $request->getParsedBody();

            return $response->withJson([
                'success' => true,
            ]);
        };
    }

}