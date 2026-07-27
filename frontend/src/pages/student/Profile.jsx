import { useEffect, useRef, useState } from "react";

import {
    getStudentProfile,
    updateStudentProfile,
    uploadProfilePhoto,
    changePassword
} from "../../services/studentProfileService";

import "../../css/Profile.css"

function Profile() {

    const IMAGE_URL = "http://localhost/AttendX/backend";

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    const [editing, setEditing] = useState(false);

    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const personalInfoRef = useRef(null);
    const phoneInputRef = useRef(null);
    const accountSecurityRef = useRef(null);

    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        guardian_name: "",
        guardian_phone: ""
    });

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });

    /*
    |--------------------------------------------------------------------------
    | Load Profile
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const response = await getStudentProfile();

            if (response.success) {

                setProfile(response.data);

                setFormData({
                    phone: response.data.phone || "",
                    address: response.data.address || "",
                    guardian_name: response.data.guardian_name || "",
                    guardian_phone: response.data.guardian_phone || ""
                });

            }

        } catch (error) {

            console.error(error);

            alert("Failed to load profile.");

        } finally {

            setLoading(false);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSave = async () => {

        try {

            const response = await updateStudentProfile(formData);

            alert(response.message);

            if (response.success) {

                setEditing(false);

                loadProfile();

            }

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to update profile."

            );

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Upload Profile Photo
    |--------------------------------------------------------------------------
    */

    const handlePhotoChange = (e) => {

        if (e.target.files.length > 0) {

            setSelectedPhoto(e.target.files[0]);

        }

    };

    const handleUploadPhoto = async () => {

        if (!selectedPhoto) {

            alert("Please select an image.");

            return;

        }

        try {

            const response = await uploadProfilePhoto(selectedPhoto);

            alert(response.message);

            loadProfile();

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to upload image."

            );

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */

    const handlePasswordInput = (e) => {

        setPasswordData({

            ...passwordData,

            [e.target.name]: e.target.value

        });

    };

    const handleChangePassword = async () => {

        try {

            const response = await changePassword(passwordData);

            alert(response.message);

            if (response.success) {

                setPasswordData({

                    current_password: "",

                    new_password: "",

                    confirm_password: ""

                });

            }

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to change password."

            );

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Loading Screen
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                ></div>

                <h5>Loading Student Profile...</h5>

            </div>

        );

    }

    return (

        <div className="container py-4">
            {/* ====================================================== */}
            {/* Student Profile Header */}
            {/* ====================================================== */}
            <div className="card border-0 shadow-lg mb-4">
                <div
                    className="card-header text-white"
                    style={{
                        background: "linear-gradient(135deg,#0d6efd,#4f8ef7)"
                    }}
                >
                    <h3 className="mb-0">
                        🎓 Student Profile
                    </h3>
                </div>

                <div className="card-body p-4">
                    <div className="row align-items-center">

                        {/* Profile Image */}
                        <div className="col-lg-3 text-center">

                            <img
                                src={
                                    profile.profile_photo
                                        ? `${IMAGE_URL}/${profile.profile_photo}`
                                        : "https://via.placeholder.com/180"
                                }
                                alt="Profile"
                                className="rounded-circle shadow border border-4 border-white"
                                width="180"
                                height="180"
                                style={{
                                    objectFit: "cover"
                                }}
                            />

                            <div className="mt-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control mb-2"
                                    onChange={handlePhotoChange}
                                />

                                <button
                                    className="btn btn-primary w-100"
                                    onClick={handleUploadPhoto}
                                >
                                    <i className="bi bi-camera-fill me-2"></i>
                                    Upload Photo
                                </button>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="col-lg-9">
                            <div className="d-flex justify-content-between align-items-start flex-wrap">

                                <div>

                                    <h2 className="fw-bold mb-2">
                                        {profile.full_name}
                                    </h2>

                                    <div className="mb-3">

                                        <span className="badge bg-dark fs-6 me-2">
                                            {profile.registration_no}
                                        </span>

                                        <span
                                            className={`badge fs-6 ${
                                                profile.is_active == 1
                                                    ? "bg-success"
                                                    : "bg-danger"
                                            }`}
                                        >
                                            {profile.is_active == 1
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </div>

                                    <p className="text-muted mb-0">
                                        <i className="bi bi-envelope-fill me-2"></i>

                                        {profile.email}
                                    </p>

                                </div>

                                <button
                                    className={
                                        editing
                                            ? "btn btn-success"
                                            : "btn btn-outline-primary"
                                    }
                                    onClick={() => {

                                        if (editing) {

                                            handleSave();

                                        } else {

                                            setEditing(true);

                                            setTimeout(() => {

                                                personalInfoRef.current?.scrollIntoView({

                                                    behavior: "smooth",

                                                    block: "start"

                                                });

                                                phoneInputRef.current?.focus();

                                            }, 300);

                                        }

                                    }}
                                >
                                    <i
                                        className={`bi ${
                                            editing
                                                ? "bi-check-circle"
                                                : "bi-pencil-square"
                                        } me-2`}
                                    ></i>

                                    {editing
                                        ? "Save Profile"
                                        : "Edit Profile"}
                                </button>

                            </div>
                        </div>

                            <hr className="my-4" />

                            {/* ====================================================== */}
                            {/* Academic Information */}
                            {/* ====================================================== */}

                            <div className="card shadow border-0 mb-4">

                                <div className="card-header bg-success text-white">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">
                                            📚 Academic Information
                                        </h4>
                                    </div>

                                </div>

                                {/* Quick Academic Summary */}

                                <div className="row g-3">

                                    <div className="col-md-4">

                                        <div className="card border-0 shadow-sm h-100">

                                            <div className="card-body text-center">

                                                <i className="bi bi-building text-primary fs-1"></i>

                                                <h6 className="mt-3 text-muted">
                                                    Faculty
                                                </h6>

                                                <h5 className="fw-bold">
                                                    {profile.faculty_name}
                                                </h5>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="card border-0 shadow-sm h-100">

                                            <div className="card-body text-center">

                                                <i className="bi bi-diagram-3-fill text-success fs-1"></i>

                                                <h6 className="mt-3 text-muted">
                                                    Department
                                                </h6>

                                                <h5 className="fw-bold">
                                                    {profile.department_name}
                                                </h5>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="card border-0 shadow-sm h-100">

                                            <div className="card-body text-center">

                                                <i className="bi bi-calendar3 text-warning fs-1"></i>

                                                <h6 className="mt-3 text-muted">
                                                    Academic Year
                                                </h6>

                                                <h5 className="fw-bold">
                                                    {profile.academic_year}
                                                </h5>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="card border-0 shadow-sm h-100">

                                            <div className="card-body text-center">

                                                <i className="bi bi-mortarboard-fill text-danger fs-1"></i>

                                                <h6 className="mt-3 text-muted">
                                                    Year of Study
                                                </h6>

                                                <h4 className="fw-bold">
                                                    Year {profile.year_of_study}
                                                </h4>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="card border-0 shadow-sm h-100">

                                            <div className="card-body text-center">

                                                <i className="bi bi-journal-bookmark-fill text-info fs-1"></i>

                                                <h6 className="mt-3 text-muted">
                                                    Semester
                                                </h6>

                                                <h4 className="fw-bold">
                                                    Semester {profile.semester}
                                                </h4>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="col-md-4">

                                        <div className="card border-0 shadow-sm h-100 bg-primary text-white">

                                            <div className="card-body text-center">

                                                <i className="bi bi-book-half fs-1"></i>

                                                <h6 className="mt-3">
                                                    Assigned Courses
                                                </h6>

                                                <h2 className="fw-bold">
                                                    {profile.courses?.length || 0}
                                                </h2>

                                            </div>

                                        </div>

                                    </div>

                                    <h5 className="mb-3">
                                        Assigned Courses
                                    </h5>

                                    {profile.courses && profile.courses.length > 0 ? (

                                        <div className="row">

                                            {profile.courses.map((course) => (

                                                <div
                                                    key={course.id}
                                                    className="col-lg-6 mb-3"
                                                >

                                                    <div className="card border-primary shadow-sm h-100">

                                                        <div className="card-body">

                                                            <span className="badge bg-primary mb-2">

                                                                {course.course_code}

                                                            </span>

                                                            <h6 className="fw-bold">

                                                                {course.course_name}

                                                            </h6>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    ) : (

                                        <div className="alert alert-warning mb-0">

                                            No courses have been assigned yet.

                                        </div>

                                    )}

                                </div>

                            </div>

                            {/* ====================================================== */}
                            {/* Personal Information */}
                            {/* ====================================================== */}

                            <div
                                ref={personalInfoRef}
                                className="card shadow border-0 mb-4"
                            >

                                <div className="card-header bg-white">

                                    <div className="d-flex justify-content-between align-items-center">

                                        <h4 className="mb-0">
                                            👤 Personal Information
                                        </h4>

                                        {!editing ? (

                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => {

                                                    setEditing(true);

                                                    setTimeout(() => {

                                                        phoneInputRef.current?.focus();

                                                    }, 300);

                                                }}
                                            >

                                                <i className="bi bi-pencil-square me-2"></i>

                                                Edit Information

                                            </button>

                                        ) : (

                                            <div>

                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={handleSave}
                                                >

                                                    <i className="bi bi-check-circle me-2"></i>

                                                    Save

                                                </button>

                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => {

                                                        setEditing(false);

                                                        loadProfile();

                                                    }}
                                                >

                                                    Cancel

                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                                <div className="card-body">

                                    <div className="row">

                                        {/* Email */}

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label fw-semibold">
                                                University Email
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control bg-light"
                                                value={profile.email}
                                                disabled
                                            />

                                        </div>

                                        {/* Gender */}

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label fw-semibold">
                                                Gender
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control bg-light"
                                                value={profile.gender}
                                                disabled
                                            />

                                        </div>

                                        {/* Phone */}

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label fw-semibold">
                                                Mobile Number
                                            </label>

                                            <input
                                                ref={phoneInputRef}
                                                type="text"
                                                name="phone"
                                                className="form-control"
                                                value={editing ? formData.phone : profile.phone}
                                                disabled={!editing}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        {/* Guardian Phone */}

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label fw-semibold">
                                                Guardian Contact
                                            </label>

                                            <input
                                                type="text"
                                                name="guardian_phone"
                                                className="form-control"
                                                value={
                                                    editing
                                                        ? formData.guardian_phone
                                                        : profile.guardian_phone
                                                }
                                                disabled={!editing}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        {/* Guardian Name */}

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label fw-semibold">
                                                Guardian Name
                                            </label>

                                            <input
                                                type="text"
                                                name="guardian_name"
                                                className="form-control"
                                                value={
                                                    editing
                                                        ? formData.guardian_name
                                                        : profile.guardian_name
                                                }
                                                disabled={!editing}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        {/* Address */}

                                        <div className="col-md-6 mb-4">

                                            <label className="form-label fw-semibold">
                                                Permanent Address
                                            </label>

                                            <textarea
                                                rows="4"
                                                name="address"
                                                className="form-control"
                                                value={
                                                    editing
                                                        ? formData.address
                                                        : profile.address
                                                }
                                                disabled={!editing}
                                                onChange={handleChange}
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* ====================================================== */}
                            {/* Account Security */}
                            {/* ====================================================== */}

                            <div className="card shadow border-0 mb-4">

                                <div
                                    ref={accountSecurityRef}
                                    className="card-header bg-danger text-white"
                                >
                                    <h4 className="mb-0">
                                        🔒 Account Security
                                    </h4>
                                </div>

                                <div className="card-body">

                                    <div className="row">

                                        {/* Current Password */}

                                        <div className="col-md-4 mb-4">

                                            <label className="form-label fw-semibold">
                                                Current Password
                                            </label>

                                            <div className="input-group">

                                                <span className="input-group-text">
                                                    <i className="bi bi-lock-fill"></i>
                                                </span>

                                                <input
                                                    type="password"
                                                    name="current_password"
                                                    className="form-control"
                                                    value={passwordData.current_password}
                                                    onChange={handlePasswordInput}
                                                    placeholder="Current Password"
                                                />

                                            </div>

                                        </div>

                                        {/* New Password */}

                                        <div className="col-md-4 mb-4">

                                            <label className="form-label fw-semibold">
                                                New Password
                                            </label>

                                            <div className="input-group">

                                                <span className="input-group-text">
                                                    <i className="bi bi-key-fill"></i>
                                                </span>

                                                <input
                                                    type="password"
                                                    name="new_password"
                                                    className="form-control"
                                                    value={passwordData.new_password}
                                                    onChange={handlePasswordInput}
                                                    placeholder="New Password"
                                                />

                                            </div>

                                        </div>

                                        {/* Confirm Password */}

                                        <div className="col-md-4 mb-4">

                                            <label className="form-label fw-semibold">
                                                Confirm Password
                                            </label>

                                            <div className="input-group">

                                                <span className="input-group-text">
                                                    <i className="bi bi-shield-lock-fill"></i>
                                                </span>

                                                <input
                                                    type="password"
                                                    name="confirm_password"
                                                    className="form-control"
                                                    value={passwordData.confirm_password}
                                                    onChange={handlePasswordInput}
                                                    placeholder="Confirm Password"
                                                />

                                            </div>

                                        </div>

                                    </div>

                                    {/* Password Tips */}

                                    <div className="alert alert-info border-0">

                                        <h6 className="fw-bold">
                                            Password Requirements
                                        </h6>

                                        <ul className="mb-0">

                                            <li>Minimum 8 characters.</li>

                                            <li>Include uppercase and lowercase letters.</li>

                                            <li>Include at least one number.</li>

                                            <li>Include one special character.</li>

                                            <li>Never share your password.</li>

                                        </ul>

                                    </div>

                                    {/* Security Notice */}

                                    <div className="card bg-light border-0 mt-4">

                                        <div className="card-body">

                                            <h6 className="fw-bold text-primary">

                                                <i className="bi bi-info-circle-fill me-2"></i>

                                                Security Notice

                                            </h6>

                                            <p className="mb-0 text-muted">

                                                Your password is encrypted and securely stored.
                                                We recommend changing your password every semester
                                                to keep your account safe.

                                            </p>

                                        </div>

                                    </div>

                                    {/* Button */}

                                    <div className="text-end mt-4">

                                        <button
                                            className="btn btn-danger px-4"
                                            onClick={handleChangePassword}
                                        >

                                            <i className="bi bi-shield-lock-fill me-2"></i>

                                            Change Password

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                    

                </div>

            </div>



    );

}

export default Profile;