<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.", 403);
}

/*
|--------------------------------------------------------------------------
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data["id"] ?? 0);

if ($id <= 0) {
    error("Invalid timetable ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Check Record Exists
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM timetables
WHERE id = ?
LIMIT 1
");

$stmt->bind_param("i", $id);
$stmt->execute();

if ($stmt->get_result()->num_rows == 0) {
    error("Timetable record not found.", 404);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Delete Timetable
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
DELETE FROM timetables
WHERE id = ?
");

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    error("Failed to delete timetable.", 500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Timetable deleted successfully.");