<?php

//INFO: For this to work with the inbuild PHP Server, you need to have multiple workers available
//run: export "PHP_CLI_SERVER_WORKERS=2"

require "./vendor/autoload.php";

use Acceleration\Acceleration;

Acceleration::setBaseView("http://localhost:8080/public/index.html");


//check if it is a get request -> if yes, return greetings page
if($_SERVER['REQUEST_METHOD'] === "GET") die(Acceleration::render("greetings-page",[]));

//in case of a post request

//validate input
if(!!!isset($_POST["name"]) or $_POST["name"]===""){
    die(Acceleration::render("geetings-page",[
        "errors" => [
            "name" => "The field name is required!"
        ]
    ]));
}
//get the form data sent via GET request
$name = $_POST["name"];

die(Acceleration::render("success-page",[
    "name" => $name
]));