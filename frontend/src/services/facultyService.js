import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/faculties`;

const api = axios.create({
    baseURL: API,
    withCredentials: true
});

/*
|--------------------------------------------------------------------------
| Get All Faculties
|--------------------------------------------------------------------------
*/

export const getFaculties = async () => {
    const response = await api.get("/list.php");
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Faculty
|--------------------------------------------------------------------------
*/

export const getFaculty = async (id) => {
    const response = await api.get(`/details.php?id=${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Faculty
|--------------------------------------------------------------------------
*/

export const createFaculty = async (data) => {
    const response = await api.post("/create.php", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Faculty
|--------------------------------------------------------------------------
*/

export const updateFaculty = async (id, data) => {
    const response = await api.post(`/update.php?id=${id}`, data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Faculty
|--------------------------------------------------------------------------
*/

export const deleteFaculty = async (id) => {
    const response = await api.post(`/delete.php?id=${id}`);
    return response.data;
};

export default api;