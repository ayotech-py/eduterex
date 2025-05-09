import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import "./StudentDashboard.css";
import sdImage from "../../images/sd-banner.png";
import { FaDollarSign, FaMoneyBill } from "react-icons/fa";
import { formatAmount } from "../../components/FormatAmount";
import { FaBook, FaMoneyCheckDollar } from "react-icons/fa6";
import { RiBillFill } from "react-icons/ri";
import { MdOutlineEventAvailable, MdPayments, MdSubject } from "react-icons/md";
import { HiReceiptTax } from "react-icons/hi";
import { BiBook, BiSolidReceipt, BiSolidReport } from "react-icons/bi";
import { IoReceiptSharp, IoRefreshCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSchool } from "../../context/SchoolContext";
import { s } from "framer-motion/client";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import {
  formatDate,
  formatDateWithOrdinal,
  generateMonthlyDetails,
  getMonthsWeeksDays,
} from "../../utils/Utils";
import { PiCheckCircleBold } from "react-icons/pi";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import Loading from "../../utils/Loader";

const StudentDashboard = () => {
  const { schoolState, sessionId, termId, reloadData } = useSchool();
  const { studentClass, student, schoolTuition, schoolSession } = schoolState;
  const [refreshLoading, setRefreshLoading] = useState(false);

  const today = useMemo(() => new Date(), []);
  const formattedDate = formatDateWithOrdinal(today);
  const waivers = ["Scholarship", "Discount", "Grants", "Others"];

  const waiverType = schoolTuition
    .at(-1)
    ?.bills.find((obj) => waivers.includes(obj?.billName));

  const [attendanceId, setAttendanceId] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [studentAttendance, setStudentAttendance] = useState([]);

  useEffect(() => {
    const formattedToday = formatDate(today);
    const existingToday = student?.attendance.find(
      (obj) => formatDate(obj?.date) === formattedToday,
    );

    if (existingToday) {
      setAttendanceId(existingToday?.id);
      setAttendanceStatus(existingToday?.status);
      setStudentAttendance(student.attendance);
    } else {
      const updatedAttendance = [
        ...student.attendance,
        {
          id: "today",
          status: "Attendance Yet to be Taken",
          date: today,
        },
      ];
      setStudentAttendance(updatedAttendance);
      setAttendanceId("today");
      setAttendanceStatus("Attendance Yet to be Taken");
    }
  }, [student, today]);

  // Update status when attendanceId changes
  useEffect(() => {
    const selectedAttendance = studentAttendance.find(
      (obj) => obj.id.toString() === attendanceId.toString(),
    );
    if (selectedAttendance) {
      setAttendanceStatus(selectedAttendance?.status);
    } else {
      setAttendanceStatus("Attendance Yet to be Taken");
    }
  }, [attendanceId, studentAttendance]);

  /* const { start_date, end_date } =
    schoolSession
      ?.find((obj) => obj?.id === sessionId)
      ?.terms.find((obj) => obj?.id === termId) || {};

  useEffect(() => {
    if (start_date && end_date) {
      const result = generateMonthlyDetails(start_date, end_date);
      setDaysInTerm(result.map((obj) => obj?.days_in_month).flat());
    }
  }, [start_date, end_date]); */

  return (
    <div className="student-dashboard">
      <div className="sd-main">
        <div className="sd-banner">
          <div className="sd-banner-left">
            <p>{formattedDate}</p>
            <div className="sd-banner-bottom">
              <h2>Welcome back, {student?.first_name}!</h2>
              <p>Remember to check your dashboard</p>
            </div>
          </div>
          <div className="sd-banner-right">
            <img src={student?.passport} alt="" />
          </div>
        </div>
        <div>
          <CustomSmallButton
            text={refreshLoading ? <Loading /> : "Refresh"}
            icon={
              !refreshLoading && <IoRefreshCircle className="use-font-style" />
            }
            runFunction={() => reloadData(setRefreshLoading)}
            disabled={refreshLoading}
          />
        </div>
        <h3 className="mobile-ui-show">Attendance</h3>
        <div className="sd-attendance-container mobile-ui-show">
          <div className="d-student-chart">
            <div className="d-student-chart-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  className="d-card-icon"
                  style={{ width: "35px", height: "35px", minWidth: "35px" }}
                >
                  <MdOutlineEventAvailable style={{ fontSize: "16px" }} />
                </div>
                <p>Attendance</p>
              </div>
              <div style={{ width: "max-content" }}>
                <CustomSelectionInput
                  options={studentAttendance.map((obj) => ({
                    label: formatDate(obj?.date),
                    value: obj?.id,
                  }))}
                  handleChange={(e) => setAttendanceId(e.target.value)}
                  value={attendanceId}
                  name="attendance"
                  placeholder={"Select Date"}
                />
              </div>
            </div>

            <p
              style={{
                textAlign: "center",
                fontWeight: 600,
                marginTop: "10px",
                color: attendanceStatus === "Present" ? "#711a75" : "#f44336",
              }}
              className="attendance-status-student"
            >
              {attendanceStatus?.toUpperCase()}
            </p>
          </div>
        </div>
        <h3>Payments</h3>
        <div className="sd-payment">
          <div className={`term-card-box second-card`}>
            <div className="inside-card">
              <div className={`d-card-icon d-card-icon-dark`}>
                <FaDollarSign className="use-font-style" />
              </div>
              <div>
                <h3>₦{formatAmount(schoolTuition.at(-1)?.total_fee ?? 0.0)}</h3>
                <p>Total Payable Fee</p>
              </div>
            </div>
          </div>
          <div className={`term-card-box second-card`}>
            <div className="inside-card">
              <div className={`d-card-icon d-card-icon-dark`}>
                <FaDollarSign className="use-font-style" />
              </div>
              <div>
                <h3>
                  ₦{formatAmount(schoolTuition.at(-1)?.amount_paid ?? 0.0)}
                </h3>
                {schoolTuition.at(-1)?.waiver > 0 && (
                  <span className="discount-student">
                    {`+ ${waiverType?.billName} (${waiverType?.billAmount}%) ₦${formatAmount(schoolTuition.at(-1)?.waiver ?? 0.0)}`}
                  </span>
                )}
                <p>Total Paid Fee</p>
              </div>
            </div>
          </div>
          <div className={`term-card-box second-card`}>
            <div className="inside-card">
              <div className={`d-card-icon d-card-icon-dark`}>
                <FaDollarSign className="use-font-style" />
              </div>
              <div>
                <h3>₦{formatAmount(schoolTuition.at(-1)?.balance ?? 0.0)}</h3>
                <p>Balance</p>
              </div>
            </div>
          </div>
        </div>
        <h3>Actions</h3>
        <div className="sd-action-container">
          <Link to={"/school-bills"} className="sd-action-card">
            <BiSolidReceipt className="sd-action-icon" />
            <h3>School Bill</h3>
            <p>View and download school bill</p>
          </Link>
          <Link to={"/payments"} className="sd-action-card">
            <IoReceiptSharp className="sd-action-icon" />
            <h3>Payment Receipt</h3>
            <p>View and download payment receipt</p>
          </Link>
          <Link to={"/results"} className="sd-action-card">
            <BiSolidReport className="sd-action-icon" />
            <h3>Result</h3>
            <p>View and download academic result</p>
          </Link>
        </div>
      </div>
      <div className="sd-aside">
        <h3 className="hide-in-mobile">Attendance</h3>
        <div className="sd-attendance-container hide-in-mobile">
          <div className="d-student-chart">
            <div className="d-student-chart-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  className="d-card-icon"
                  style={{ width: "35px", height: "35px", minWidth: "35px" }}
                >
                  <MdOutlineEventAvailable style={{ fontSize: "16px" }} />
                </div>
                <p>Attendance</p>
              </div>
              <div style={{ width: "max-content" }}>
                <CustomSelectionInput
                  options={studentAttendance.map((obj) => ({
                    label: formatDate(obj?.date),
                    value: obj?.id,
                  }))}
                  handleChange={(e) => setAttendanceId(e.target.value)}
                  value={attendanceId}
                  name="attendance"
                />
              </div>
            </div>

            <p
              style={{
                textAlign: "center",
                fontWeight: 600,
                marginTop: "10px",
                color: attendanceStatus === "Present" ? "#711a75" : "#f44336",
              }}
              className="attendance-status-student"
            >
              {attendanceStatus?.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="student-subject-section">
          <h3>Your Subjects</h3>
          {schoolTuition.at(-1)?.subjects?.map((subject, index) => (
            <div key={index} className="sd-subject-card">
              <div className="numbering">
                <p>{index + 1}</p>
              </div>
              <p>{subject?.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
