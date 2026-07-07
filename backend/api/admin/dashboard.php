<?php

session_start();

require_once "../../config/cors.php";
require_once "../../config/database.php";
require_once "../../helpers/response.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized",401);
}

$students =
$mysqli->query("SELECT COUNT(*) total FROM students")
->fetch_assoc()["total"];

$lecturers =
$mysqli->query("SELECT COUNT(*) total FROM lecturers")
->fetch_assoc()["total"];

$courses =
$mysqli->query("SELECT COUNT(*) total FROM courses")
->fetch_assoc()["total"];

$attendance =
$mysqli->query("
SELECT COUNT(*) total
FROM attendance
WHERE DATE(scanned_at)=CURDATE()
")->fetch_assoc()["total"];

success("Dashboard Loaded",[
    "students"=>$students,
    "lecturers"=>$lecturers,
    "courses"=>$courses,
    "attendance"=>$attendance
]);