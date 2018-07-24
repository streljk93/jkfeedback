<?php

namespace Modules\Dashboard;

use Modules\Login\LoginModel;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class DashboardController {

    public function index()
    {
        return function (Request $request, Response $response) {
            (new LoginModel($request->getAttribute('db')))
                ->check()
                ->redirect('signin');

            $this->view->render($response, 'Dashboard/dashboard.twig');
        };
    }

}