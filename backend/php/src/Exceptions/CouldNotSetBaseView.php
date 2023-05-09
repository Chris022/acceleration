<?php


namespace Acceleration\Exceptions;

use Exception;
use Throwable;

class CouldNotSetBaseView extends Exception{
    public function __construct(int $code = 0, Throwable $previous = null) {
        parent::__construct("Could not set base view: make shure your php is allowed to set environment varaibles!", $code, $previous);
    }
}