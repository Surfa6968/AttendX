import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
    validateQR,
    scanQR
} from "../../services/studentAttendanceService";

function QRScanner() {

    useEffect(() => {

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: 250
            },
            false
        );

        scanner.render(

            async (decodedText) => {

                try {

                    // Stop scanner after successful detection
                    await scanner.clear();

                    console.log("QR Token:", decodedText);

                    /*
                    ------------------------------------------------
                    Validate QR
                    ------------------------------------------------
                    */

                    console.log("Calling validateQR...");

                    const validate = await validateQR({
                        qr_token: decodedText
                    });

                    console.log("Validate Response:", validate);

                    if (!validate.success) {

                        alert(validate.message);

                        return;

                    }

                    /*
                    ------------------------------------------------
                    Mark Attendance
                    ------------------------------------------------
                    */

                    console.log("Calling scanQR...");

                    const mark = await scanQR({
                        qr_token: decodedText
                    });

                    console.log("Scan Response:", mark);

                    alert(mark.message);

                }

                catch (error) {

                    console.error("QR Scan Error:", error);

                    console.error("Response:", error.response);

                    console.error("Response Data:", error.response?.data);

                    alert(

                        error.response?.data?.message ||

                        error.message ||

                        "QR Scan Failed."

                    );

                }

            },

            (errorMessage) => {
                // Ignore continuous scan errors
                // console.log(errorMessage);
            }

        );

        return () => {

            scanner.clear().catch(() => {});

        };

    }, []);

    return (

        <div className="container py-4">

            <div className="card shadow">

                <div className="card-header bg-success text-white">

                    <h4 className="mb-0">

                        Scan QR Attendance

                    </h4>

                </div>

                <div className="card-body text-center">

                    <div
                        id="reader"
                        style={{
                            width: "400px",
                            margin: "0 auto"
                        }}
                    ></div>

                </div>

            </div>

        </div>

    );

}

export default QRScanner;