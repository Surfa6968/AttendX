<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";
require_once "../../../helpers/validator.php";

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
| Validate ID
|--------------------------------------------------------------------------
*/

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid class session ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Read Request
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$session_date = trim($data["session_date"] ?? "");

$session_status = trim($data["session_status"] ?? "");

$remarks = trim($data["remarks"] ?? "");

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if (

    !required($session_date) ||

    !required($session_status)

) {

    error("Please fill all required fields.", 400);

}

$allowedStatus = [

    "Scheduled",
    "Started",
    "Completed",
    "Cancelled"

];

if (!in_array($session_status, $allowedStatus)) {

    error("Invalid session status.", 400);

}

/*
|--------------------------------------------------------------------------
| Check Record Exists
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT
    id

FROM class_sessions

WHERE id = ?

LIMIT 1

");

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {

    error("Class session not found.", 404);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Update Class Session
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

UPDATE class_sessions

SET

    session_date = ?,

    session_status = ?,

    remarks = ?

WHERE id = ?

");

$stmt->bind_param(

    "sssi",

    $session_date,

    $session_status,

    $remarks,

    $id

);

if (!$stmt->execute()) {

    error("Failed to update class session.", 500);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Class session updated successfully.");