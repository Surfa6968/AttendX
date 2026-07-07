import {

ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid

} from "recharts";

function AttendanceChart(){

const data=[

{name:"Mon",attendance:80},
{name:"Tue",attendance:92},
{name:"Wed",attendance:88},
{name:"Thu",attendance:95},
{name:"Fri",attendance:90}

];

return(

<div className="card shadow-sm">

<div className="card-header">

<h5 className="mb-0">

Weekly Attendance

</h5>

</div>

<div className="card-body">

<ResponsiveContainer
width="100%"
height={300}
>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="attendance"
stroke="#0d6efd"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

);

}

export default AttendanceChart;