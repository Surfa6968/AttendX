import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/student/timetable`;

const api = axios.create({

    baseURL: API,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }

});

export const getStudentTimetable = async () => {

    const response = await api.get("/get.php");

    return response.data;

};

export default api;