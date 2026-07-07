import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import LecturerDashboard from "./pages/lecturer/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import Unauthorized from "./pages/Unauthorized";

function App() {
    const { user } = useAuth();
    return (
        <Routes>
            {/* =======================
                Login
            ======================= */}
            <Route
                path="/login"
            element={
                    user
                        ? <Navigate to="/" replace />
                        : <Login />
                }
            />
            {/* =======================
                Home Redirect
            ======================= */}
            <Route
                path="/"
                element={
                    user
                        ? (
                            user.role === "admin"
                                ? <Navigate to="/admin/dashboard" replace />
                                : user.role === "lecturer"
                                    ? <Navigate to="/lecturer/dashboard" replace />
                                    : <Navigate to="/student/dashboard" replace />
                        )
                        : <Navigate to="/login" replace />
                }
            />
            {/* =======================
                Admin
            ======================= */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />
            </Route>
            {/* =======================
                Lecturer
            ======================= */}
            <Route
                path="/lecturer"
                element={
                    <ProtectedRoute allowedRoles={["lecturer"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="dashboard"
                    element={<LecturerDashboard />}
                />
            </Route>
            {/* =======================
                Student
            ======================= */}
            <Route
                path="/student"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="dashboard"
                    element={<StudentDashboard />}
                />
            </Route>
            {/* =======================
                Unauthorized
            ======================= */}
            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />
            {/* =======================
                404
            ======================= */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default App;