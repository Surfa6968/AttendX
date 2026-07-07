import axios from "axios";

const API = "http://localhost/AttendX/backend/api/admin/courses";

export const getCourses = async () => {
    const response = await axios.get(`${API}/list.php`, {
        withCredentials: true
    });
    return response.data;
};

export const getCourse = async (id) => {
    const response = await axios.get(`${API}/details.php?id=${id}`, {
        withCredentials: true
    });
    return response.data;
};

export const createCourse = async (data) => {
    const response = await axios.post(`${API}/create.php`, data, {
        withCredentials: true
    });
    return response.data;
};

export const updateCourse = async (id,data) => {
    const response = await axios.post(`${API}/update.php?id=${id}`, data, {
        withCredentials: true
    });
    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await axios.post(`${API}/delete.php?id=${id}`, {}, {
        withCredentials: true
    });
    return response.data;
};

export const searchCourses = async (keyword) => {
    const response = await axios.get(
        `${API}/search.php?keyword=${keyword}`,
        {
            withCredentials:true
        }
    );

    return response.data;
};