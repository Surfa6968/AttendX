import axios from "axios";

const API = "http://localhost/AttendX/backend/api/admin/students";

export const getStudents = async () => {
    const response = await axios.get(`${API}/list.php`, {
        withCredentials: true
    });

    return response.data;
};

export const getStudent = async (id) => {
    const response = await axios.get(
        `${API}/details.php?id=${id}`,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const createStudent = async (data) => {
    const response = await axios.post(
        `${API}/create.php`,
        data,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const updateStudent = async (id, data) => {
    const response = await axios.post(
        `${API}/update.php?id=${id}`,
        data,
        {
            withCredentials: true
        }
    );

    return response.data;
};

export const deleteStudent = async (id) => {
    const response = await axios.post(
        `${API}/delete.php?id=${id}`,
        {},
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};

export const searchStudents = async (keyword) => {
    const response = await axios.get(
        `${API}/search.php?keyword=${encodeURIComponent(keyword)}`,
        {
            withCredentials: true
        }
    );

    return response.data;
};