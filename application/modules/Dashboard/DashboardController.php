<?php

namespace Modules\Dashboard;

use Modules\Feedback\FeedbackModel;
use Modules\Login\LoginModel;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class DashboardController {

    public function index()
    {
        return function (Request $request, Response $response) {
            // check login
            $user = (new LoginModel($this->db))
                ->check()
                ->redirect('signin')
                ->getResult()
                ->jsonSerialize()['info'];

            $feedbacks = (new FeedbackModel($this->db))->getAll()->getInfo();

            $this->view->render($response, 'Dashboard/dashboard.twig', [
                'feedbacks' => $feedbacks,
                'user' => $user,
            ]);
        };
    }

}