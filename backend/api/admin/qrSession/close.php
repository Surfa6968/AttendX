<?php

session_start();

require_once "../../../config/cors.php";
require_once "../../../config/database.php";
require_once "../../../helpers/response.php";

if (!isset($_SESSION["user"])) {
    error("Unauthorized.",401);
}

if ($_SESSION["user"]["role"] !== "admin") {
    error("Access denied.",403);
}

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data["id"] ?? 0);

if ($id <= 0) {
    error("Invalid QR Session ID.",400);
}

/*
|--------------------------------------------------------------------------
| Check session
|--------------------------------------------------------------------------
*/

$stmt = $mysqli->prepare("
SELECT
    id,
    status,
    is_active
FROM qr_sessions
WHERE id=?
LIMIT 1
");

$stmt->bind_param("i",$id);
$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows==0){
    error("QR Session not found.",404);
}

$row = $result->fetch_assoc();

$stmt->close();

/*
|--------------------------------------------------------------------------
| Already Closed?
|--------------------------------------------------------------------------
*/

if($row["status"]=="Closed"){
    success("QR Session already closed.",[
        "id"=>$id
    ]);
}

/*
|--------------------------------------------------------------------------
| Close
|--------------------------------------------------------------------------
*/

$status="Closed";
$is_active=0;

$stmt=$mysqli->prepare("
UPDATE qr_sessions
SET
status=?,
is_active=?,
closed_at=NOW()
WHERE id=?
");

$stmt->bind_param(
"sii",
$status,
$is_active,
$id
);

if(!$stmt->execute()){
    error("Failed to close QR Session.",500);
}

$stmt->close();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
"QR Session closed successfully.",
[
    "id"=>$id,
    "status"=>"Closed"
]
);