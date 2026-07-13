import { useAuth } from "../../context/AuthContext";

function StudentTopbar() {

    const { user } = useAuth();

    return (

        <div className="bg-white shadow-sm px-4 py-3">

            <div className="d-flex justify-content-between">

                <h3 className="text-primary">
                    AttendX Student Portal
                </h3>

                <div>

                    {user?.full_name}

                </div>

            </div>

        </div>

    );

}

export default StudentTopbar;