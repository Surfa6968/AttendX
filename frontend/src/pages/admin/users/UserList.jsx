import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../../../services/userService";

function UserList() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

        try {

            const res = await getUsers();

            setUsers(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

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

                <Link
                    to="/admin/users/add"
                    className="btn btn-primary"
                >
                    + Add User
                </Link>

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

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                users.map((user) => (

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

                                            {

                                                user.is_active == 1

                                                ?

                                                <span className="badge bg-success">

                                                    Active

                                                </span>

                                                :

                                                <span className="badge bg-danger">

                                                    Disabled

                                                </span>

                                            }

                                        </td>

                                        <td>

                                            <button className="btn btn-sm btn-warning me-2">

                                                Edit

                                            </button>

                                            <button className="btn btn-sm btn-danger">

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default UserList;