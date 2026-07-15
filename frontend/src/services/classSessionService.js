import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/classSession`;

const api = axios.create({
    baseURL: API,
    withCredentials: true
});

/*
|--------------------------------------------------------------------------
| Get All Class Sessions
|--------------------------------------------------------------------------
*/

export const getClassSessions = async () => {
    const res = await api.get("/list.php");
    return res.data;
};

/*
|--------------------------------------------------------------------------
| Get Single Class Session
|--------------------------------------------------------------------------
*/

export const getClassSession = async (id) => {
    const res = await api.get(`/get.php?id=${id}`);
    return res.data;
};

/*
|--------------------------------------------------------------------------
| Create Class Session
|--------------------------------------------------------------------------
*/

export const createClassSession = async (data) => {
    const res = await api.post("/create.php", data);
    return res.data;
};

/*
|--------------------------------------------------------------------------
| Update Class Session
|--------------------------------------------------------------------------
*/

export const updateClassSession = async (id, data) => {
    const res = await api.post(`/update.php?id=${id}`, data);
    return res.data;
};

/*
|--------------------------------------------------------------------------
| Delete Class Session
|--------------------------------------------------------------------------
*/

export const deleteClassSession = async (id) => {
    const res = await api.post("/delete.php", { id });
    return res.data;
};

/*
|--------------------------------------------------------------------------
| Search Class Sessions
|--------------------------------------------------------------------------
*/

export const searchClassSessions = async (keyword) => {
    const res = await api.get("/search.php", {
        params: {
            keyword
        }
    });

    return res.data;
};

export default api;