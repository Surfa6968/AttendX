import { useEffect, useState } from "react";

import DashboardCard from "../../components/dashboard/DashboardCard";

import { getDashboardStats } from "../../services/dashboardService";

import {

FaUserGraduate,
FaChalkboardTeacher,
FaBook,
FaClipboardCheck

} from "react-icons/fa";

function Dashboard(){

const [stats,setStats]=useState({

students:0,
lecturers:0,
courses:0,
attendance:0

});

useEffect(()=>{

loadDashboard();

},[]);

const loadDashboard=async()=>{

try{

const res=await getDashboardStats();

setStats(res.data.data);

}
catch(err){

console.log(err);

}

};

return(

<div>

<h2 className="fw-bold mb-4">

Dashboard

</h2>

<div className="row">

<DashboardCard
title="Students"
value={stats.students}
icon={<FaUserGraduate />}
color="primary"
/>

<DashboardCard
title="Lecturers"
value={stats.lecturers}
icon={<FaChalkboardTeacher />}
color="success"
/>

<DashboardCard
title="Courses"
value={stats.courses}
icon={<FaBook />}
color="warning"
/>

<DashboardCard
title="Today's Attendance"
value={stats.attendance}
icon={<FaClipboardCheck />}
color="danger"
/>

</div>

</div>

);

}

export default Dashboard;