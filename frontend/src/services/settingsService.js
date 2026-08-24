import { API_URL } from "../config/api";

export const getSystemSettings = async () => {

    const response = await fetch(
        `${API_URL}/admin/settings/get.php`,
        {
            credentials: "include",
        }
    );

    return await response.json();
};


export const updateSystemSetting = async (
    setting_key,
    setting_value
) => {

    const response = await fetch(
        `${API_URL}/admin/settings/update.php`,
        {
            method: "POST",
            credentials: "include",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                setting_key,
                setting_value,
            }),
        }
    );

    return await response.json();
};

export const getAdminProfile = async () => {
    const response = await fetch(
        `${API_URL}/admin/settings/profile.php`,
        {
            credentials: "include",
        }
    );

    return await response.json();
};


export const updateAdminProfile = async (data) => {
    const response = await fetch(
        `${API_URL}/admin/settings/update_profile.php`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    return await response.json();
};