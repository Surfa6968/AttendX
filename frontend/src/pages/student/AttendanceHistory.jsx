import { useEffect, useMemo, useState } from "react";
import { getAttendanceHistory } from "../../services/studentAttendanceService";

function AttendanceHistory() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const response = await getAttendanceHistory();

      if (response.success) {
        setAttendance(response.data || []);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load attendance history.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.course_code.toLowerCase().includes(keyword) ||
        item.course_name.toLowerCase().includes(keyword) ||
        item.lecturer_name.toLowerCase().includes(keyword) ||
        item.session_date.includes(keyword)
      );
    });
  }, [attendance, search]);

  const total = attendance.length;

  const present = attendance.filter(
    (item) => item.attendance_status === "Present"
  ).length;

  const absent = attendance.filter(
    (item) => item.attendance_status === "Absent"
  ).length;

  const late = attendance.filter(
    (item) => item.attendance_status === "Late"
  ).length;

  const attendanceRate =
    total === 0 ? 0 : ((present + late) / total * 100).toFixed(1);

  if (loading) {
    return (
      <div className="container py-4">
        <h4>Loading attendance history...</h4>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <h2 className="mb-4">My Attendance History</h2>

      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card text-bg-primary shadow-sm">
            <div className="card-body text-center">
              <h3>{total}</h3>
              <p className="mb-0">Total Classes</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-bg-success shadow-sm">
            <div className="card-body text-center">
              <h3>{present}</h3>
              <p className="mb-0">Present</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-bg-warning shadow-sm">
            <div className="card-body text-center">
              <h3>{late}</h3>
              <p className="mb-0">Late</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-bg-danger shadow-sm">
            <div className="card-body text-center">
              <h3>{attendanceRate}%</h3>
              <p className="mb-0">Attendance Rate</p>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow">

        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Attendance Records</h5>

          <input
            type="text"
            className="form-control"
            style={{ width: "300px" }}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-hover mb-0">

            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Lecturer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Marked At</th>
              </tr>
            </thead>

            <tbody>

              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((item, index) => (
                  <tr key={item.attendance_id}>
                    <td>{index + 1}</td>
                    <td>{item.course_code}</td>
                    <td>{item.course_name}</td>
                    <td>{item.lecturer_name}</td>
                    <td>{item.session_date}</td>
                    <td>
                      {item.start_time} - {item.end_time}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          item.attendance_status === "Present"
                            ? "bg-success"
                            : item.attendance_status === "Late"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {item.attendance_status}
                      </span>
                    </td>
                    <td>{item.marked_at}</td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AttendanceHistory;