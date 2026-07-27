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
    const { data } = await api.get("/list.php");
    return data;
};

/*
|--------------------------------------------------------------------------
| Get Course Details
|--------------------------------------------------------------------------
*/

export const getCourse = async (id) => {
    const { data } = await api.get(`/details.php?id=${id}`);
    return data;
};

/*
|--------------------------------------------------------------------------
| Create Course
|--------------------------------------------------------------------------
*/

export const createCourse = async (course) => {
    const { data } = await api.post("/create.php", course);
    return data;
};

/*
|--------------------------------------------------------------------------
| Update Course
|--------------------------------------------------------------------------
*/

export const updateCourse = async (id, course) => {
    const { data } = await api.post(`/update.php?id=${id}`, course);
    return data;
};

/*
|--------------------------------------------------------------------------
| Delete Course
|--------------------------------------------------------------------------
*/

export const deleteCourse = async (id) => {
    const { data } = await api.post(`/delete.php?id=${id}`);
    return data;
};

/*
|--------------------------------------------------------------------------
| Search Courses
|--------------------------------------------------------------------------
*/

export const searchCourses = async (keyword = "") => {
    const { data } = await api.get("/search.php", {
        params: { keyword }
    });

    return data;
};

export default api;