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
| Student ID
|--------------------------------------------------------------------------
*/

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    error("Invalid student ID.", 400);
}

/*
|--------------------------------------------------------------------------
| Read JSON
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$registration_no = trim($data["registration_no"] ?? "");
$full_name       = trim($data["full_name"] ?? "");
$email           = trim($data["email"] ?? "");
$gender          = trim($data["gender"] ?? "");

$faculty_id      = intval($data["faculty_id"] ?? 0);
$department_id   = intval($data["department_id"] ?? 0);

$academic_year   = trim($data["academic_year"] ?? "");
$year_of_study   = trim($data["year_of_study"] ?? "");
$semester        = trim($data["semester"] ?? "");

$course_ids     =   $data["course_ids"] ?? [];

$phone           = trim($data["phone"] ?? "");
$address         = trim($data["address"] ?? "");
$guardian_name   = trim($data["guardian_name"] ?? "");
$guardian_phone  = trim($data["guardian_phone"] ?? "");

$is_active       = intval($data["is_active"] ?? 1);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/
if (
    !required($registration_no) ||
    !required($full_name) ||
    !required($email)
) {
    error("Please fill all required fields.", 400);
}

if (
    !is_array($course_ids) ||
    count($course_ids) == 0
) {
    error("Please select at least one course.", 400);
}
$course_ids = array_map("intval", $course_ids);

$mysqli->begin_transaction();

try {

    /*
    |--------------------------------------------------------------------------
    | Get User ID
    |--------------------------------------------------------------------------
    */

    $stmt = $mysqli->prepare("
    SELECT user_id
    FROM students
    WHERE id = ?
    ");

    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        throw new Exception("Student not found.");
    }

    $user_id = $result->fetch_assoc()["user_id"];

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Update Users
    |--------------------------------------------------------------------------
    */

    $stmt = $mysqli->prepare("
    UPDATE users
    SET
        full_name = ?,
        email = ?,
        gender = ?,
        is_active = ?
    WHERE id = ?
    ");

    $stmt->bind_param(
        "sssii",
        $full_name,
        $email,
        $gender,
        $is_active,
        $user_id
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Update Students
    |--------------------------------------------------------------------------
    */

    $stmt = $mysqli->prepare("
    UPDATE students
    SET
        registration_no = ?,
        faculty_id = ?,
        department_id = ?,
        academic_year = ?,
        year_of_study = ?,
        semester = ?,
        phone = ?,
        address = ?,
        guardian_name = ?,
        guardian_phone = ?
    WHERE id = ?
    ");

    $stmt->bind_param(
        "siisssssssi",
        $registration_no,
        $faculty_id,
        $department_id,
        $academic_year,
        $year_of_study,
        $semester,
        $phone,
        $address,
        $guardian_name,
        $guardian_phone,
        $id
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Update Student Course Enrollments
    |--------------------------------------------------------------------------
    */

    /* Delete old enrollments */

    $stmt = $mysqli->prepare("
        DELETE FROM course_enrollments
        WHERE student_id = ?
    ");

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    /* Insert selected courses */

    $stmt = $mysqli->prepare("
        INSERT INTO course_enrollments
        (
            student_id,
            course_id,
            status
        )
        VALUES
        (
            ?, ?, 'Active'
        )
    ");

    foreach ($course_ids as $course_id) {
        $stmt->bind_param(
            "ii",
            $id,
            $course_id
        );

        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
    }
    $stmt->close();

    /*
    |--------------------------------------------------------------------------
    | Commit
    |--------------------------------------------------------------------------
    */

    $mysqli->commit();

    success("Student updated successfully.");

} catch (Exception $e) {

    $mysqli->rollback();

    error($e->getMessage(), 500);
}