<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.",403);
}

$id = intval($_GET["id"] ?? 0);

if($id<=0){
    error("Invalid course ID.",400);
}

$stmt = $mysqli->prepare("
DELETE FROM courses
WHERE id=?
");

$stmt->bind_param("i",$id);

if(!$stmt->execute()){
    error("Failed to delete course.",500);
}

$stmt->close();

success("Course deleted successfully.");