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

if ($_SESSION["user"]["role"] !== "student") {
    error("Access denied.", 403);
}

$userId = $_SESSION["user"]["id"];

/*
|--------------------------------------------------------------------------
| Student Profile
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT
    u.full_name,
    u.email,
    u.gender,
    u.profile_photo,
    u.is_active,

    s.registration_no,
    s.phone,
    s.address,
    s.guardian_name,
    s.guardian_phone,
    s.academic_year,
    s.year_of_study,
    s.semester,

    f.faculty_name,
    d.department_name,

    c.id AS course_id,
    c.course_code,
    c.course_name

FROM students s

INNER JOIN users u
    ON s.user_id = u.id

LEFT JOIN faculties f
    ON s.faculty_id = f.id

LEFT JOIN departments d
    ON s.department_id = d.id

LEFT JOIN course_enrollments ce
    ON ce.student_id = s.id
    AND ce.status = 'Active'

LEFT JOIN courses c
    ON ce.course_id = c.id

WHERE s.user_id = ?
ORDER BY c.course_code ASC
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {
    error("Student not found.");
}

$student = null;

while ($row = $result->fetch_assoc()) {

    if ($student === null) {

        $student = [

            "full_name" => $row["full_name"],
            "email" => $row["email"],
            "gender" => $row["gender"],
            "profile_photo" => $row["profile_photo"],
            "is_active" => (int)$row["is_active"],

            "registration_no" => $row["registration_no"],
            "phone" => $row["phone"],
            "address" => $row["address"],
            "guardian_name" => $row["guardian_name"],
            "guardian_phone" => $row["guardian_phone"],

            "academic_year" => $row["academic_year"],
            "year_of_study" => $row["year_of_study"],
            "semester" => $row["semester"],

            "faculty_name" => $row["faculty_name"],
            "department_name" => $row["department_name"],

            "courses" => []

        ];

    }

    if (!empty($row["course_id"])) {

        $student["courses"][] = [

            "id" => (int)$row["course_id"],
            "course_code" => $row["course_code"],
            "course_name" => $row["course_name"]

        ];

    }

}

$stmt->close();

success(
    "Student profile loaded successfully.",
    $student
);

$mysqli->close();