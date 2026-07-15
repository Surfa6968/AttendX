import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/lecturers`;

const api = axios.create({
    baseURL: API,
    withCredentials: true
});

/*
|--------------------------------------------------------------------------
| Get All Lecturers
|--------------------------------------------------------------------------
*/

export const getLecturers = async () => {
    const response = await api.get("/list.php");
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Lecturer
|--------------------------------------------------------------------------
*/

export const getLecturer = async (id) => {
    const response = await api.get(`/details.php?id=${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Lecturer
|--------------------------------------------------------------------------
*/

export const createLecturer = async (data) => {
    const response = await api.post("/create.php", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Lecturer
|--------------------------------------------------------------------------
*/

export const updateLecturer = async (id, data) => {
    const response = await api.post(`/update.php?id=${id}`, data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Lecturer
|--------------------------------------------------------------------------
*/

export const deleteLecturer = async (id) => {
    const response = await api.post(`/delete.php?id=${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Search Lecturers
|--------------------------------------------------------------------------
*/

export const searchLecturers = async (keyword) => {
    const response = await api.get("/search.php", {
        params: {
            keyword
        }
    });

    return response.data;
};

export default api;