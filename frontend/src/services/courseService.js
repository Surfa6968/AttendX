import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/courses`;

const api = axios.create({
    baseURL: API,
    withCredentials: true
});

/*
|--------------------------------------------------------------------------
| Get All Courses
|--------------------------------------------------------------------------
*/

export const getCourses = async () => {
    const response = await api.get("/list.php");
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Course
|--------------------------------------------------------------------------
*/

export const getCourse = async (id) => {
    const response = await api.get(`/details.php?id=${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Course
|--------------------------------------------------------------------------
*/

export const createCourse = async (data) => {
    const response = await api.post("/create.php", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Course
|--------------------------------------------------------------------------
*/

export const updateCourse = async (id, data) => {
    const response = await api.post(`/update.php?id=${id}`, data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Course
|--------------------------------------------------------------------------
*/

export const deleteCourse = async (id) => {
    const response = await api.post(`/delete.php?id=${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Search Courses
|--------------------------------------------------------------------------
*/

export const searchCourses = async (keyword) => {
    const response = await api.get("/search.php", {
        params: {
            keyword
        }
    });

    return response.data;
};

export default api;