import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/departments`;

const api = axios.create({
    baseURL: API,
    withCredentials: true
});

/*
|--------------------------------------------------------------------------
| Get All Departments
|--------------------------------------------------------------------------
*/

export const getDepartments = async () => {
    const response = await api.get("/list.php");
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Department
|--------------------------------------------------------------------------
*/

export const getDepartment = async (id) => {
    const response = await api.get(`/details.php?id=${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Department
|--------------------------------------------------------------------------
*/

export const createDepartment = async (data) => {
    const response = await api.post("/create.php", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Department
|--------------------------------------------------------------------------
*/

export const updateDepartment = async (id, data) => {
    const response = await api.post(`/update.php?id=${id}`, data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Department
|--------------------------------------------------------------------------
*/

export const deleteDepartment = async (id) => {
    const response = await api.post(`/delete.php?id=${id}`);
    return response.data;
};

export default api;