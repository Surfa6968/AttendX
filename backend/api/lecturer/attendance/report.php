<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| ATTENDX - LECTURER ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| 1. Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {
    error("Unauthorized.", 401);
}

if (
    !isset($_SESSION["user"]["role"]) ||
    $_SESSION["user"]["role"] !== "lecturer"
) {
    error("Access denied.", 403);
}

$user_id = (int) $_SESSION["user"]["id"];


/*
|--------------------------------------------------------------------------
| 2. Find Lecturer
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT
        id,
        user_id
    FROM lecturers
    WHERE user_id = ?
    LIMIT 1
";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error("Unable to find lecturer.", 500);
}

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    $stmt->close();

    error("Lecturer profile not found.", 404);
}

$lecturer = $result->fetch_assoc();

$lecturer_id = (int) $lecturer["id"];

$stmt->close();


/*
|--------------------------------------------------------------------------
| 3. Filters
|--------------------------------------------------------------------------
*/

$course_id = trim($_GET["course_id"] ?? "");

$date_from = trim($_GET["date_from"] ?? "");

$date_to = trim($_GET["date_to"] ?? "");

$status = trim($_GET["status"] ?? "");

$search = trim($_GET["search"] ?? "");


/*
|--------------------------------------------------------------------------
| 4. Main Attendance Query
|--------------------------------------------------------------------------
|
| Lecturer
|    ↓
| lecturers.id
|    ↓
| class_sessions.lecturer_id
|
| Attendance
|    ↓
| class_sessions
|    ↓
| courses
|
| Attendance
|    ↓
| students
|    ↓
| users
|
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT

        a.id AS attendance_id,

        a.attendance_status,

        a.scanned_at AS marked_at,

        cs.id AS session_id,

        cs.session_date,

        cs.start_time,

        cs.end_time,

        c.id AS course_id,

        c.course_code,

        c.course_name,

        s.id AS student_id,

        u.full_name AS student_name

    FROM attendance AS a

    INNER JOIN class_sessions AS cs
        ON cs.id = a.class_session_id

    INNER JOIN courses AS c
        ON c.id = cs.course_id

    INNER JOIN students AS s
        ON s.id = a.student_id

    INNER JOIN users AS u
        ON u.id = s.user_id

    WHERE cs.lecturer_id = ?
";


/*
|--------------------------------------------------------------------------
| 5. Parameters
|--------------------------------------------------------------------------
*/

$params = [$lecturer_id];

$types = "i";


/*
|--------------------------------------------------------------------------
| 6. Course Filter
|--------------------------------------------------------------------------
*/

if ($course_id !== "") {

    $sql .= "
        AND c.id = ?
    ";

    $params[] = (int) $course_id;

    $types .= "i";
}


/*
|--------------------------------------------------------------------------
| 7. Date From
|--------------------------------------------------------------------------
*/

if ($date_from !== "") {

    $sql .= "
        AND cs.session_date >= ?
    ";

    $params[] = $date_from;

    $types .= "s";
}


/*
|--------------------------------------------------------------------------
| 8. Date To
|--------------------------------------------------------------------------
*/

if ($date_to !== "") {

    $sql .= "
        AND cs.session_date <= ?
    ";

    $params[] = $date_to;

    $types .= "s";
}


/*
|--------------------------------------------------------------------------
| 9. Status Filter
|--------------------------------------------------------------------------
*/

if ($status !== "") {

    $sql .= "
        AND LOWER(TRIM(a.attendance_status)) = LOWER(TRIM(?))
    ";

    $params[] = $status;

    $types .= "s";
}


/*
|--------------------------------------------------------------------------
| 10. Search
|--------------------------------------------------------------------------
*/

if ($search !== "") {

    $sql .= "
        AND (
            u.full_name LIKE ?
            OR c.course_code LIKE ?
            OR c.course_name LIKE ?
        )
    ";

    $search_value = "%" . $search . "%";

    $params[] = $search_value;
    $params[] = $search_value;
    $params[] = $search_value;

    $types .= "sss";
}


/*
|--------------------------------------------------------------------------
| 11. Ordering
|--------------------------------------------------------------------------
*/

$sql .= "
    ORDER BY
        cs.session_date DESC,
        cs.start_time DESC,
        u.full_name ASC
";


/*
|--------------------------------------------------------------------------
| 12. Prepare
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare($sql);

if (!$stmt) {

    error(
        "Unable to prepare attendance report query.",
        500
    );
}


/*
|--------------------------------------------------------------------------
| 13. Bind Parameters
|--------------------------------------------------------------------------
*/

$stmt->bind_param(
    $types,
    ...$params
);


/*
|--------------------------------------------------------------------------
| 14. Execute
|--------------------------------------------------------------------------
*/

if (!$stmt->execute()) {

    $stmt->close();

    error(
        "Unable to load attendance records.",
        500
    );
}

$result = $stmt->get_result();


/*
|--------------------------------------------------------------------------
| 15. Process Records
|--------------------------------------------------------------------------
*/

$data = [];

$session_ids = [];

$total_records = 0;

$total_present = 0;

$total_late = 0;

$total_absent = 0;


while ($row = $result->fetch_assoc()) {

    $session_id =
        (int) $row["session_id"];

    $session_ids[$session_id] = true;


    /*
    |----------------------------------------------------------------------
    | Attendance Status
    |----------------------------------------------------------------------
    */

    $attendance_status =
        strtolower(
            trim(
                $row["attendance_status"] ?? ""
            )
        );


    if ($attendance_status === "present") {

        $total_present++;

    } elseif ($attendance_status === "late") {

        $total_late++;

    } elseif ($attendance_status === "absent") {

        $total_absent++;
    }


    $total_records++;


    /*
    |----------------------------------------------------------------------
    | Attendance Record
    |----------------------------------------------------------------------
    */

    $data[] = [

        "attendance_id" =>
            (int) $row["attendance_id"],

        "session_id" =>
            $session_id,

        "course_id" =>
            (int) $row["course_id"],

        "course_code" =>
            $row["course_code"],

        "course_name" =>
            $row["course_name"],

        "student_id" =>
            (int) $row["student_id"],

        "student_name" =>
            $row["student_name"],

        "session_date" =>
            $row["session_date"],

        "start_time" =>
            $row["start_time"],

        "end_time" =>
            $row["end_time"],

        "attendance_status" =>
            $row["attendance_status"],

        "marked_at" =>
            $row["marked_at"]

    ];
}


/*
|--------------------------------------------------------------------------
| 16. Statistics
|--------------------------------------------------------------------------
*/

$total_sessions =
    count($session_ids);


$attendance_percentage = 0;

if ($total_records > 0) {

    $attendance_percentage =
        round(
            (
                (
                    $total_present
                    +
                    $total_late
                )
                /
                $total_records
            ) * 100,
            2
        );
}


/*
|--------------------------------------------------------------------------
| 17. Close Statement
|--------------------------------------------------------------------------
*/

$stmt->close();


/*
|--------------------------------------------------------------------------
| 18. Response
|--------------------------------------------------------------------------
*/

success(
    "Attendance report loaded successfully.",
    [

        "statistics" => [

            "total_sessions" =>
                $total_sessions,

            "total_records" =>
                $total_records,

            "present" =>
                $total_present,

            "late" =>
                $total_late,

            "absent" =>
                $total_absent,

            "attendance_percentage" =>
                $attendance_percentage

        ],

        "data" =>
            $data

    ]
);


/*
|--------------------------------------------------------------------------
| 19. Close Database
|--------------------------------------------------------------------------
*/

$mysqli->close();

exit;