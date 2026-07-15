import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/qrSession`;

const api = axios.create({

    baseURL: API,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }

});

/*
|--------------------------------------------------------------------------
| Get QR Sessions
|--------------------------------------------------------------------------
*/

export const getQRSessions = async () => {

    const response = await api.get("/list.php");

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Create QR Session
|--------------------------------------------------------------------------
*/

export const createQRSession = async (data) => {

    const response = await api.post("/create.php", data);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Close QR Session
|--------------------------------------------------------------------------
*/

export const closeQRSession = async (id) => {

    const response = await api.post("/close.php", { id });

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Delete QR Session
|--------------------------------------------------------------------------
*/

export const deleteQRSession = async (id) => {

    const response = await api.post("/delete.php", { id });

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Search QR Sessions
|--------------------------------------------------------------------------
*/

export const searchQRSessions = async (keyword) => {

    const response = await api.get("/search.php", {

        params: { keyword }

    });

    return response.data;

};

export default api;