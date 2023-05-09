<?php


namespace Acceleration\Exceptions;

use Exception;
use Throwable;

class BaseViewNotFound extends Exception{
    public function __construct(string $URL,int $code = 0, Throwable $previous = null) {
        parent::__construct("BaseView not found -> could not get html from '$URL'", $code, $previous);
    }
}