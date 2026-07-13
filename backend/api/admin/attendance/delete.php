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
    error("Invalid attendance ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Check Attendance Exists
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT id

FROM attendance

WHERE id = ?

LIMIT 1

");

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {

    error("Attendance record not found.", 404);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Delete Attendance
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

DELETE FROM attendance

WHERE id = ?

");

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {

    error("Failed to delete attendance record.", 500);

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(

    "Attendance record deleted successfully."

);

$mysqli->close();

exit;

?>