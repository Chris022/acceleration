<?php

require "./vendor/autoload.php";

use Acceleration\Acceleration;

Acceleration::setBaseView("http://localhost:8080/baseview.html");

die(Acceleration::render("dashboard",[
    "users" => [["name"=>"chris","age"=>21]]
]));