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
WHERE faculty_code = ?
OR faculty_name = ?
LIMIT 1
");

$stmt->bind_param(
    "ss",
    $faculty_code,
    $faculty_name
);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    error("Faculty already exists.", 409);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Insert Faculty
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
INSERT INTO faculties
(
    faculty_name,
    faculty_code
)
VALUES
(
    ?,?
)
");

$stmt->bind_param(
    "ss",
    $faculty_name,
    $faculty_code
);

if (!$stmt->execute()) {

    error("Failed to create faculty.", 500);

}

$id = $stmt->insert_id;

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Faculty created successfully.", [

    "id" => $id

]);