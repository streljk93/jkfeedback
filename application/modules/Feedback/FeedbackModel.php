<?php

namespace Modules\Feedback;

use GuzzleHttp\Client;
use Modules\Common\EncryptionModel;
use Modules\Common\ResultModel;

class FeedbackModel
{

    private $connect = null;

    private $crypt = null;

    private $result = null;

    private $message = null;

    private $rate = null;

    private $user = null;

    /**
     * FeedbackModel constructor.
     */
    public function __construct($connect)
    {
        $this->connect = $connect;
        $this->crypt = new EncryptionModel();
        $this->result = new ResultModel();
    }

    public function withMessage($message)
    {
        $this->message = htmlspecialchars(addslashes($message));
        return clone $this;
    }

    public function withRate($rate)
    {
        $this->rate = htmlspecialchars(addslashes($rate));
        return clone $this;
    }

    public function withRecaptcha($recaptcha, $credentials)
    {
        $response = (new Client())->request(
            'POST',
            $credentials['recaptcha']['url'] . "?secret={$credentials['recaptcha']['secretkey']}&response={$recaptcha}"
        );
        $data = $response->getBody();
        $data = json_decode($data, true);

        if (!$data['success']) {
            $this->result->setSuccess(false);
            $this->result->setError('Captcha is wrong!');
        } else {
            $this->result->setSuccess(true);
        }

        $this->result->setSuccess(true);

        return clone $this;
    }

    public function withUser($user)
    {
        $this->user = $user;
        return clone $this;
    }

    public function create()
    {
        if (!$this->result->isSuccess()) return $this->result;

        $statement = $this->connect->prepare("
            INSERT INTO `feedback` (user_id, message, rate)
            VALUES (?, ?, ?)
        ");
        $statement->bindParam(1, $this->user['id']);
        $statement->bindParam(2, $this->message);
        $statement->bindParam(3, $this->rate);
        $statement->execute();

        if ($statement->rowCount() > 0) {
            $this->result->setSuccess(true);
            return $this->result;
        }

        $this->result->setSuccess(false);
        $this->result->setError('Server error!');
        return $this->result;

    }

    public function getAll()
    {
        $query = $this->connect->query("
            SELECT `user`.`username`, `user`.`avatar`, `feedback`.`message`, `feedback`.`rate`
            FROM `feedback`
            JOIN `user` ON `user`.`id` = `feedback`.`user_id`
            WHERE `user`.`isactive` = 1
            AND `feedback`.`isactive` = 1
        ");

        $result = $query->fetchAll();

        if (count($result) > 0) {
            $feedbacks = [];
            foreach ($result as $feedback) {
                $feedbacks[] = $this->makeFeedback($feedback);
            }
            $this->result->setInfo($feedbacks);
        }
        else $this->result->setInfo([]);
        $this->result->setSuccess(true);

        return $this->result;
    }

    private function makeFeedback($feedback)
    {
        return [
            'avatar' => $feedback['avatar'],
            'username' => $this->crypt->decrypt($feedback['username']),
            'message' => $feedback['message'],
            'rate' => $feedback['rate'],
        ];
    }

}