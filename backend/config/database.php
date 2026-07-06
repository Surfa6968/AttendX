<?php

require_once "env.php";

$mysqli = new mysqli(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    $_ENV['DB_NAME']
);

if ($mysqli->connect_errno) {

    http_response_code(500);

    die(json_encode([
        "success"=>false,
        "message"=>"Database Connection Failed"
    ]));
}

$mysqli->set_charset("utf8mb4");