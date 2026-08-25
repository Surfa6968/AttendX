import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/lecturer/attendance`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Get Lecturer Attendance
|--------------------------------------------------------------------------
*/

export const getLecturerAttendance = async () => {
    const response = await api.get("/history.php");

    return response.data;
};

export default api;