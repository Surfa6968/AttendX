import { Outlet } from "react-router-dom";

function DashboardLayout() {

    return (

        <div className="container-fluid">

            <Outlet />

        </div>

    );

}

export default DashboardLayout;