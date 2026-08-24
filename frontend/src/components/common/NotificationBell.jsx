import { useEffect, useRef, useState } from "react";

import {
    FaBell,
    FaCheck,
    FaCheckDouble,
    FaCalendarAlt,
    FaClipboardCheck,
    FaBook,
    FaInfoCircle,
    FaBullhorn,
    FaClock,
} from "react-icons/fa";

import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "../../services/notificationService";

import "../../css/NotificationBell.css";

function NotificationBell() {

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
                setNotifications(
                    Array.isArray(list.data)
                        ? list.data
                        : []
                );
            }

            if (count.success) {
                setUnreadCount(
                    Number(count.data?.unread_count || 0)
                );
            }

        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadNotifications();

        const interval = setInterval(
            loadNotifications,
            30000
        );

        return () => clearInterval(interval);

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Close Outside
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
    | Mark Notification Read
    |--------------------------------------------------------------------------
    */

    const handleRead = async (id) => {

        try {

            const res = await markAsRead(id);

            if (res.success) {

                await loadNotifications();

            }

        } catch (error) {

            console.error(
                "Failed to mark notification:",
                error
            );

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Mark All
    |--------------------------------------------------------------------------
    */

    const handleMarkAll = async () => {

        try {

            const res = await markAllAsRead();

            if (res.success) {

                await loadNotifications();

            }

        } catch (error) {

            console.error(
                "Failed to mark all notifications:",
                error
            );

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Notification Icon
    |--------------------------------------------------------------------------
    */

    const getNotificationIcon = (type) => {

        switch (type) {

            case "Attendance":
                return (
                    <FaClipboardCheck />
                );

            case "Course":
                return (
                    <FaBook />
                );

            case "Reminder":
                return (
                    <FaClock />
                );

            case "Announcement":
                return (
                    <FaBullhorn />
                );

            case "Timetable":
                return (
                    <FaCalendarAlt />
                );

            default:
                return (
                    <FaInfoCircle />
                );

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Notification Color
    |--------------------------------------------------------------------------
    */

    const getNotificationColor = (type) => {

        switch (type) {

            case "Attendance":
                return "#16a34a";

            case "Course":
                return "#2563eb";

            case "Reminder":
                return "#f59e0b";

            case "Announcement":
                return "#7c3aed";

            case "Timetable":
                return "#0891b2";

            default:
                return "#64748b";

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Relative Time
    |--------------------------------------------------------------------------
    */

    const getRelativeTime = (date) => {

        const now = new Date();
        const created = new Date(date);

        const seconds = Math.floor(
            (now - created) / 1000
        );

        if (seconds < 60) {
            return "Just now";
        }

        const minutes = Math.floor(
            seconds / 60
        );

        if (minutes < 60) {
            return `${minutes} min ago`;
        }

        const hours = Math.floor(
            minutes / 60
        );

        if (hours < 24) {
            return `${hours} hr ago`;
        }

        const days = Math.floor(
            hours / 24
        );

        if (days < 7) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
        }

        return created.toLocaleDateString();

    };

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="position-relative"
            ref={dropdownRef}
            onMouseEnter={() => {
                setOpen(true);
                loadNotifications();
            }}
            onMouseLeave={() => {
                setOpen(false);
            }}
        >

            {/* ============================================================
                Notification Bell
            ============================================================ */}

<button
    type="button"
    className="btn btn-light rounded-circle shadow-sm position-relative"
    onClick={() => {
        setOpen(!open);
        loadNotifications();
    }}
>
    <FaBell size={18} />

    {unreadCount > 0 && (
        <span
            style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                minWidth: "22px",
                height: "22px",
                padding: "0 6px",
                borderRadius: "50%",
                backgroundColor: "#dc3545",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
                zIndex: 10,
            }}
        >
            {unreadCount > 99 ? "99+" : unreadCount}
        </span>
    )}
</button>


            {/* ============================================================
                Notification Panel
            ============================================================ */}

            {open && (

                <div className="notification-dropdown position-absolute end-0 mt-2">

                    {/* Header */}

                    <div className="notification-header">

                        <div>

                            <div className="notification-title">

                                Notifications

                            </div>

                            <div className="notification-subtitle">

                                {unreadCount > 0
                                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                                    : "You're all caught up"
                                }

                            </div>

                        </div>


                        {unreadCount > 0 && (

                            <button
                                type="button"
                                className="mark-all-button"
                                onClick={handleMarkAll}
                            >

                                <FaCheckDouble />

                                Mark all

                            </button>

                        )}

                    </div>


                    {/* Notification List */}

                    <div className="notification-list">

                        {notifications.length === 0 ? (

                            <div className="notification-empty">

                                <div className="empty-icon">

                                    <FaBell />

                                </div>

                                <h6>
                                    No notifications
                                </h6>

                                <p>
                                    You're all caught up.
                                </p>

                            </div>

                        ) : (

                            notifications.map(
                                (notification) => {

                                    const unread =
                                        Number(
                                            notification.is_read
                                        ) === 0;

                                    const iconColor =
                                        getNotificationColor(
                                            notification.notification_type
                                        );

                                    return (

                                        <div
                                            key={notification.id}
                                            className={`notification-item ${
                                                unread
                                                    ? "notification-unread"
                                                    : ""
                                            }`}
                                            onClick={() => {

                                                if (unread) {

                                                    handleRead(
                                                        notification.id
                                                    );

                                                }

                                            }}
                                        >

                                            {/* Icon */}

                                            <div
                                                className="notification-icon"
                                                style={{
                                                    backgroundColor:
                                                        `${iconColor}15`,
                                                    color:
                                                        iconColor,
                                                }}
                                            >

                                                {
                                                    getNotificationIcon(
                                                        notification.notification_type
                                                    )
                                                }

                                            </div>


                                            {/* Content */}

                                            <div className="notification-content">

                                                <div className="notification-item-top">

                                                    <div className="notification-item-title">

                                                        {
                                                            notification.title
                                                        }

                                                    </div>

                                                    {unread && (

                                                        <span className="unread-dot"></span>

                                                    )}

                                                </div>


                                                <div className="notification-message">

                                                    {
                                                        notification.message
                                                    }

                                                </div>


                                                <div className="notification-time">

                                                    <FaClock
                                                        size={11}
                                                    />

                                                    {
                                                        getRelativeTime(
                                                            notification.created_at
                                                        )
                                                    }

                                                </div>

                                            </div>


                                            {/* Read Button */}

                                            {unread && (

                                                <button
                                                    type="button"
                                                    className="notification-read-button"
                                                    title="Mark as read"
                                                    onClick={(event) => {

                                                        event.stopPropagation();

                                                        handleRead(
                                                            notification.id
                                                        );

                                                    }}
                                                >

                                                    <FaCheck />

                                                </button>

                                            )}

                                        </div>

                                    );

                                }
                            )

                        )}

                    </div>


                    {/* Footer */}

                    {notifications.length > 0 && (

                        <div className="notification-footer">

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                            >

                                View all notifications

                            </button>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}

export default NotificationBell;