import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/student/dashboard`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

export const getDashboardSummary = async () => {

    const response = await api.get("/summary.php");

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Today's Classes
|--------------------------------------------------------------------------
*/

export const getTodayClasses = async () => {

    const response = await api.get("/today.php");

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Recent Attendance
|--------------------------------------------------------------------------
*/

export const getRecentAttendance = async () => {

    const response = await api.get("/recentAttendance.php");

    return response.data;

};

export default api;