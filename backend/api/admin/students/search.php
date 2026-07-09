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
| Search Keyword
|--------------------------------------------------------------------------
*/

$keyword = "%" . trim($_GET["keyword"] ?? "") . "%";

/*
|--------------------------------------------------------------------------
| Search Students
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT

s.id,
s.registration_no,

u.full_name,
u.email,
u.gender,
u.is_active,

f.faculty_name,
d.department_name,

s.year_of_study,
s.semester

FROM students s

INNER JOIN users u
ON s.user_id = u.id

LEFT JOIN faculties f
ON s.faculty_id = f.id

LEFT JOIN departments d
ON s.department_id = d.id

WHERE

u.full_name LIKE ?
OR
u.email LIKE ?
OR
s.registration_no LIKE ?
OR
f.faculty_name LIKE ?
OR
d.department_name LIKE ?

ORDER BY
u.full_name
");

$stmt->bind_param(
    "sssss",
    $keyword,
    $keyword,
    $keyword,
    $keyword,
    $keyword
);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = $row;

}

$stmt->close();

success(
    "Students loaded successfully.",
    $data
);