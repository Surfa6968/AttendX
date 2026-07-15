import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/student/attendance`;

const api = axios.create({

    baseURL: API,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }

});

/*
|--------------------------------------------------------------------------
| Attendance History
|--------------------------------------------------------------------------
*/

export const getAttendanceHistory = async () => {

    const response = await api.get("/history.php");

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Validate QR
|--------------------------------------------------------------------------
*/

export const validateQR = async (data) => {

    const response = await api.post("/validateQR.php", data);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Scan QR
|--------------------------------------------------------------------------
*/

export const scanQR = async (data) => {

    const response = await api.post("/scan.php", data);

    return response.data;

};

export default api;