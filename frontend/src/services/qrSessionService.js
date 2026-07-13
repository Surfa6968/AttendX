import axios from "axios";

const API =
    "http://localhost/AttendX/backend/api/admin/qrSession";

const api = axios.create({

    baseURL: API,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }

});

export const getQRSessions = () =>
    api.get("/list.php");

export const createQRSession = (data) =>
    api.post("/create.php", data);

export const deleteQRSession = (id) =>
    api.post("/delete.php", { id });

export const closeQRSession = (id) =>
    api.post("/close.php", { id });

export const searchQRSessions = (keyword) =>
    api.get("/search.php", {
        params: { keyword }
    });

export default api;