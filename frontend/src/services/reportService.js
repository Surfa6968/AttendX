import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/reports`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

export const getDashboardStatistics = async () => {
    const { data } = await api.get("/dashboard.php");
    return data;
};

/*
|--------------------------------------------------------------------------
| Attendance Report
|--------------------------------------------------------------------------
*/

export const getAttendanceReport = async (filters = {}) => {

    const { data } = await api.get(
        "/attendance.php",
        {
            params: filters
        }
    );

    return data;

};

export default api;