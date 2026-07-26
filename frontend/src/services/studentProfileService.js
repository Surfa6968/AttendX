import axios from "axios";
import { API_URL } from "../config/api";

const API = `${API_URL}/student/profile`;

const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

export const getStudentProfile = async () => {
    const response = await api.get("/get.php");
    return response.data;
};

export const updateStudentProfile = async (data) => {
    const response = await api.post("/update.php", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Upload Profile Photo
|--------------------------------------------------------------------------
*/

export const uploadProfilePhoto = async (file) => {

    const formData = new FormData();

    formData.append("photo", file);

    const response = await api.post(
        "/uploadPhoto.php",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword = async (data) => {

    const response = await api.post(
        "/changePassword.php",
        data
    );

    return response.data;

};
export default api;