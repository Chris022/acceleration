<?php


namespace Acceleration\Exceptions;

use Exception;
use Throwable;

class BaseViewInvalid extends Exception{
    public function __construct(int $code = 0, Throwable $previous = null) {
        parent::__construct("BaseView invalid: make shure the base view contains a div with the id 'main'", $code, $previous);
    }
}