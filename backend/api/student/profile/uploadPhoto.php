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
| Check File
|--------------------------------------------------------------------------
*/

if (!isset($_FILES["photo"])) {
    error("No image uploaded.");
}

$file = $_FILES["photo"];

/*
|--------------------------------------------------------------------------
| Validate Upload
|--------------------------------------------------------------------------
*/

if ($file["error"] !== UPLOAD_ERR_OK) {
    error("Upload failed.");
}

$allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
];

if (!in_array($file["type"], $allowedTypes)) {
    error("Only JPG, JPEG, PNG and WEBP images are allowed.");
}

if ($file["size"] > 2 * 1024 * 1024) {
    error("Image must be smaller than 2 MB.");
}

/*
|--------------------------------------------------------------------------
| Create Filename
|--------------------------------------------------------------------------
*/

$extension = pathinfo($file["name"], PATHINFO_EXTENSION);

$fileName = "student_" . $userId . "_" . time() . "." . $extension;

$uploadDir = __DIR__ . "/../../../uploads/profile/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$destination = $uploadDir . $fileName;

/*
|--------------------------------------------------------------------------
| Move File
|--------------------------------------------------------------------------
*/

if (!move_uploaded_file($file["tmp_name"], $destination)) {
    error("Failed to save image.");
}

/*
|--------------------------------------------------------------------------
| Save Path
|--------------------------------------------------------------------------
*/

$photoPath = "uploads/profile/" . $fileName;

$stmt = $mysqli->prepare("
UPDATE users
SET profile_photo=?
WHERE id=?
");

$stmt->bind_param(
    "si",
    $photoPath,
    $userId
);

$stmt->execute();

/*
|--------------------------------------------------------------------------
| Success
|--------------------------------------------------------------------------
*/

success(
    "Profile photo updated successfully.",
    [
        "profile_photo" => $photoPath
    ]
);

$stmt->close();
$mysqli->close();
exit;