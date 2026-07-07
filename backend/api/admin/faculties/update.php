<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

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
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$faculty_name = trim($data["faculty_name"] ?? "");
$faculty_code = strtoupper(trim($data["faculty_code"] ?? ""));

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (!required($faculty_name) || !required($faculty_code)) {
    error("Faculty name and code are required.", 400);
}

/*
|--------------------------------------------------------------------------
| Duplicate Check
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT id
FROM faculties
WHERE
(
    faculty_name = ?
    OR faculty_code = ?
)
AND id <> ?
LIMIT 1
");

$stmt->bind_param(
    "ssi",
    $faculty_name,
    $faculty_code,
    $id
);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    error("Faculty name or code already exists.", 409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Update Faculty
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
UPDATE faculties
SET
    faculty_name = ?,
    faculty_code = ?
WHERE id = ?
");

$stmt->bind_param(
    "ssi",
    $faculty_name,
    $faculty_code,
    $id
);

if (!$stmt->execute()) {

    error("Failed to update faculty.", 500);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Faculty updated successfully.");