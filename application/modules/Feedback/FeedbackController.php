<?php

namespace Modules\Feedback;

use Modules\Login\LoginModel;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class FeedbackController
{

    /**
     * FeedbackController constructor.
     */
    public function __construct()
    {
    }

    public function writingView()
    {
        return function (ServerRequestInterface $request, ResponseInterface $response) {
            $user = (new LoginModel($this->db))
                ->check()
                ->redirect('signin')
                ->getResult()
                ->jsonSerialize()['info'];

            $this->view->render($response, 'Feedback/writing.twig', [
                'user' => $user,
            ]);
        };
    }

    public function writingAjax()
    {
        return function (ServerRequestInterface $request, ResponseInterface $response) {
            $message = (new LoginModel($this->db))
                ->check()
                ->getResult()
                ->jsonSerialize();
            if (!$message['success']) $response->withJson($message);

            $data = $request->getParsedBody();
            $message = (new FeedbackModel($this->db))
                ->withMessage($data['message'])
                ->withRate($data['rate'])
                ->withRecaptcha($data['recaptcha'], $this->credentials)
                ->withUser($message['info'])
                ->create();

            return $response->withJson($message->jsonSerialize());
        };
    }
    
}