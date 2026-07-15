import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/admin`;

export const getDashboardStats = async () => {
    return axios.get(`${API}/dashboard.php`, {
        withCredentials: true
    });
};