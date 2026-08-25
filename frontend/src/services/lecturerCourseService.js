import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/lecturer/courses`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Get Lecturer's Courses
|--------------------------------------------------------------------------
*/

export const getLecturerCourses = async () => {

    const response = await api.get("/my_courses.php");

    return response.data;
};

export default api;