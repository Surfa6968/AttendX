import { useEffect,  useRef, useState } from "react";

import {
    getStudentProfile,
    updateStudentProfile,
    uploadProfilePhoto,
    changePassword
} from "../../services/studentProfileService";

function Profile() {

    const IMAGE_URL = "http://localhost/AttendX/backend";

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

    useEffect(() => {
        loadProfile();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Load Profile
    |--------------------------------------------------------------------------
    */
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
        }
        catch (error) {
            console.error(error);
            alert("Failed to load profile.");
        }

        finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Profile Form
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
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Upload Photo
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
        }
        catch (error) {
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
                alert(response.message);
                setPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_password: ""
                });
            }
        }
        catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to change password."
            );
        }
    };
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <h4>Loading Profile...</h4>
            </div>
        );
    }
    return (
       <div className="container py-4">

       {/* ====================================================== */}
       {/* Profile Summary Card */}
       {/* ====================================================== */}

       <div className="card shadow border-0 mb-4">
              <div className="card-body">
                     <div className="row align-items-center">

                            {/* Left Side - Profile Photo */}
                            <div className="col-lg-3 text-center">
                                   <img
                                          src={
                                                 profile.profile_photo
                                                 ? `${IMAGE_URL}/${profile.profile_photo}`
                                                 : "https://via.placeholder.com/180"
                                          }
                                          alt="Profile"
                                          className="rounded-circle border shadow"
                                          width="180"
                                          height="180"
                                          style={{
                                                 objectFit: "cover"
                                          }}
                                   />

                                   <div className="mt-3">
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
                                                 Upload Photo
                                          </button>
                                   </div>
                            </div>

                            {/* Right Side - Student Information */}
                            <div className="col-lg-9">
                                   <div className="d-flex justify-content-between align-items-start">
                                          <div>
                                                 <h2 className="fw-bold mb-1">
                                                        {profile.full_name}
                                                 </h2>

                                                 <p className="text-muted mb-4"> 
                                                        Registration No :
                                                        <strong> 
                                                               {" "} 
                                                               {profile.registration_no}
                                                        </strong>
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
                                                 {editing ? "Save" : "Edit Profile"}
                                          </button>
                                   </div>

                                   <div className="row">
                                          <div className="col-md-6 mb-3">
                                                 <small className="text-muted"> Faculty </small>

                                                 <h6> {profile.faculty_name} </h6>
                                          </div>

                                          <div className="col-md-6 mb-3"> 
                                                 <small className="text-muted"> Department </small>

                                                 <h6> {profile.department_name} </h6>
                                          </div>

                                          <div className="col-md-6 mb-3">
                                                 <small className="text-muted">  Year of Study </small>

                                                 <h6> {profile.year_of_study} </h6>
                                          </div>

                                          <div className="col-md-6 mb-3">
                                                 <small className="text-muted"> Semester </small>

                                                 <h6> {profile.semester} </h6>
                                          </div>

                                          <div className="col-md-6 mb-3">
                                                 <small className="text-muted"> Academic Year </small>

                                                 <h6> {profile.academic_year} </h6>
                                          </div>

                                          <div className="col-md-6 mb-3">
                                                 <small className="text-muted"> Status </small>

                                                 <br />

                                                 {profile.is_active == 1 ? (
                                                        <span className="badge bg-success">
                                                               Active
                                                        </span>
                                                 ) : (
                                                        <span className="badge bg-danger">
                                                               Inactive
                                                        </span>
                                                 )}
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       </div>

    {/* ====================================================== */}
    {/* Personal Information */}
    {/* ====================================================== */}

    <div ref={personalInfoRef} className="card shadow border-0 mb-4">
        <div className="card-header bg-white">
           <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                     👤 Personal Information
              </h4>

              <button
                     type="button"
                     className="btn btn-outline-danger btn-sm"
                     onClick={() => {
                            accountSecurityRef.current?.scrollIntoView({
                                   behavior: "smooth",
                                   block: "start"
                            });
                     }}
              >
                     🔒 Change Password 
              </button>
          </div>
        </div>

        <div className="card-body">
            <div className="row">

                {/* Email */}
                <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                        Email
                    </label>

                    <input
                        type="text"
                        className="form-control"
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
                        className="form-control"
                        value={profile.gender}
                        disabled
                    />
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                        Phone Number
                    </label>

                    <input
                        type="text"
                        name="phone"
                        ref={phoneInputRef}
                        className="form-control"
                        value={editing ? formData.phone : profile.phone}
                        disabled={!editing}
                        onChange={handleChange}
                    />
                </div>

                {/* Guardian Phone */}
                <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">
                        Guardian Phone
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
                        Address
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

            {
                editing && (
                    <div className="text-end">
                        <button
                            className="btn btn-success me-2"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={() => {

                                setEditing(false);
                                loadProfile();

                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )
            }
        </div>
    </div>

    {/* ====================================================== */}
    {/* Account Security */}
    {/* ====================================================== */}

    <div className="card shadow border-0">
       <div ref={accountSecurityRef} className="card-header bg-danger text-white">
            <h4 className="mb-0"> 🔒 Account Security </h4>
       </div>

       <div className="card-body">
              <p className="text-muted">
                Keep your account secure by using a strong password.
              </p>

              <div className="row">
                     <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                   Current Password
                            </label>

                            <input
                                   type="password"
                                   name="current_password"
                                   className="form-control"
                                   value={passwordData.current_password}
                                   onChange={handlePasswordInput}
                                   placeholder="Current Password"
                            />
                     </div>

                     <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                   New Password
                            </label>

                            <input
                                   type="password"
                                   name="new_password"
                                   className="form-control"
                                   value={passwordData.new_password}
                                   onChange={handlePasswordInput}
                                   placeholder="New Password"
                            />
                     </div>

                     <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                   Confirm Password
                            </label>

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

              <div className="alert alert-light border mt-2">
                     <strong>Password Tips</strong>
                     <ul className="mb-0 mt-2">
                     <li>Use at least 8 characters.</li>
                     <li>Include uppercase and lowercase letters.</li>
                     <li>Include numbers and symbols.</li>
                     <li>Do not share your password with anyone.</li>
                     </ul>
              </div>

              <div className="text-end mt-3">
                     <button
                     className="btn btn-danger px-4"
                     onClick={handleChangePassword}
                     >
                     🔒 Change Password
                     </button>
              </div>
       </div>
    </div>
</div>
);
}

export default Profile;