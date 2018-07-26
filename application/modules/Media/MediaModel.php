<?php

namespace Modules\Media;

use Modules\Common\ResultModel;

class MediaModel
{

    private $connect;

    private $result;

    /**
     * MediaModel constructor.
     */
    public function __construct($connect)
    {
        $this->connect = $connect;
        $this->result = new ResultModel();
    }

    public function uploadImage($file)
    {
        if (!isset($file['error']) || is_array($file['error'])) {
            $this->result->setError('Invalid params!');
        }

        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                $this->result->setError('No file sent');
                break;
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $this->result->setError('Exceeded filesize limit.');
                break;
            default:
                $this->result->setError('Unknow errors');
        }

        if ($file['size'] > 1000000) {
            $this->result->setError('Exceeded filesize limit');
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        if (false === $ext = array_search(
                $finfo->file($file['tmp_name']),
                array(
                    'jpg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                ),
                true
            )) {
            $this->result->setError('Invalid file format.');
        }

        $filename = sha1_file($file['tmp_name']) . '.' . $ext;
        if (!move_uploaded_file( $file['tmp_name'], sprintf('./uploads/%s', $filename))) {
            $this->result->setError('Failed to move uploaded file.');
        }

        if ($this->result->hasErrors()) {
            $this->result->setSuccess(false);
            return $this->result;
        }

        $this->result->setInfo('http://test.jkfeedback.ru/uploads/'. $filename);
        $this->result->setSuccess(true);
        return $this->result;

    }

}