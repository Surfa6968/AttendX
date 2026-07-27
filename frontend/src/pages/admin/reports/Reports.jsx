import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    FaClipboardCheck,
    FaSearch,
    FaCheckCircle,
    FaTimesCircle,
    FaChartLine,
    FaFilePdf,
    FaFileExcel,
    FaPrint,
} from "react-icons/fa";

import {
    getDashboardStatistics,
    getAttendanceReport,
} from "../../../services/reportService";

function Reports() {

    /*
    |--------------------------------------------------------------------------
    | Auth
    |--------------------------------------------------------------------------
    */

    const { user } = useAuth();

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);

    const [attendance, setAttendance] = useState([]);

    const [stats, setStats] = useState({
        totalAttendance: 0,
        presentToday: 0,
        absentToday: 0,
        attendanceRate: 0,
    });

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [dateFrom, setDateFrom] = useState("");

    const [dateTo, setDateTo] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Load Dashboard
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const [dashboard, report] = await Promise.all([
                getDashboardStatistics(),
                getAttendanceReport(),
            ]);

            if (dashboard.success) {
                setStats(dashboard.data);
            }

            if (report.success) {
                setAttendance(report.data);
            }

        } catch (error) {

            console.error(error);

            alert("Failed to load reports.");

        } finally {

            setLoading(false);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Filtered Attendance
    |--------------------------------------------------------------------------
    */

    const filteredAttendance = attendance.filter((item) => {

        const keyword = search.toLowerCase();

        const matchesSearch =
            (item.student_name || "").toLowerCase().includes(keyword) ||
            (item.registration_no || "").toLowerCase().includes(keyword) ||
            (item.course_name || "").toLowerCase().includes(keyword) ||
            (item.course_code || "").toLowerCase().includes(keyword) ||
            (item.lecturer_name || "").toLowerCase().includes(keyword);

        const matchesStatus =
            statusFilter === "" ||
            item.attendance_status === statusFilter;

        const matchesFrom =
            dateFrom === "" ||
            item.session_date >= dateFrom;

        const matchesTo =
            dateTo === "" ||
            item.session_date <= dateTo;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesFrom &&
            matchesTo
        );

    });

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Export Excel
    |--------------------------------------------------------------------------
    */

     const exportExcel = () => {

       if (filteredAttendance.length === 0) {
              alert("No attendance records found.");
              return;
       }

       const worksheet = XLSX.utils.json_to_sheet(
              filteredAttendance.map((item) => ({
              Student: item.student_name,
              "Registration No": item.registration_no,
              "Course Code": item.course_code,
              "Course Name": item.course_name,
              Lecturer: item.lecturer_name,
              Date: item.session_date,
              "Scanned Time": item.scanned_at ? new Date(item.scanned_at).toLocaleTimeString() : "-",           Status: item.attendance_status,
              }))
       );

       // Column Widths
       worksheet["!cols"] = [
              { wch: 25 },
              { wch: 20 },
              { wch: 15 },
              { wch: 30 },
              { wch: 25 },
              { wch: 15 },
              { wch: 18 },
              { wch: 12 },
       ];

       const workbook = XLSX.utils.book_new();

       XLSX.utils.book_append_sheet(
              workbook,
              worksheet,
              "Attendance Report"
       );

       const excelBuffer = XLSX.write(workbook, {
              bookType: "xlsx",
              type: "array",
       });

       const blob = new Blob(
              [excelBuffer],
              {
              type:
                     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              }
       );

       saveAs(
              blob,
              `Attendance_Report_${new Date()
              .toISOString()
              .slice(0, 10)}.xlsx`
       );

    };

       /*
       |--------------------------------------------------------------------------
       | Export PDF
       |--------------------------------------------------------------------------
       */

       const exportPDF = async () => {

       if (filteredAttendance.length === 0) {
              alert("No attendance records found.");
              return;
       }

       const doc = new jsPDF();

       /*
       |--------------------------------------------------------------------------
       | Load Logo
       |--------------------------------------------------------------------------
       */

       const getBase64Image = (url) => {

              return new Promise((resolve) => {

              const img = new Image();

              img.crossOrigin = "Anonymous";
              img.src = url;

              img.onload = () => {

                     const canvas = document.createElement("canvas");

                     canvas.width = img.width;
                     canvas.height = img.height;

                     const ctx = canvas.getContext("2d");

                     ctx.drawImage(img, 0, 0);

                     resolve(canvas.toDataURL("image/jpeg"));

              };

              img.onerror = () => resolve(null);

              });

       };

       const logoBase64 = await getBase64Image("/logo.jpeg");

       /*
       |--------------------------------------------------------------------------
       | Header
       |--------------------------------------------------------------------------
       */

       doc.setFillColor(37, 99, 235);
       doc.rect(0, 0, 210, 35, "F");

       if (logoBase64) {
              doc.addImage(
              logoBase64,
              "JPEG",
              15,
              8,
              20,
              20
              );
       }

       doc.setTextColor(255);

       doc.setFontSize(22);

       doc.text(
              "AttendX",
              105,
              14,
              { align: "center" }
       );

       doc.setFontSize(11);

       doc.text(
              "Smart Attendance Management System",
              105,
              22,
              { align: "center" }
       );

       doc.setFontSize(15);

       doc.text(
              "Attendance Report",
              105,
              30,
              { align: "center" }
       );

       /*
       |--------------------------------------------------------------------------
       | Report Details
       |--------------------------------------------------------------------------
       */

       doc.setTextColor(0);

       doc.setFontSize(10);

       doc.text(
              `Generated By : ${user?.full_name || "Administrator"}`,
              14,
              45
       );

       doc.text(
              `Role : ${user?.role || "Admin"}`,
              14,
              51
       );

       doc.text(
              `Generated : ${new Date().toLocaleString()}`,
              14,
              57
       );

       doc.text(
              `Status : ${statusFilter || "All"}`,
              120,
              45
       );

       doc.text(
              `Date From : ${dateFrom || "All"}`,
              120,
              51
       );

       doc.text(
              `Date To : ${dateTo || "All"}`,
              120,
              57
       );

       /*
       |--------------------------------------------------------------------------
       | Statistics Cards
       |--------------------------------------------------------------------------
       */

       const cards = [

              {
              title: "Total",
              value: stats.totalAttendance
              },

              {
              title: "Present",
              value: stats.presentToday
              },

              {
              title: "Absent",
              value: stats.absentToday
              },

              {
              title: "Rate",
              value: `${stats.attendanceRate}%`
              }

       ];

       let x = 14;

       cards.forEach(card => {

              doc.setFillColor(245, 248, 255);

              doc.roundedRect(
              x,
              66,
              42,
              22,
              2,
              2,
              "F"
              );

              doc.setFontSize(9);

              doc.text(
              card.title,
              x + 3,
              74
              );

              doc.setFontSize(15);

              doc.text(
              String(card.value),
              x + 3,
              84
              );

              x += 46;

       });

       /*
       |--------------------------------------------------------------------------
       | Attendance Table
       |--------------------------------------------------------------------------
       */

       autoTable(doc, {

              startY: 95,

              head: [[
                     "Student",
                     "Reg No",
                     "Course",
                     "Lecturer",
                     "Date",
                     "Time",
                     "Status"
              ]],

              body: filteredAttendance.map(item => [

              item.student_name,

              item.registration_no,

              item.course_code,

              item.lecturer_name,

              item.session_date,

              new Date(item.scanned_at).toLocaleTimeString([], {
                     hour: "2-digit",
                     minute: "2-digit",
                     second: "2-digit"
              }),

              item.attendance_status

              ]),

              headStyles: {
                     fillColor: [37, 99, 235],
                     textColor: 255,
                     fontStyle: "bold"
              },

              styles: {
                     fontSize: 8,
                     cellPadding: 2
              },

              alternateRowStyles: {
                     fillColor: [245, 245, 245]
              }
       });

       /*
       |--------------------------------------------------------------------------
       | Signature
       |--------------------------------------------------------------------------
       */

       const finalY = doc.lastAutoTable.finalY + 25;

       doc.setFontSize(10);

       doc.text(
              "__________________________",
              14,
              finalY
       );

       doc.text(
              "Administrator Signature",
              16,
              finalY + 7
       );

       /*
       |--------------------------------------------------------------------------
       | Footer
       |--------------------------------------------------------------------------
       */

       const pages = doc.getNumberOfPages();

       for (let i = 1; i <= pages; i++) {

              doc.setPage(i);

              doc.setDrawColor(220);

              doc.line(
              10,
              285,
              200,
              285
              );

              doc.setFontSize(9);

              doc.setTextColor(120);

              doc.text(
              "AttendX | Smart Attendance Management System",
              14,
              290
              );

              doc.text(
              `Page ${i} of ${pages}`,
              175,
              290
              );

       }

       /*
       |--------------------------------------------------------------------------
       | Download
       |--------------------------------------------------------------------------
       */

       doc.save(
              `Attendance_Report_${new Date()
              .toISOString()
              .slice(0, 10)}.pdf`
       );

       };

       return (

    <div className="container-fluid py-4">

        {/* Header */}

        <div
            className="card border-0 shadow mb-4"
            style={{ borderRadius: "18px" }}
        >

            <div
                className="card-header border-0"
                style={{
                    background:
                        "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    color: "#fff",
                    padding: "22px",
                    borderTopLeftRadius: "18px",
                    borderTopRightRadius: "18px",
                }}
            >

                <h3 className="fw-bold mb-1">
                    Reports Dashboard
                </h3>

                <small>
                    Monitor attendance statistics and generate reports.
                </small>

            </div>

        </div>

        {/* Statistics */}

        <div className="row g-4 mb-4">

            <div className="col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <small className="text-muted">Total Attendance</small>
                            <h2 className="fw-bold mt-2">
                                {stats.totalAttendance}
                            </h2>
                        </div>

                        <FaClipboardCheck
                            size={40}
                            className="text-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <small className="text-muted">Present Today</small>
                            <h2 className="fw-bold mt-2 text-success">
                                {stats.presentToday}
                            </h2>
                        </div>

                        <FaCheckCircle
                            size={40}
                            className="text-success"
                        />
                    </div>
                </div>
            </div>

            <div className="col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <small className="text-muted">Absent Today</small>
                            <h2 className="fw-bold mt-2 text-danger">
                                {stats.absentToday}
                            </h2>
                        </div>

                        <FaTimesCircle
                            size={40}
                            className="text-danger"
                        />
                    </div>
                </div>
            </div>

            <div className="col-lg-3">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <small className="text-muted">Attendance Rate</small>
                            <h2 className="fw-bold mt-2 text-primary">
                                {stats.attendanceRate}%
                            </h2>
                        </div>

                        <FaChartLine
                            size={40}
                            className="text-warning"
                        />
                    </div>
                </div>
            </div>

        </div>

        {/* Filters */}

        <div className="card border-0 shadow-sm mb-4">

            <div className="card-header bg-white">
                <h5 className="fw-bold mb-0">
                    Attendance Filters
                </h5>
            </div>

            <div className="card-body">

                <div className="row g-3">

                    <div className="col-lg-4">

                        <div className="input-group">

                            <span className="input-group-text">
                                <FaSearch />
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="col-lg-2">

                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="Present">
                                Present
                            </option>

                            <option value="Absent">
                                Absent
                            </option>

                        </select>

                    </div>

                    <div className="col-lg-3">

                        <input
                            type="date"
                            className="form-control"
                            value={dateFrom}
                            onChange={(e) =>
                                setDateFrom(e.target.value)
                            }
                        />

                    </div>

                    <div className="col-lg-3">

                        <input
                            type="date"
                            className="form-control"
                            value={dateTo}
                            onChange={(e) =>
                                setDateTo(e.target.value)
                            }
                        />

                    </div>

                </div>

            </div>

        </div>

        {/* Attendance Table */}

        <div className="card border-0 shadow-sm">

            <div className="card-header bg-white d-flex justify-content-between align-items-center">

                <div>

                    <h5 className="fw-bold mb-0">
                        Attendance Report
                    </h5>

                    <small className="text-muted">
                        {filteredAttendance.length} Record(s)
                    </small>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-success"
                        onClick={exportExcel}
                    >
                        <FaFileExcel className="me-2" />
                        Excel
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={exportPDF}
                    >
                        <FaFilePdf className="me-2" />
                        PDF
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => window.print()}
                    >
                        <FaPrint className="me-2" />
                        Print
                    </button>

                </div>

            </div>

            <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                    <thead className="table-primary">

                        <tr>

                            <th>Student</th>
                            <th>Registration No</th>
                            <th>Course</th>
                            <th>Lecturer</th>
                            <th>Date</th>
                            <th>Scanned Time</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredAttendance.length > 0 ? (

                            filteredAttendance.map((item) => (

                                <tr key={item.id}>

                                    <td>
                                        <strong>{item.student_name}</strong>
                                    </td>

                                    <td>{item.registration_no}</td>

                                    <td>

                                        <strong>
                                            {item.course_code}
                                        </strong>

                                        <br />

                                        <small className="text-muted">
                                            {item.course_name}
                                        </small>

                                    </td>

                                    <td>
                                        {item.lecturer_name}
                                    </td>

                                    <td>
                                        {item.session_date}
                                    </td>

                                    <td>
                                        {item.scanned_at
                                          ? new Date(item.scanned_at).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  second: "2-digit",
                                          })
                                        : "-"}
                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${
                                                item.attendance_status === "Present"
                                                    ? "bg-success"
                                                    : "bg-danger"
                                            }`}
                                        >
                                            {item.attendance_status}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-5"
                                >
                                    No attendance records found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    </div>

);
}

export default Reports;