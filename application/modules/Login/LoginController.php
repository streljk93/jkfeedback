<?php

namespace Modules\Login;

use Modules\User\UserModel;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class LoginController {

    public function signinView()
    {
        return function (Request $request, Response $response) {
            return $this->view->render($response, 'Login/signin.twig');
        };
    }

    public function signupView()
    {
        return function (Request $request, Response $response) {
            return $this->view->render($response, 'Login/signup.twig');
        };
    }

    public function signinAjax()
    {
        return function (Request $request, Response $response) {
            $data = $request->getParsedBody();

            return $response->withJson([
                'success' => true,
            ]);
        };
    }

    public function signupAjax()
    {
        return function (Request $request, Response $response) {

            // make
            $message = (new UserModel($request->getAttribute('db')))
                ->setUser($request->getParsedBody())
                ->validate()
                ->createUser();

            return $response->withJson($message->jsonSerialize());
        };
    }

}