import axios from "axios";

const API_URL = "http://localhost/AttendX/backend/api/admin/users";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export const getUsers = async () => {
    const response = await api.get("/list.php");
    return response.data;
};

export const getUser = async (id) => {
    const response = await api.get(`/details.php?id=${id}`);
    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post("/create.php", data);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.post(`/update.php?id=${id}`, data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.post(`/delete.php?id=${id}`);
    return response.data;
};

export const toggleUserStatus = async (id) => {
    const response = await api.post(`/toggle-status.php?id=${id}`);
    return response.data;
};

export const searchUsers = async (keyword) => {
    const response = await api.get(`/search.php?keyword=${keyword}`);
    return response.data;
};