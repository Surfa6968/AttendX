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

                    // Stop camera
                    scanner.clear();

                    /*
                    -------------------------------
                    Validate QR
                    -------------------------------
                    */
                   console.log("Calling validateQR...");

                    const validate = await validateQR({
                        qr_token: decodedText
                    });

                    console.log(validate);
                    if (!validate.data.success) {

                        alert(validate.data.message);

                        return;

                    }

                    /*
                    -------------------------------
                    Mark Attendance
                    -------------------------------
                    */

                    const mark = await scanQR({
                        qr_token: decodedText
                    });

                    alert(mark.data.message);

                }

                catch (error) {

                    alert(
                        error.response?.data?.message ||
                        "QR Scan Failed."
                    );

                }

            },

            () => {}

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
                            margin: "auto"
                        }}
                    ></div>

                </div>

            </div>

        </div>

    );

}

export default QRScanner;