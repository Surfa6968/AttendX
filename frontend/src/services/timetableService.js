import axios from "axios";

const API = "http://localhost/AttendX/backend/api/admin/timetable";

export const getTimetables = async () => {
    const res = await axios.get(`${API}/list.php`, {
        withCredentials: true,
    });
    return res.data;
};

export const getTimetable = async (id) => {
    const res = await axios.get(`${API}/get.php?id=${id}`, {
        withCredentials: true,
    });
    return res.data;
};

export const createTimetable = async (data) => {
    const res = await axios.post(`${API}/create.php`, data, {
        withCredentials: true,
    });
    return res.data;
};

export const updateTimetable = async (id, data) => {
    const res = await axios.post(`${API}/update.php?id=${id}`, data, {
        withCredentials: true,
    });
    return res.data;
};

export const deleteTimetable = async (id) => {
    const res = await axios.post(
        `${API}/delete.php`,
        { id },
        { withCredentials: true }
    );
    return res.data;
};

export const searchTimetables = async (keyword) => {
    const res = await axios.get(
        `${API}/search.php?keyword=${keyword}`,
        {
            withCredentials: true,
        }
    );
    return res.data;
};