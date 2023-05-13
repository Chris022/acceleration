<?php

//INFO: For this to work with the inbuild PHP Server, you need to have multiple workers available
//run: export "PHP_CLI_SERVER_WORKERS=2"

require "./vendor/autoload.php";

use Acceleration\Acceleration;

Acceleration::setBaseView("http://localhost:8080/frontend/js/index.html");

sleep(1);

//validate form data
if(!!!isset($_GET["name"]) or $_GET["name"]===""){
    die(Acceleration::render("hello-world",[
        "errors" => [
            "name" => "The field name is required!"
        ]
    ]));
}
//get the form data sent via GET request
$name = $_GET["name"];


die(Acceleration::render("hello-world",[
    "text" => $name
]));