<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Student Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.", 403);
}

$userId = $_SESSION["user"]["id"];

/*
|--------------------------------------------------------------------------
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$phone = trim($data["phone"] ?? "");
$address = trim($data["address"] ?? "");
$guardian_name = trim($data["guardian_name"] ?? "");
$guardian_phone = trim($data["guardian_phone"] ?? "");

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE students
SET
    phone = ?,
    address = ?,
    guardian_name = ?,
    guardian_phone = ?
WHERE user_id = ?
");

$stmt->bind_param(
    "ssssi",
    $phone,
    $address,
    $guardian_name,
    $guardian_phone,
    $userId
);

if ($stmt->execute()) {

    success("Profile updated successfully.");

} else {

    error("Failed to update profile.");

}

$stmt->close();
$mysqli->close();
exit;