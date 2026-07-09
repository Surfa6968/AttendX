<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.", 403);
}

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid student ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Get User ID
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT user_id
FROM students
WHERE id=?
LIMIT 1
");

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error("Student not found.", 404);
}

$user_id = $result->fetch_assoc()["user_id"];

$stmt->close();

/*
|--------------------------------------------------------------------------
| Delete Student
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
DELETE FROM students
WHERE id=?
");

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    error("Failed to delete student.", 500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
DELETE FROM users
WHERE id=?
");

$stmt->bind_param("i", $user_id);

if (!$stmt->execute()) {
    error("Failed to delete user.", 500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Student deleted successfully.");