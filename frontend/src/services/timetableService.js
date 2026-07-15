import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin/timetable`;

const api = axios.create({

    baseURL: API,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }

});

/*
|--------------------------------------------------------------------------
| Get All Timetables
|--------------------------------------------------------------------------
*/

export const getTimetables = async () => {

    const response = await api.get("/list.php");

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Get Single Timetable
|--------------------------------------------------------------------------
*/

export const getTimetable = async (id) => {

    const response = await api.get(`/get.php?id=${id}`);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Create Timetable
|--------------------------------------------------------------------------
*/

export const createTimetable = async (data) => {

    const response = await api.post("/create.php", data);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Update Timetable
|--------------------------------------------------------------------------
*/

export const updateTimetable = async (id, data) => {

    const response = await api.post(`/update.php?id=${id}`, data);

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Delete Timetable
|--------------------------------------------------------------------------
*/

export const deleteTimetable = async (id) => {

    const response = await api.post("/delete.php", { id });

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Search Timetables
|--------------------------------------------------------------------------
*/

export const searchTimetables = async (keyword) => {

    const response = await api.get("/search.php", {

        params: {
            keyword
        }

    });

    return response.data;

};

export default api;