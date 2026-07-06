import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

    const { login, user } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "AttendX | Login";
    }, []);

    if (user) {

        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        if (user.role === "lecturer") {
            return <Navigate to="/lecturer/dashboard" replace />;
        }

        if (user.role === "student") {
            return <Navigate to="/student/dashboard" replace />;
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        setLoading(true);

        const response = await login(email, password);

        setLoading(false);

        if (!response.success) {
            setError(response.message);
        }

    };

    return (

        <div className="container-fluid vh-100">

            <div className="row h-100">

                {/* Left Side */}

                <div className="col-lg-7 d-none d-lg-flex bg-primary text-white align-items-center justify-content-center">

                    <div className="text-center">

                        <h1 className="display-3 fw-bold">

                            AttendX

                        </h1>

                        <h4 className="mt-4">

                            QR Code Attendance Management System

                        </h4>

                        <p className="mt-3">

                            Secure • Fast • Smart Attendance

                        </p>

                    </div>

                </div>

                {/* Right Side */}

                <div className="col-lg-5 d-flex align-items-center justify-content-center">

                    <div
                        className="card shadow-lg border-0"
                        style={{
                            width: "420px",
                            borderRadius: "20px"
                        }}
                    >

                        <div className="card-body p-5">

                            <h2 className="text-center fw-bold">

                                Sign In

                            </h2>

                            <p className="text-center text-muted mb-4">

                                Welcome back

                            </p>

                            {

                                error &&

                                <div className="alert alert-danger">

                                    {error}

                                </div>

                            }

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label className="form-label">

                                        Email Address

                                    </label>

                                    <input

                                        type="email"

                                        className="form-control"

                                        placeholder="Enter your email"

                                        value={email}

                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }

                                    />

                                </div>

                                <div className="mb-4">

                                    <label className="form-label">

                                        Password

                                    </label>

                                    <div className="input-group">

                                        <input

                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }

                                            className="form-control"

                                            placeholder="Enter password"

                                            value={password}

                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }

                                        />

                                        <button

                                            type="button"

                                            className="btn btn-outline-secondary"

                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }

                                        >

                                            {showPassword ? <FaEyeSlash /> : <FaEye />}

                                        </button>

                                    </div>

                                </div>

                                <button

                                    className="btn btn-primary w-100"

                                    disabled={loading}

                                >

                                    {

                                        loading

                                            ?

                                            <>

                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Signing In...

                                            </>

                                            :

                                            "Sign In"

                                    }

                                </button>

                            </form>

                            <hr className="my-4" />

                            <div className="text-center text-muted">

                                © 2026 AttendX

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;