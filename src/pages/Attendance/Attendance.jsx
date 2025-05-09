import React, { useEffect, useState } from "react";
import "./Attendance.css";
import { Link, useLocation } from "react-router-dom";
import { useSchool } from "../../context/SchoolContext";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import { getMonthsBetweenDates, getMonthsWeeksDays } from "../../utils/Utils";
import Loading from "../../utils/Loader";
import { markAttendance } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import NoRecord from "../../components/NoRecord";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import { useAuth } from "../../context/AuthContext";

const Attendance = () => {
  const {
    schoolState,
    setSchoolDatas,
    inLatestSession,
    sessionId,
    termId,
    updateSchoolStateById,
  } = useSchool();
  const { schoolStudents, schoolSession, schoolTuition } = schoolState;
  const { hasAccess } = useAuth();

  const location = useLocation();
  const { state } = location || {}; // Get state from location
  const { className, classId } = state || {};
  const [calendar, setCalendar] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    return `${day}/${month}`;
  };

  function formattedDate(dateString) {
    const [year, month, day] = dateString.split("-");
    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");
    return `${formattedDay}/${formattedMonth}`;
  }

  const currentDate = getFormattedDate();

  const { start_date, end_date } =
    schoolSession
      ?.find((obj) => obj?.id === sessionId)
      ?.terms.find((obj) => obj?.id === termId) || {};

  useEffect(() => {
    if (start_date && end_date) {
      const result = getMonthsWeeksDays(start_date, end_date);
      setCalendar(result);
    }
  }, [start_date, end_date]);

  useEffect(() => {
    if (!schoolStudents) return;

    let newAttendance = {}; // Temporary object to batch updates

    schoolStudents
      .filter((obj) => obj.student_class === classId)
      .forEach((student) => {
        const lastAttendance = student?.attendance?.at(-1);
        if (lastAttendance) {
          newAttendance[student.id] = {
            ...newAttendance[student.id],
            [formattedDate(lastAttendance.date)]:
              lastAttendance.status === "Present",
          };
        }
      });

    setAttendance((prev) => ({ ...prev, ...newAttendance })); // Update state once
  }, [schoolStudents, classId]);

  const toggleAttendance = (studentId, date) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: !prev[studentId]?.[date],
      },
    }));
  };

  const handleSubmitAttendance = async () => {
    const todayAttendance = Object.entries(attendance).reduce(
      (acc, [studentId, dates]) => {
        if (
          dates[currentDate] !== undefined &&
          calendar[currentMonth]?.weeks.flat().includes(currentDate)
        ) {
          acc[studentId] = { [currentDate]: dates[currentDate] };
        }
        return acc;
      },
      {},
    );

    const body = JSON.stringify({
      attendance: todayAttendance,
      session: sessionId,
      term: termId,
      class: classId,
    });
    setLoading(true);

    try {
      const response = await markAttendance(body);
      setLoading(false);

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  const previousAttendance = (day, student) => {
    const is_present =
      student.attendance?.find((obj) => formattedDate(obj.date) === day)
        ?.status === "Present" || false;

    return is_present;
  };

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const filteredStudents = schoolTuition
    .filter(
      (obj) =>
        obj?.student_class === classId &&
        obj?.academic_session === sessionId &&
        obj?.academic_term === termId,
    )
    .map((obj) => getStudent(obj?.student));

  return !hasAccess(5) ? (
    <div className="attendance-container">
      <div className="student-class">
        <h2>{className}</h2>
      </div>
      <div className="attendance-calendar">
        <CgChevronLeftO
          className="attendance-icon"
          onClick={() => setCurrentMonth((prev) => Math.max(prev - 1, 0))}
        />
        <p>{calendar[currentMonth]?.name || ""}</p>
        <CgChevronRightO
          className="attendance-icon"
          onClick={() =>
            setCurrentMonth((prev) => Math.min(prev + 1, calendar.length - 1))
          }
        />
      </div>
      {filteredStudents.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
            paddingBottom: "20px",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", width: "100%" }}>
            <div className="new-table-style attendance-names">
              <table>
                <thead>
                  <tr className="heading-style" style={{ height: "40px" }}>
                    <th>S/N</th>
                    <th style={{ width: "400px" }}>Names</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id || index} className="content-style">
                      <td>{index + 1}</td>
                      <td
                        style={{
                          height: "60px",
                          maxHeight: "60px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          maxWidth: "150px",
                        }}
                      >
                        {`${student.last_name} ${student.first_name}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="new-table-style attendance-dates">
              <table>
                <thead>
                  <tr className="heading-style" style={{ height: "40px" }}>
                    {calendar[currentMonth]?.weeks.flat().map((day, index) => (
                      <th key={index}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id || index} className="content-style">
                      {calendar[currentMonth]?.weeks
                        .flat()
                        .map((day, dayIndex) => (
                          <td
                            key={dayIndex}
                            style={{
                              height: "60px",
                              maxHeight: "60px",
                              overflow: "hidden",
                              boxSizing: "border-box",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={
                                day !== currentDate
                                  ? previousAttendance(day, student)
                                  : attendance[student.id]?.[day] || false
                              }
                              disabled={day !== currentDate ? true : false}
                              onChange={() => toggleAttendance(student.id, day)}
                            />
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <CustomSmallButton
            text={loading ? <Loading /> : "Submit Attendance"}
            runFunction={handleSubmitAttendance}
            icon={!loading && <PiCheckCircleBold className="use-font-style" />}
            disabled={!inLatestSession ? true : loading}
          />
        </div>
      ) : (
        <div className="no-record-container">
          <NoRecord
            message="No students found in this class."
            addon={
              <Link to={"/registration"}>
                <CustomSmallButton
                  text={"Add Student"}
                  icon={<PiPlusCircleBold className="use-font-style" />}
                />
              </Link>
            }
          />
        </div>
      )}
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
    </div>
  ) : (
    <FeatureLockModal isLocked={hasAccess(5)} />
  );
};

export default Attendance;
//
