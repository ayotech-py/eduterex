import React, { use, useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { useSchool } from "../context/SchoolContext";
import { generateWeeklyDetails } from "../utils/Utils";
import { MdOutlineEventAvailable } from "react-icons/md";

Chart.register(...registerables);

const AttendanceChart = () => {
  const { schoolState, setSchoolDatas, termId, sessionId } = useSchool();
  const { schoolStudents, schoolSession, schoolTuition, classes } = schoolState;

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const chartRef = useRef(null); // Reference to the chart instance
  const canvasRef = useRef(null); // Reference to the canvas element

  const [timeFrame, setTimeFrame] = useState("");
  const [grade, setGrade] = useState("All");
  const [weekArray, setWeekArray] = useState([]);
  const [attendancePresenceData, setAttendancePresenceData] = useState([]);
  const [attendanceAbsenceData, setAttendanceAbsenceData] = useState([]);

  useEffect(() => {
    const termDetails = schoolSession
      ?.find((obj) => obj?.id === sessionId)
      ?.terms.find((obj) => obj?.id === termId);
    const term_start_date = termDetails?.start_date;
    const term_end_date = termDetails?.end_date;

    const week_array = generateWeeklyDetails(term_start_date, term_end_date);
    setWeekArray(week_array);

    const studentBySession = schoolTuition
      ?.filter(
        (item) =>
          item.academic_session === sessionId && item.academic_term === termId,
      )
      ?.map((obj) => getStudent(obj.student) || {});
    const studentByClass = studentBySession?.filter((obj) =>
      grade === "All" ? studentBySession : obj?.student_class === grade,
    );

    const currentWeek =
      week_array.find((obj) => obj?.name === timeFrame)?.days_in_weeks || [];

    const presenceData = currentWeek.map(
      (day) =>
        studentByClass?.filter((student) =>
          student?.attendance?.some(
            (attendance) =>
              attendance?.date === day && attendance?.status === "Present",
          ),
        )?.length,
    );

    const absenceData = currentWeek.map(
      (day) =>
        studentByClass?.filter((student) =>
          student?.attendance?.some(
            (attendance) =>
              attendance?.date === day && attendance?.status === "Absent",
          ),
        )?.length,
    );

    setAttendancePresenceData(presenceData);
    setAttendanceAbsenceData(absenceData);
  }, [grade, timeFrame]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const current_week = weekArray.find((week) =>
      week.days_in_weeks.includes(today),
    );

    if (!timeFrame) {
      setTimeFrame(current_week?.name);
    }
  }, [weekArray]);

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Total Present",
        backgroundColor: "#711a75",
        borderColor: "rgba(255, 206, 86, 1)",
        data: attendancePresenceData,
      },
      {
        label: "Total Absent",
        backgroundColor: "#ffadbc",
        borderColor: "rgba(54, 162, 235, 1)",
        data: attendanceAbsenceData,
      },
    ],
  };

  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart instance
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              font: {
                family: "'Montserrat', sans-serif", // Change this to your desired font
              },
            },
          },
          tooltip: {
            titleFont: {
              family: "'Montserrat', sans-serif",
            },
            bodyFont: {
              family: "'Montserrat', sans-serif",
            },
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                family: "'Montserrat', sans-serif", // Font for x-axis labels
              },
            },
          },
          y: {
            ticks: {
              beginAtZero: true,
              stepSize: Math.ceil(
                Math.max(...attendanceAbsenceData, ...attendancePresenceData) /
                  5,
              ),
              font: {
                family: "'Montserrat', sans-serif",
              },
            },
            max: Math.ceil(
              Math.max(...attendanceAbsenceData, ...attendancePresenceData) *
                1.2,
            ),
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [timeFrame, grade, attendanceAbsenceData, attendancePresenceData]); // Recreate chart when filters change

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box
        display="flex"
        gap={2}
        mb={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" gap={2} alignItems="center">
          <div
            className="d-card-icon"
            style={{ width: "35px", height: "35px", minWidth: "35px" }}
          >
            <MdOutlineEventAvailable style={{ fontSize: "14px" }} />
          </div>
          <p style={{ fontWeight: 600 }}>Attendance</p>
        </Box>

        {/* Dropdowns for filters */}
        <Box display="flex" gap={2} mb={2}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              style={{ fontSize: "13px", fontFamily: "Montserrat" }}
            >
              {weekArray?.map((obj, index) => (
                <MenuItem
                  key={index}
                  style={{ fontSize: "13px", fontFamily: "Montserrat" }}
                  value={obj?.name}
                >
                  {obj?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              style={{ fontSize: "13px", fontFamily: "Montserrat" }}
            >
              <MenuItem
                value="All"
                style={{ fontSize: "13px", fontFamily: "Montserrat" }}
              >
                All
              </MenuItem>
              {classes?.map((obj, index) => (
                <MenuItem
                  key={index}
                  value={obj?.id}
                  style={{ fontSize: "13px", fontFamily: "Montserrat" }}
                >
                  {obj?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Chart Canvas */}
      <canvas ref={canvasRef} />
    </Box>
  );
};

export default AttendanceChart;
