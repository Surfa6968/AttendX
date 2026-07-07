import axios from "axios";

const API = "http://localhost/AttendX/backend/api/admin";

export const getDashboardStats = () => {
    return axios.get(`${API}/dashboard.php`, {
        withCredentials: true
    });
};