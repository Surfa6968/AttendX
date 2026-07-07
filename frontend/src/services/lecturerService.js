import axios from "axios";

const API = "http://localhost/AttendX/backend/api/admin/lecturers";

export const getLecturers = async () => {
    const response = await axios.get(`${API}/list.php`, {
        withCredentials: true
    });
    return response.data;
};

export const getLecturer = async (id) => {
    const response = await axios.get(`${API}/details.php?id=${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const createLecturer = async (data) => {
    const response = await axios.post(`${API}/create.php`, data, {
        withCredentials: true
    });
    return response.data;
};

export const updateLecturer = async (id, data) => {
    const response = await axios.post(`${API}/update.php?id=${id}`, data, {
        withCredentials: true
    });
    return response.data;
};

export const deleteLecturer = async (id) => {
    const response = await axios.post(`${API}/delete.php?id=${id}`, {}, {
        withCredentials: true
    });
    return response.data;
};

export const searchLecturers = async (keyword) => {
    const response = await axios.get(
        `${API}/search.php?keyword=${encodeURIComponent(keyword)}`,
        {
            withCredentials: true
        }
    );
    return response.data;
};