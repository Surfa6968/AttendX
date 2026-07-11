import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser, searchUsers } from "../../../services/userService";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaSave,
    FaTimes
} from "react-icons/fa";

function UserList() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) return;
        try {
            const res = await deleteUser(id);
            alert(res.message);
            loadUsers();
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to delete user."
            );
        }
    };

    const handleSearch = async (value) => {
       setKeyword(value);
       try {
              if (value.trim() === "") {
              loadUsers();
              return;
              }
              const res = await searchUsers(value);
              setUsers(res.data);
       } catch (err) {
              console.error(err);
       }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>User Management</h2>

                <div className="d-flex gap-2">
                    <div className="input-group" style={{ width: "500px" }}>
                        <span className="input-group-text">
                            <FaSearch />
                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users..."
                            value={keyword}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                     <Link
                      to="/admin/users/add"
                      className="btn btn-primary"
                     >
                      <FaPlus className="me-2" />Add User
                     </Link>

                </div>

            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Gender</th>
                                <th>Status</th>
                                <th width="180">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className="badge bg-info">
                                            {user.role_name}
                                        </span>
                                    </td>
                                    <td>{user.gender}</td>
                                    <td>
                                        {user.is_active == 1 ? (
                                            <span className="badge bg-success">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="badge bg-danger">
                                                Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td>

                                        <Link
                                            to={`/admin/users/edit/${user.id}`}
                                            className="btn btn-warning btn-sm me-2"
                                            title="Edit User"
                                        >
                                            <FaEdit className="me-1" />
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(user.id)}
                                            title="Delete User"
                                        >
                                            <FaTrash className="me-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserList;