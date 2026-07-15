<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

require_once __DIR__ . "/../../../../vendor/autoload.php";

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;

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
| Read Request
|--------------------------------------------------------------------------
*/

$data = json_decode(file_get_contents("php://input"), true);

$class_session_id = intval($data["class_session_id"] ?? 0);

$scan_limit = intval($data["scan_limit"] ?? 100);

$duration = 5;

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if ($class_session_id <= 0) {
    error("Please select a class session.");
}

if ($scan_limit <= 0) {
    $scan_limit = 100;
}

/*
|--------------------------------------------------------------------------
| Verify Class Session
|--------------------------------------------------------------------------
*/

$sql = "

SELECT

    cs.id,
    cs.session_date,
    cs.start_time,
    cs.end_time,

    c.course_code,
    c.course_name,

    u.full_name

FROM class_sessions cs

INNER JOIN courses c
    ON c.id = cs.course_id

INNER JOIN lecturers l
    ON l.id = cs.lecturer_id

INNER JOIN users u
    ON u.id = l.user_id

WHERE cs.id = ?

LIMIT 1

";

$stmt = $mysqli->prepare($sql);

$stmt->bind_param("i", $class_session_id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 0) {

    error("Class session not found.");

}

$classSession = $result->fetch_assoc();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Check Existing Active QR
|--------------------------------------------------------------------------
*/

$sql = "

SELECT id

FROM qr_sessions

WHERE

class_session_id = ?

AND status='Active'

LIMIT 1

";

$stmt = $mysqli->prepare($sql);

$stmt->bind_param("i",$class_session_id);

$stmt->execute();

if($stmt->get_result()->num_rows>0){

    error("This class session already has an active QR.");

}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Generate Token
|--------------------------------------------------------------------------
*/

$qr_token = bin2hex(random_bytes(32));

$generated_at = date("Y-m-d H:i:s");

$expires_at = date(
    "Y-m-d H:i:s",
    strtotime("+{$duration} minutes")
);

$fileName =
    "qr_" .
    time() .
    "_" .
    $class_session_id .
    ".png";

$uploadDir =
    __DIR__ .
    "/../../../uploads/qr/";

$imagePath =
    "backend/uploads/qr/" .
    $fileName;

    /*
|--------------------------------------------------------------------------
| Generate QR Image
|--------------------------------------------------------------------------
*/

try {

    $builder = new Builder(
        writer: new PngWriter()
    );

    $result = $builder->build(
        data: $qr_token
    );

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $result->saveToFile($uploadDir . $fileName);

}
catch (Throwable $e) {

    error(
        "QR generation failed: ".$e->getMessage(),
        500
    );

}

/*
|--------------------------------------------------------------------------
| Insert QR Session
|--------------------------------------------------------------------------
*/

$sql = "

INSERT INTO qr_sessions (

    class_session_id,
    qr_token,
    qr_image,
    generated_at,
    expires_at,
    is_active,
    scan_limit,
    total_scans,
    created_by,
    status

)

VALUES (

    ?,?,?,?,?,?,?,?,?,?

)

";

$stmt = $mysqli->prepare($sql);

$is_active = 1;

$total_scans = 0;

$created_by = $_SESSION["user"]["id"];

$status = "Active";

$stmt->bind_param(

    "issssiiiis",

    $class_session_id,
    $qr_token,
    $imagePath,
    $generated_at,
    $expires_at,
    $is_active,
    $scan_limit,
    $total_scans,
    $created_by,
    $status

);

if (!$stmt->execute()) {

    if (file_exists($uploadDir . $fileName)) {

        unlink($uploadDir . $fileName);

    }

    error(

        "Failed to save QR Session.",

        500

    );

}

$qrSessionId = $stmt->insert_id;

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success Response
|--------------------------------------------------------------------------
*/

success(

    "QR Session generated successfully.",

    [

        "id" => $qrSessionId,

        "class_session_id" => $class_session_id,

        "course_code" => $classSession["course_code"],

        "course_name" => $classSession["course_name"],

        "lecturer_name" => $classSession["full_name"],

        "qr_token" => $qr_token,

        "qr_image" => $imagePath,

        "generated_at" => $generated_at,

        "expires_at" => $expires_at,

        "status" => $status,

        "scan_limit" => $scan_limit

    ]

);

$mysqli->close();

exit;