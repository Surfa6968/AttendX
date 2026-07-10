<?php
session_start();

require_once "../../config/cors.php";
require_once "../../helpers/response.php";

/*
|--------------------------------------------------------------------------
| Check Authentication
|--------------------------------------------------------------------------
*/

if (!isset($_SESSION["user"])) {

    error("Unauthorized.", 401);

}

/*
|--------------------------------------------------------------------------
| Return Logged-in User
|--------------------------------------------------------------------------
*/

echo "<pre>";
print_r($_SESSION["user"]);
exit;