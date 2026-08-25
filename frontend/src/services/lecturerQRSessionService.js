import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/lecturer/qrSession`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

/*
|--------------------------------------------------------------------------
| Get Lecturer Class Sessions
|--------------------------------------------------------------------------
*/

export const getLecturerClassSessions = async () => {

    const response = await api.get(
        "/classSessions.php"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Lecturer QR Sessions
|--------------------------------------------------------------------------
*/

export const getLecturerQRSessions = async () => {

    const response = await api.get(
        "/list.php"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create QR Session
|--------------------------------------------------------------------------
*/

export const createLecturerQRSession = async (data) => {

    const response = await api.post(
        "/create.php",
        data
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Close QR Session
|--------------------------------------------------------------------------
*/

export const closeLecturerQRSession = async (id) => {

    const response = await api.post(
        "/close.php",
        {
            id
        }
    );

    return response.data;
};


export default api;