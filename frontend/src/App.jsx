import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/Dashboard";
import UserList from "./pages/admin/users/UserList";
import AddUser from "./pages/admin/users/AddUser";
import EditUser from "./pages/admin/users/EditUser";
import FacultyList from "./pages/admin/faculties/FacultyList";
import AddFaculty from "./pages/admin/faculties/AddFaculty";
import EditFaculty from "./pages/admin/faculties/EditFaculty";
import DepartmentList from "./pages/admin/departments/DepartmentList";
import AddDepartment from "./pages/admin/departments/AddDepartment";
import EditDepartment from "./pages/admin/departments/EditDepartment";

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
                {/* Users */}
                <Route path="users" element={<UserList />} />
                <Route path="users/add" element={<AddUser />} />
                <Route path="users/edit/:id" element={<EditUser />} />

                {/* Faculties */}
                <Route path="faculties" element={<FacultyList />} />
                <Route path="faculties/add" element={<AddFaculty />} />
                <Route path="faculties/edit/:id" element={<EditFaculty />} />

                {/* Departments */}
                <Route path="departments" element={<DepartmentList />} />
                <Route path="departments/add" element={<AddDepartment />} />
                <Route path="departments/edit/:id" element={<EditDepartment />} />
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
                <Route path="dashboard" element={<LecturerDashboard />} />
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
                <Route path="dashboard" element={<StudentDashboard />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;