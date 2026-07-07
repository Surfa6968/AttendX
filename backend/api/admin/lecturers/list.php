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
| Get Lecturers
|--------------------------------------------------------------------------
*/

$sql = "
SELECT
    l.id,
    l.employee_no,
    u.full_name
FROM lecturers l
INNER JOIN users u
    ON l.user_id = u.id
WHERE u.role_id = 2
AND u.is_active = 1
ORDER BY u.full_name ASC
";

$result = $mysqli->query($sql);

$lecturers = [];

while ($row = $result->fetch_assoc()) {
    $lecturers[] = $row;
}

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success("Lecturers loaded successfully.", $lecturers);