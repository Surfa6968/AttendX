import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/students`;

const api = axios.create({

    baseURL: API,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }

});

/*
|--------------------------------------------------------------------------
| Get All Students
|--------------------------------------------------------------------------
*/

export const getStudents = async () => {

    const response = await api.get("/list.php");

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Get Student
|--------------------------------------------------------------------------
*/

export const getStudent = async (id) => {

    const response = await api.get(`/details.php?id=${id}`);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Create Student
|--------------------------------------------------------------------------
*/

export const createStudent = async (data) => {

    const response = await api.post("/create.php", data);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Update Student
|--------------------------------------------------------------------------
*/

export const updateStudent = async (id, data) => {

    const response = await api.post(`/update.php?id=${id}`, data);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Delete Student
|--------------------------------------------------------------------------
*/

export const deleteStudent = async (id) => {

    const response = await api.post(`/delete.php?id=${id}`);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Search Students
|--------------------------------------------------------------------------
*/

export const searchStudents = async (keyword) => {

    const response = await api.get("/search.php", {

        params: {
            keyword
        }

    });

    return response.data;

};

export default api;