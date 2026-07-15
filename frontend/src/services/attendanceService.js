import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/attendance`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const getAttendance = () =>
    api.get("/list.php");

export const searchAttendance = (keyword) =>
    api.get("/search.php", {
        params: { keyword }
    });

export const viewAttendance = (id) =>
    api.get("/view.php", {
        params: { id }
    });

export const deleteAttendance = (id) =>
    api.post("/delete.php", { id });

export const getAttendanceStatistics = () =>
    api.get("/statistics.php");

export default api;