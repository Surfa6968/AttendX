import axios from "axios";

const api = axios.create({

    baseURL:
    "http://localhost/AttendX/backend/api/student/attendance",

    withCredentials: true

});

export const getAttendanceHistory = () =>
    api.get("/history.php");

export const scanQR = (data) =>
    api.post("/scan.php", data);

export const validateQR = (data) =>
    api.post("/validateQR.php", data);

export default api;