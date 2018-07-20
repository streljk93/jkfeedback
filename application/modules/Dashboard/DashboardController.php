<?php

namespace Modules\Dashboard;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class DashboardController {

    public function index()
    {
        return function (Request $request, Response $response) {
            $this->view->render($response, 'Dashboard/dashboard.twig');
        };
    }

}