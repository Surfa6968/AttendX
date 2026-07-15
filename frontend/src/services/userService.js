import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/users`;

const api = axios.create({

    baseURL: API,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }

});

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export const getUsers = async () => {

    const response = await api.get("/list.php");

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Get Single User
|--------------------------------------------------------------------------
*/

export const getUser = async (id) => {

    const response = await api.get(`/details.php?id=${id}`);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export const createUser = async (data) => {

    const response = await api.post("/create.php", data);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export const updateUser = async (id, data) => {

    const response = await api.post(`/update.php?id=${id}`, data);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export const deleteUser = async (id) => {

    const response = await api.post(`/delete.php?id=${id}`);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Toggle User Status
|--------------------------------------------------------------------------
*/

export const toggleUserStatus = async (id) => {

    const response = await api.post(`/toggle-status.php?id=${id}`);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Search Users
|--------------------------------------------------------------------------
*/

export const searchUsers = async (keyword) => {

    const response = await api.get("/search.php", {

        params: {
            keyword
        }

    });

    return response.data;

};

export default api;