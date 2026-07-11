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
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.",403);
}

/*
|--------------------------------------------------------------------------
| Get Lecturer List
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("

SELECT

l.id,
l.employee_no,

u.full_name,
u.email,
u.is_active,

f.faculty_name,
d.department_name,

l.designation

FROM lecturers l

INNER JOIN users u
ON l.user_id = u.id

LEFT JOIN faculties f
ON l.faculty_id = f.id

LEFT JOIN departments d
ON l.department_id = d.id

WHERE u.role_id = 2

ORDER BY u.full_name ASC

");

$stmt->execute();

$result = $stmt->get_result();

$data=[];

while($row=$result->fetch_assoc()){

    $data[]=$row;

}

$stmt->close();

success(
    "Lecturers loaded successfully.",
    $data
);