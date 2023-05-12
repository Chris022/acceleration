<?php

//INFO: For this to work with the inbuild PHP Server, you need to have multiple workers available
//run: export "PHP_CLI_SERVER_WORKERS=2"

require "./vendor/autoload.php";

use Acceleration\Acceleration;

Acceleration::setBaseView("http://localhost:8080/frontend/js/index.html");

sleep(1);

die(Acceleration::render("hello-world",[
    "text" => "Chris"
]));