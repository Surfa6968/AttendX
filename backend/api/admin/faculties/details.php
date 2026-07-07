<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Authorization
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
| Get Faculty ID
|--------------------------------------------------------------------------
*/

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid faculty ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Get Faculty
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT
    id,
    faculty_name,
    faculty_code
FROM faculties
WHERE id = ?
LIMIT 1
");

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error("Faculty not found.", 404);
}

$faculty = $result->fetch_assoc();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Faculty loaded successfully.", $faculty);