import { useEffect, useState } from "react";
import { getStudentTimetable } from "../../services/studentTimetableService";

function Timetable() {

    const [timetable, setTimetable] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadTimetable();

    }, []);

    const loadTimetable = async () => {

        try {

            const response = await getStudentTimetable();

            if (response.success) {

                setTimetable(response.data);

            }

        } catch (error) {

            console.error(error);

            alert("Failed to load timetable.");

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="container py-4">

                <h4>Loading Timetable...</h4>

            </div>

        );

    }

    const formatTime = (time) => {

       return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
       });

    };
    return (

        <div className="container-fluid py-4">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">

                    <h3 className="mb-0">

                        📅 My Timetable

                    </h3>

                </div>

                <div className="card-body">

                    {timetable.length === 0 ? (

                        <div className="alert alert-info text-center">

                            No timetable available.

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover table-bordered align-middle">

                                <thead className="table-dark">

                                    <tr>

                                        <th>Day</th>

                                        <th>Course Code</th>

                                        <th>Course Name</th>

                                        <th>Lecturer</th>

                                        <th>Time</th>

                                        <th>Room</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {timetable.map((item) => (

                                        <tr key={item.id}>

                                            <td>

                                                <span className="badge bg-primary">

                                                    {item.day_of_week}

                                                </span>

                                            </td>

                                            <td>

                                                {item.course_code}

                                            </td>

                                            <td>

                                                {item.course_name}

                                            </td>

                                            <td>

                                                {item.lecturer_name}

                                            </td>

                                            <td>

                                                {item.start_time}

                                                {" - "}

                                                {item.end_time}

                                            </td>

                                            <td>

                                                {item.room}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Timetable;