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
| Student List
|--------------------------------------------------------------------------
*/

$sql = "
SELECT

s.id,
s.registration_no,

u.full_name,
u.email,
u.gender,
u.is_active,

f.faculty_name,
d.department_name,

s.academic_year,
s.semester

FROM students s

INNER JOIN users u
ON s.user_id = u.id

LEFT JOIN faculties f
ON s.faculty_id = f.id

LEFT JOIN departments d
ON s.department_id = d.id

ORDER BY
u.full_name
";

$result = $mysqli->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = $row;

}

success(
    "Students loaded successfully.",
    $data
);