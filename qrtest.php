<?php

require __DIR__ . "/vendor/autoload.php";

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;

try {

    $builder = new Builder(
        writer: new PngWriter()
    );

    $result = $builder->build(
        data: "Hello AttendX"
    );

    $result->saveToFile(__DIR__ . "/testqr.png");

    echo "SUCCESS";

} catch (Throwable $e) {

    echo $e->getMessage();

}