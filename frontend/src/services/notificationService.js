import { API_URL } from "../config/api";

export const getNotifications = async () => {
    const response = await fetch(
        `${API_URL}/notifications/get.php`,
        {
            credentials: "include",
        }
    );

    return await response.json();
};

export const getUnreadCount = async () => {
    const response = await fetch(
        `${API_URL}/notifications/unread_count.php`,
        {
            credentials: "include",
        }
    );

    return await response.json();
};

export const markAsRead = async (id) => {
    const response = await fetch(
        `${API_URL}/notifications/mark_read.php`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
            }),
        }
    );

    return await response.json();
};

export const markAllAsRead = async () => {
    const response = await fetch(
        `${API_URL}/notifications/mark_all_read.php`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    return await response.json();
};