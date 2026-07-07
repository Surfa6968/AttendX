import axios from "axios";

const API = "http://localhost/AttendX/backend/api/admin/faculties";

export const getFaculties = async () => {
    const response = await axios.get(`${API}/list.php`, {
        withCredentials: true
    });
    return response.data;
};

export const getFaculty = async (id) => {
    const response = await axios.get(`${API}/details.php?id=${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const createFaculty = async (data) => {
    const response = await axios.post(`${API}/create.php`, data, {
        withCredentials: true
    });
    return response.data;
};

export const updateFaculty = async (id, data) => {
    const response = await axios.post(`${API}/update.php?id=${id}`, data, {
        withCredentials: true
    });
    return response.data;
};

export const deleteFaculty = async (id) => {
    const response = await axios.post(`${API}/delete.php?id=${id}`, {}, {
        withCredentials: true
    });
    return response.data;
};