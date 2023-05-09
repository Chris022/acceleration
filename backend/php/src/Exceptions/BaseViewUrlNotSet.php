<?php


namespace Acceleration\Exceptions;

use Exception;
use Throwable;

class BaseViewUrlNotSet extends Exception{
    public function __construct(int $code = 0, Throwable $previous = null) {
        parent::__construct("BaseViewURL not found: set it as an env variable or using the 'setBaseView' function", $code, $previous);
    }
}