import { useEffect, useState } from "react";

import {
    getSystemSettings,
    updateSystemSetting,
    getAdminProfile,
    updateAdminProfile,
} from "../../../services/settingsService";

import {
    FaCog,
    FaBell,
    FaGraduationCap,
    FaQrcode,
    FaLock,
    FaUser,
    FaChevronRight,
} from "react-icons/fa";

import "../../../css/Settings.css";

function Settings() {

    /* ============================================================
       SECTION
    ============================================================ */

    const [activeSection, setActiveSection] = useState("general");


    /* ============================================================
       SYSTEM SETTINGS
    ============================================================ */

    const [settings, setSettings] = useState([]);

    const [loadingSettings, setLoadingSettings] = useState(true);

    const [savingSetting, setSavingSetting] = useState(false);

    const [editingSetting, setEditingSetting] = useState(null);

    const [editValue, setEditValue] = useState("");

    const [saveMessage, setSaveMessage] = useState("");

    const [saveError, setSaveError] = useState("");


    /* ============================================================
       ADMIN PROFILE
    ============================================================ */

    const [profile, setProfile] = useState({
        id: "",
        role_id: "",
        role_name: "",
        full_name: "",
        email: "",
        gender: "",
        profile_photo: "",
        is_active: 1,
        email_verified: 0,
        last_login: "",
    });

    const [loadingProfile, setLoadingProfile] = useState(false);

    const [profileEditing, setProfileEditing] = useState(false);

    const [profileForm, setProfileForm] = useState({
        full_name: "",
        email: "",
    });

    const [savingProfile, setSavingProfile] = useState(false);

    const [profileMessage, setProfileMessage] = useState("");

    const [profileError, setProfileError] = useState("");


    /* ============================================================
       LOAD SYSTEM SETTINGS
    ============================================================ */

    useEffect(() => {

        const loadSettings = async () => {

            try {

                setLoadingSettings(true);

                setSaveError("");

                const response = await getSystemSettings();

                console.log(
                    "SETTINGS RESPONSE:",
                    response
                );

                if (
                    response &&
                    response.success &&
                    Array.isArray(response.data)
                ) {

                    setSettings(response.data);

                } else {

                    setSettings([]);

                    setSaveError(
                        response?.message ||
                        "Failed to load system settings."
                    );
                }

            } catch (error) {

                console.error(
                    "Failed to load settings:",
                    error
                );

                setSettings([]);

                setSaveError(
                    "Failed to load system settings."
                );

            } finally {

                setLoadingSettings(false);

            }

        };

        loadSettings();

    }, []);


    /* ============================================================
       SETTINGS SECTIONS
    ============================================================ */

    const settingsSections = [

        {
            id: "general",
            title: "General Settings",
            description:
                "Manage basic AttendX system information.",
            icon: <FaCog />,
        },

        {
            id: "academic",
            title: "Academic Settings",
            description:
                "Configure academic years, semesters and study details.",
            icon: <FaGraduationCap />,
        },

        {
            id: "notifications",
            title: "Notification Settings",
            description:
                "Control system notification preferences.",
            icon: <FaBell />,
        },

        {
            id: "attendance",
            title: "Attendance Settings",
            description:
                "Configure QR attendance and attendance rules.",
            icon: <FaQrcode />,
        },

        {
            id: "security",
            title: "Security Settings",
            description:
                "Manage system security and login preferences.",
            icon: <FaLock />,
        },

        {
            id: "profile",
            title: "Admin Profile",
            description:
                "Manage your administrator account information.",
            icon: <FaUser />,
        },

    ];


    /* ============================================================
       ACTIVE SECTION DATA
    ============================================================ */

    const activeSectionData = settingsSections.find(
        (section) =>
            section.id === activeSection
    );


    /* ============================================================
       GET SETTING VALUE
    ============================================================ */

    const getSetting = (key) => {

        const setting = settings.find(
            (item) =>
                item.setting_key === key
        );

        return setting
            ? setting.setting_value
            : "";
    };


    /* ============================================================
       START EDITING SETTING
    ============================================================ */

    const startEditing = (key) => {

        setEditingSetting(key);

        setEditValue(
            getSetting(key)
        );

        setSaveMessage("");

        setSaveError("");

    };


    /* ============================================================
       CANCEL SETTING EDIT
    ============================================================ */

    const cancelEditing = () => {

        setEditingSetting(null);

        setEditValue("");

        setSaveMessage("");

        setSaveError("");

    };


    /* ============================================================
       SAVE SYSTEM SETTING
    ============================================================ */

    const saveSetting = async () => {

        if (!editingSetting) {
            return;
        }

        if (
            editValue === null ||
            String(editValue).trim() === ""
        ) {

            setSaveError(
                "Setting value cannot be empty."
            );

            return;
        }

        try {

            setSavingSetting(true);

            setSaveMessage("");

            setSaveError("");

            const valueToSave =
                String(editValue).trim();

            const response =
                await updateSystemSetting(
                    editingSetting,
                    valueToSave
                );

            console.log(
                "UPDATE SETTING RESPONSE:",
                response
            );

            if (
                response &&
                response.success
            ) {

                setSettings(
                    (previousSettings) =>
                        previousSettings.map(
                            (setting) =>
                                setting.setting_key ===
                                editingSetting
                                    ? {
                                        ...setting,
                                        setting_value:
                                            valueToSave,
                                    }
                                    : setting
                        )
                );

                setEditingSetting(null);

                setEditValue("");

                setSaveMessage(
                    response.message ||
                    "Setting updated successfully."
                );

            } else {

                setSaveError(
                    response?.message ||
                    "Failed to update setting."
                );

            }

        } catch (error) {

            console.error(
                "Failed to update setting:",
                error
            );

            setSaveError(
                "Unable to update setting."
            );

        } finally {

            setSavingSetting(false);

        }

    };


    /* ============================================================
       RENDER NORMAL SETTING INPUT
    ============================================================ */

    const renderSettingInput = (
        key,
        type = "text",
        unit = null
    ) => {

        const isEditing =
            editingSetting === key;

        return (

            <div className="input-group">

                <input
                    type={type}
                    className="form-control"
                    value={
                        isEditing
                            ? editValue
                            : getSetting(key)
                    }
                    readOnly={!isEditing}
                    onChange={(event) =>
                        setEditValue(
                            event.target.value
                        )
                    }
                />

                {unit && (

                    <span className="input-group-text">
                        {unit}
                    </span>

                )}

                {isEditing ? (

                    <>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={saveSetting}
                            disabled={savingSetting}
                        >

                            {savingSetting
                                ? "Saving..."
                                : "Save"}

                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={cancelEditing}
                            disabled={savingSetting}
                        >

                            Cancel

                        </button>

                    </>

                ) : (

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() =>
                            startEditing(key)
                        }
                    >

                        Edit

                    </button>

                )}

            </div>

        );

    };


    /* ============================================================
       LOAD ADMIN PROFILE
    ============================================================ */

    const loadAdminProfile = async () => {

        try {

            setLoadingProfile(true);

            setProfileError("");

            setProfileMessage("");

            const response =
                await getAdminProfile();

            console.log(
                "ADMIN PROFILE RESPONSE:",
                response
            );

            if (
                response &&
                response.success &&
                response.data
            ) {

                const profileData =
                    response.data;

                setProfile({
                    id: profileData.id || "",
                    role_id:
                        profileData.role_id || "",
                    role_name:
                        profileData.role_name ||
                        profileData.role ||
                        "",
                    full_name:
                        profileData.full_name ||
                        "",
                    email:
                        profileData.email ||
                        "",
                    gender:
                        profileData.gender ||
                        "",
                    profile_photo:
                        profileData.profile_photo ||
                        "",
                    is_active:
                        profileData.is_active ?? 1,
                    email_verified:
                        profileData.email_verified ?? 0,
                    last_login:
                        profileData.last_login ||
                        "",
                });

                setProfileForm({
                    full_name:
                        profileData.full_name ||
                        "",

                    email:
                        profileData.email ||
                        "",
                });

            } else {

                setProfileError(
                    response?.message ||
                    "Failed to load administrator profile."
                );

            }

        } catch (error) {

            console.error(
                "Failed to load admin profile:",
                error
            );

            setProfileError(
                "Failed to load administrator profile."
            );

        } finally {

            setLoadingProfile(false);

        }

    };


    /* ============================================================
       LOAD PROFILE WHEN PROFILE SECTION IS OPENED
    ============================================================ */

    useEffect(() => {

        if (
            activeSection === "profile"
        ) {

            loadAdminProfile();

        }

    }, [activeSection]);


    /* ============================================================
       SAVE ADMIN PROFILE
    ============================================================ */

    const handleSaveProfile = async () => {

        const fullName =
            profileForm.full_name.trim();

        const email =
            profileForm.email.trim();


        if (fullName === "") {

            setProfileError(
                "Full name cannot be empty."
            );

            return;
        }


        if (email === "") {

            setProfileError(
                "Email address cannot be empty."
            );

            return;
        }


        try {

            setSavingProfile(true);

            setProfileMessage("");

            setProfileError("");


            const response =
                await updateAdminProfile({
                    full_name: fullName,
                    email: email,
                });


            console.log(
                "UPDATE PROFILE RESPONSE:",
                response
            );


            if (
                response &&
                response.success
            ) {

                setProfile(
                    (previousProfile) => ({
                        ...previousProfile,

                        full_name:
                            fullName,

                        email:
                            email,
                    })
                );


                setProfileForm({
                    full_name:
                        fullName,

                    email:
                        email,
                });


                setProfileEditing(false);


                setProfileMessage(
                    response.message ||
                    "Profile updated successfully."
                );

            } else {

                setProfileError(
                    response?.message ||
                    "Failed to update profile."
                );

            }

        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );

            setProfileError(
                "Failed to update administrator profile."
            );

        } finally {

            setSavingProfile(false);

        }

    };


    /* ============================================================
       CANCEL PROFILE EDIT
    ============================================================ */

    const cancelProfileEdit = () => {

        setProfileForm({

            full_name:
                profile.full_name ||
                "",

            email:
                profile.email ||
                "",

        });

        setProfileEditing(false);

        setProfileMessage("");

        setProfileError("");

    };


    /* ============================================================
       LOADING SYSTEM SETTINGS
    ============================================================ */

    if (loadingSettings) {

        return (

            <div className="settings-page">

                <div className="settings-header mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            Settings
                        </h2>

                        <p className="text-muted mb-0">
                            Loading system settings...
                        </p>

                    </div>

                </div>


                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >

                            <span className="visually-hidden">
                                Loading...
                            </span>

                        </div>


                        <p className="text-muted mt-3 mb-0">
                            Loading settings from database...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    /* ============================================================
       MAIN RENDER
    ============================================================ */

    return (

        <div className="settings-page">

            {/* ========================================================
                HEADER
            ======================================================== */}

            <div className="settings-header mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Settings
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your AttendX system preferences
                        and configuration.
                    </p>

                </div>

            </div>


            <div className="row g-4">


                {/* ====================================================
                    LEFT SETTINGS MENU
                ==================================================== */}

                <div className="col-lg-4">

                    <div className="card settings-menu-card border-0 shadow-sm">

                        <div className="card-body p-3">

                            {settingsSections.map(
                                (section) => (

                                    <button
                                        key={section.id}
                                        type="button"
                                        className={`settings-menu-item ${
                                            activeSection ===
                                            section.id
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => {

                                            setActiveSection(
                                                section.id
                                            );

                                            setEditingSetting(
                                                null
                                            );

                                            setEditValue("");

                                            setSaveMessage("");

                                            setSaveError("");

                                            setProfileMessage("");

                                            setProfileError("");

                                            if (
                                                section.id !==
                                                "profile"
                                            ) {

                                                setProfileEditing(
                                                    false
                                                );

                                            }

                                        }}
                                    >

                                        <div className="settings-menu-icon">
                                            {section.icon}
                                        </div>


                                        <div className="settings-menu-content">

                                            <div className="settings-menu-title">
                                                {section.title}
                                            </div>


                                            <div className="settings-menu-description">
                                                {section.description}
                                            </div>

                                        </div>


                                        <FaChevronRight
                                            className="settings-menu-arrow"
                                            size={13}
                                        />

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                </div>


                {/* ====================================================
                    RIGHT CONTENT
                ==================================================== */}

                <div className="col-lg-8">

                    <div className="card settings-content-card border-0 shadow-sm">

                        <div className="card-body p-4">


                            {/* ==================================================
                                CONTENT HEADER
                            ================================================== */}

                            <div className="settings-content-header">

                                <div className="settings-content-icon">
                                    {activeSectionData?.icon}
                                </div>


                                <div>

                                    <h4 className="fw-bold mb-1">
                                        {activeSectionData?.title}
                                    </h4>


                                    <p className="text-muted mb-0">
                                        {activeSectionData?.description}
                                    </p>

                                </div>

                            </div>


                            <hr className="my-4" />


                            {/* ==================================================
                                SYSTEM SETTING MESSAGE
                            ================================================== */}

                            {saveMessage && (

                                <div className="alert alert-success">
                                    {saveMessage}
                                </div>

                            )}


                            {saveError && (

                                <div className="alert alert-danger">
                                    {saveError}
                                </div>

                            )}


                            {/* ==================================================
                                GENERAL SETTINGS
                            ================================================== */}

                            {activeSection === "general" && (

                                <div>

                                    <h5 className="fw-bold mb-4">
                                        General Settings
                                    </h5>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            System Name
                                        </label>

                                        {renderSettingInput(
                                            "system_name"
                                        )}

                                        <small className="text-muted">
                                            Application name displayed
                                            throughout the AttendX system.
                                        </small>

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Default Timezone
                                        </label>

                                        {renderSettingInput(
                                            "default_timezone"
                                        )}

                                        <small className="text-muted">
                                            Default timezone used by
                                            the system.
                                        </small>

                                    </div>

                                </div>

                            )}


                            {/* ==================================================
                                ACADEMIC SETTINGS
                            ================================================== */}

                            {activeSection === "academic" && (

                                <div>

                                    <h5 className="fw-bold mb-4">
                                        Academic Settings
                                    </h5>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Current Academic Year
                                        </label>

                                        {renderSettingInput(
                                            "current_academic_year"
                                        )}

                                        <small className="text-muted">
                                            Current academic year used by
                                            the AttendX system.
                                        </small>

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Current Semester
                                        </label>

                                        <div className="input-group">

                                            <select
                                                className="form-select"
                                                value={
                                                    editingSetting ===
                                                    "current_semester"
                                                        ? editValue
                                                        : getSetting(
                                                            "current_semester"
                                                        )
                                                }
                                                disabled={
                                                    editingSetting !==
                                                    "current_semester"
                                                }
                                                onChange={(event) =>
                                                    setEditValue(
                                                        event.target.value
                                                    )
                                                }
                                            >

                                                <option value="">
                                                    Select Semester
                                                </option>

                                                <option value="Semester 1">
                                                    Semester 1
                                                </option>

                                                <option value="Semester 2">
                                                    Semester 2
                                                </option>

                                                <option value="Semester 3">
                                                    Semester 3
                                                </option>

                                            </select>


                                            {editingSetting ===
                                            "current_semester" ? (

                                                <>

                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={
                                                            saveSetting
                                                        }
                                                        disabled={
                                                            savingSetting
                                                        }
                                                    >
                                                        {savingSetting
                                                            ? "Saving..."
                                                            : "Save"}
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={
                                                            cancelEditing
                                                        }
                                                        disabled={
                                                            savingSetting
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={() =>
                                                        startEditing(
                                                            "current_semester"
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                            )}

                                        </div>

                                        <small className="text-muted">
                                            Current semester used for
                                            academic activities.
                                        </small>

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Current Year of Study
                                        </label>

                                        {renderSettingInput(
                                            "current_year_of_study",
                                            "number",
                                            "Year"
                                        )}

                                        <small className="text-muted">
                                            Current year of study used
                                            by the system.
                                        </small>

                                    </div>


                                    <div className="settings-info-box">

                                        <FaGraduationCap className="me-2" />

                                        <span>
                                            These settings determine the
                                            current academic context used
                                            by AttendX for courses,
                                            students, timetables and
                                            attendance.
                                        </span>

                                    </div>

                                </div>

                            )}


                            {/* ==================================================
                                NOTIFICATIONS
                            ================================================== */}

                            {activeSection === "notifications" && (

                                <div>

                                    <h5 className="fw-bold mb-4">
                                        Notification Settings
                                    </h5>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Email Notifications
                                        </label>


                                        <div className="input-group">

                                            <select
                                                className="form-select"
                                                value={
                                                    editingSetting ===
                                                    "enable_email_notifications"
                                                        ? editValue
                                                        : getSetting(
                                                            "enable_email_notifications"
                                                        )
                                                }
                                                disabled={
                                                    editingSetting !==
                                                    "enable_email_notifications"
                                                }
                                                onChange={(event) =>
                                                    setEditValue(
                                                        event.target.value
                                                    )
                                                }
                                            >

                                                <option value="true">
                                                    Enabled
                                                </option>

                                                <option value="false">
                                                    Disabled
                                                </option>

                                            </select>


                                            {editingSetting ===
                                            "enable_email_notifications" ? (

                                                <>

                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={
                                                            saveSetting
                                                        }
                                                        disabled={
                                                            savingSetting
                                                        }
                                                    >
                                                        {savingSetting
                                                            ? "Saving..."
                                                            : "Save"}
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={
                                                            cancelEditing
                                                        }
                                                        disabled={
                                                            savingSetting
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={() =>
                                                        startEditing(
                                                            "enable_email_notifications"
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                            )}

                                        </div>


                                        <small className="text-muted">
                                            Enable or disable email
                                            notifications.
                                        </small>

                                    </div>


                                    <div className="settings-info-box">

                                        <FaBell className="me-2" />

                                        <span>
                                            In-app notifications are
                                            currently handled by the
                                            AttendX notification system.
                                        </span>

                                    </div>

                                </div>

                            )}


                            {/* ==================================================
                                ATTENDANCE
                            ================================================== */}

                            {activeSection === "attendance" && (

                                <div>

                                    <h5 className="fw-bold mb-4">
                                        Attendance Settings
                                    </h5>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Attendance Window
                                        </label>

                                        {renderSettingInput(
                                            "attendance_window_minutes",
                                            "number",
                                            "Minutes"
                                        )}

                                        <small className="text-muted">
                                            QR attendance validity period.
                                        </small>

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            QR Refresh Interval
                                        </label>

                                        {renderSettingInput(
                                            "qr_refresh_seconds",
                                            "number",
                                            "Seconds"
                                        )}

                                        <small className="text-muted">
                                            QR code refresh interval.
                                        </small>

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Allow Late Attendance
                                        </label>


                                        <div className="input-group">

                                            <select
                                                className="form-select"
                                                value={
                                                    editingSetting ===
                                                    "allow_late_attendance"
                                                        ? editValue
                                                        : getSetting(
                                                            "allow_late_attendance"
                                                        )
                                                }
                                                disabled={
                                                    editingSetting !==
                                                    "allow_late_attendance"
                                                }
                                                onChange={(event) =>
                                                    setEditValue(
                                                        event.target.value
                                                    )
                                                }
                                            >

                                                <option value="true">
                                                    Allowed
                                                </option>

                                                <option value="false">
                                                    Not Allowed
                                                </option>

                                            </select>


                                            {editingSetting ===
                                            "allow_late_attendance" ? (

                                                <>

                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={
                                                            saveSetting
                                                        }
                                                        disabled={
                                                            savingSetting
                                                        }
                                                    >
                                                        {savingSetting
                                                            ? "Saving..."
                                                            : "Save"}
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={
                                                            cancelEditing
                                                        }
                                                        disabled={
                                                            savingSetting
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={() =>
                                                        startEditing(
                                                            "allow_late_attendance"
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                            )}

                                        </div>


                                        <small className="text-muted">
                                            Allow students to mark
                                            attendance after the normal
                                            attendance period.
                                        </small>

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Attendance GPS Radius
                                        </label>

                                        {renderSettingInput(
                                            "attendance_latitude_range",
                                            "number",
                                            "Meters"
                                        )}

                                        <small className="text-muted">
                                            Maximum allowed GPS radius
                                            for attendance.
                                        </small>

                                    </div>

                                </div>

                            )}


                            {/* ==================================================
                                SECURITY
                            ================================================== */}

                            {activeSection === "security" && (

                                <div>

                                    <h5 className="fw-bold mb-4">
                                        Security Settings
                                    </h5>


                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Maximum Login Attempts
                                        </label>

                                        {renderSettingInput(
                                            "max_login_attempts",
                                            "number",
                                            "Attempts"
                                        )}

                                        <small className="text-muted">
                                            Maximum number of failed
                                            login attempts allowed.
                                        </small>

                                    </div>


                                    <div className="settings-info-box">

                                        <FaLock className="me-2" />

                                        <span>
                                            Additional security options
                                            can be added later.
                                        </span>

                                    </div>

                                </div>

                            )}


                            {/* ==================================================
                                ADMIN PROFILE
                            ================================================== */}

                            {activeSection === "profile" && (

                                <div>

                                    <div className="d-flex justify-content-between align-items-center mb-4">

                                        <h5 className="fw-bold mb-0">
                                            Admin Profile
                                        </h5>


                                        {!profileEditing &&
                                        !loadingProfile && (

                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {

                                                    setProfileEditing(
                                                        true
                                                    );

                                                    setProfileForm({

                                                        full_name:
                                                            profile.full_name ||
                                                            "",

                                                        email:
                                                            profile.email ||
                                                            "",

                                                    });

                                                    setProfileMessage("");

                                                    setProfileError("");

                                                }}
                                            >
                                                Edit Profile
                                            </button>

                                        )}

                                    </div>


                                    {/* Profile Loading */}

                                    {loadingProfile ? (

                                        <div className="text-center py-5">

                                            <div
                                                className="spinner-border text-primary"
                                                role="status"
                                            >

                                                <span className="visually-hidden">
                                                    Loading...
                                                </span>

                                            </div>


                                            <p className="text-muted mt-3">
                                                Loading administrator
                                                profile...
                                            </p>

                                        </div>

                                    ) : (

                                        <>

                                            {/* Profile Success */}

                                            {profileMessage && (

                                                <div className="alert alert-success">
                                                    {profileMessage}
                                                </div>

                                            )}


                                            {/* Profile Error */}

                                            {profileError && (

                                                <div className="alert alert-danger">
                                                    {profileError}
                                                </div>

                                            )}


                                            {/* Full Name */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold">
                                                    Full Name
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        profileEditing
                                                            ? profileForm.full_name
                                                            : profile.full_name ||
                                                              ""
                                                    }
                                                    readOnly={
                                                        !profileEditing
                                                    }
                                                    onChange={(event) =>
                                                        setProfileForm(
                                                            {
                                                                ...profileForm,
                                                                full_name:
                                                                    event.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                />

                                            </div>


                                            {/* Email */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold">
                                                    Email Address
                                                </label>

                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={
                                                        profileEditing
                                                            ? profileForm.email
                                                            : profile.email ||
                                                              ""
                                                    }
                                                    readOnly={
                                                        !profileEditing
                                                    }
                                                    onChange={(event) =>
                                                        setProfileForm(
                                                            {
                                                                ...profileForm,
                                                                email:
                                                                    event.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                />

                                            </div>


                                            {/* Administrator ID */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold">
                                                    Administrator ID
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        profile.id ||
                                                        ""
                                                    }
                                                    readOnly
                                                />

                                                <small className="text-muted">
                                                    Administrator account ID.
                                                </small>

                                            </div>


                                            {/* Role ID */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold">
                                                    Role
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        profile.role_name ||
                                                        profile.role_id ||
                                                        ""
                                                    }
                                                    readOnly
                                                />

                                                <small className="text-muted">
                                                    Administrator role assigned
                                                    to this account.
                                                </small>

                                            </div>


                                            {/* Gender */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold">
                                                    Gender
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        profile.gender ||
                                                        ""
                                                    }
                                                    readOnly
                                                />

                                            </div>


                                            {/* Account Status */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold">
                                                    Account Status
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        Number(
                                                            profile.is_active
                                                        ) === 1
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                    readOnly
                                                />

                                            </div>


                                            {/* Email Verification */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold">
                                                    Email Verification
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        Number(
                                                            profile.email_verified
                                                        ) === 1
                                                            ? "Verified"
                                                            : "Not Verified"
                                                    }
                                                    readOnly
                                                />

                                            </div>


                                            {/* Last Login */}

                                            <div className="mb-4">

                                                <label className="form-label fw-semibold">
                                                    Last Login
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={
                                                        profile.last_login ||
                                                        "Never"
                                                    }
                                                    readOnly
                                                />

                                            </div>


                                            {/* Profile Buttons */}

                                            {profileEditing && (

                                                <div className="d-flex gap-2">

                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        disabled={
                                                            savingProfile
                                                        }
                                                        onClick={
                                                            handleSaveProfile
                                                        }
                                                    >

                                                        {savingProfile
                                                            ? "Saving..."
                                                            : "Save Changes"}

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        disabled={
                                                            savingProfile
                                                        }
                                                        onClick={
                                                            cancelProfileEdit
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            )}

                                        </>

                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Settings;