import axios from "axios";
import { API_URL } from "../config/api";

const api = axios.create({
    baseURL: API_URL
});

/*
|--------------------------------------------------------------------------
| Lecturer Dashboard Service
|--------------------------------------------------------------------------
|
| Loads dashboard information for the currently logged-in lecturer.
|
*/

export const getLecturerDashboard = async () => {
    try {
        const response = await api.get(
            "/lecturer/dashboard.php"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Failed to load lecturer dashboard:",
            error
        );

        throw error;
    }
};