import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/lecturer/attendance`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Lecturer Attendance History
|--------------------------------------------------------------------------
*/

export const getLecturerAttendance = async (params = {}) => {
    const response = await api.get("/history.php", {
        params,
    });

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Lecturer Attendance Report
|--------------------------------------------------------------------------
*/

export const getLecturerAttendanceReport = async (params = {}) => {
    const response = await api.get("/report.php", {
        params,
    });

    return response.data;
};


export default api;