import axios from "axios";

const API = "http://localhost/AttendX/backend/api/admin/departments";

export const getDepartments = async () => {
    const response = await axios.get(`${API}/list.php`, {
        withCredentials: true
    });
    return response.data;
};

export const getDepartment = async (id) => {
    const response = await axios.get(`${API}/details.php?id=${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const createDepartment = async (data) => {
    const response = await axios.post(`${API}/create.php`, data, {
        withCredentials: true
    });
    return response.data;
};

export const updateDepartment = async (id, data) => {
    const response = await axios.post(`${API}/update.php?id=${id}`, data, {
        withCredentials: true
    });
    return response.data;
};

export const deleteDepartment = async (id) => {
    const response = await axios.post(`${API}/delete.php?id=${id}`, {}, {
        withCredentials: true
    });
    return response.data;
};