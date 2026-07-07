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

$sql = "
SELECT
    d.id,
    d.department_name,
    d.department_code,
    f.faculty_name,
    f.id AS faculty_id
FROM departments d
INNER JOIN faculties f
ON d.faculty_id = f.id
ORDER BY f.faculty_name, d.department_name
";

$result = $mysqli->query($sql);

$departments = [];

while ($row = $result->fetch_assoc()) {
    $departments[] = $row;
}

success("Departments loaded successfully.", $departments);