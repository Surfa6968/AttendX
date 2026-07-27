import { useEffect, useRef, useState } from "react";

import {
    FaBell,
    FaCheck,
    FaCheckDouble,
} from "react-icons/fa";

import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "../../services/notificationService";

function NotificationBell() {

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [notifications, setNotifications] = useState([]);

    const [unreadCount, setUnreadCount] = useState(0);

    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Load Notifications
    |--------------------------------------------------------------------------
    */

    const loadNotifications = async () => {

        try {

            const [list, count] = await Promise.all([
                getNotifications(),
                getUnreadCount(),
            ]);

            if (list.success) {
                setNotifications(list.data);
            }

            if (count.success) {
                setUnreadCount(count.unread);
            }

        } catch (error) {

            console.error(error);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadNotifications();

        const interval = setInterval(loadNotifications, 30000);

        return () => clearInterval(interval);

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Close when clicking outside
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Mark Single Notification
    |--------------------------------------------------------------------------
    */

    const handleRead = async (id) => {

        await markAsRead(id);

        loadNotifications();

    };

    /*
    |--------------------------------------------------------------------------
    | Mark All
    |--------------------------------------------------------------------------
    */

    const handleMarkAll = async () => {

        await markAllAsRead();

        loadNotifications();

    };

    return (

        <div
            className="position-relative"
            ref={dropdownRef}
        >

            {/* Bell */}

            <button
                className="btn btn-light rounded-circle shadow-sm position-relative"
                onClick={() => setOpen(!open)}
            >

                <FaBell size={18} />

                {unreadCount > 0 && (

                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    >
                        {unreadCount}
                    </span>

                )}

            </button>

            {/* Dropdown */}

            {open && (

                <div
                    className="card shadow border-0 position-absolute end-0 mt-2"
                    style={{
                        width: "380px",
                        maxHeight: "500px",
                        overflowY: "auto",
                        zIndex: 9999,
                        borderRadius: "15px",
                    }}
                >

                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

                        <strong>
                            Notifications
                        </strong>

                        {notifications.length > 0 && (

                            <button
                                className="btn btn-sm btn-light"
                                onClick={handleMarkAll}
                            >
                                <FaCheckDouble className="me-1" />
                                Mark All
                            </button>

                        )}

                    </div>

                    <div className="list-group list-group-flush">

                        {notifications.length === 0 ? (

                            <div className="text-center p-4 text-muted">

                                No notifications available.

                            </div>

                        ) : (

                            notifications.map((notification) => (

                                <div
                                    key={notification.id}
                                    className={`list-group-item ${
                                        notification.is_read == 0
                                            ? "bg-light"
                                            : ""
                                    }`}
                                >

                                    <div className="d-flex justify-content-between">

                                        <div>

                                            <div className="fw-semibold">

                                                {notification.title}

                                            </div>

                                            <small className="text-muted">

                                                {notification.message}

                                            </small>

                                            <br />

                                            <small className="text-secondary">

                                                {notification.created_at}

                                            </small>

                                        </div>

                                        {notification.is_read == 0 && (

                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() =>
                                                    handleRead(notification.id)
                                                }
                                            >
                                                <FaCheck />
                                            </button>

                                        )}

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}

export default NotificationBell;