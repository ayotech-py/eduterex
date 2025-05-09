import React, { useState } from "react";
import { format, addWeeks, subWeeks, startOfWeek, addDays } from "date-fns";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";

const DateDisplay = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Get the start date of the current week
  const startDate = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Sunday as the first day of the week

  // Generate the week days (Sun to Sat)
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(startDate, index),
  );

  // Handle week navigation
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

  return (
    <div style={styles.container}>
      {/* Header with Month and Year */}
      <div className="attendance-calendar">
        <CgChevronLeftO
          className="attendance-icon"
          onClick={goToPreviousWeek}
          style={{ fontSize: "30px" }}
        />
        <p style={{ backgroundColor: "#f3e8ff", fontWeight: 600 }}>
          {format(currentWeek, "MMMM yyyy")}
        </p>
        <CgChevronRightO
          className="attendance-icon"
          onClick={goToNextWeek}
          style={{ fontSize: "30px" }}
        />
      </div>

      {/* Days of the Week */}
      <div style={styles.weekRow}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <span key={index} style={styles.dayName}>
            {day}
          </span>
        ))}
      </div>

      {/* Dates */}
      <div style={styles.dateRow}>
        {weekDays.map((date, index) => (
          <span
            key={index}
            style={{
              ...styles.date,
              backgroundColor:
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                  ? "#711a75"
                  : "transparent",
              color:
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                  ? "#fff"
                  : "#000",
              fontWeight:
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                  ? "bold"
                  : "normal",
            }}
          >
            {format(date, "d")}
          </span>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  navButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  weekRow: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "5px",
  },
  dayName: {
    fontSize: "12px",
    color: "#555",
  },
  dateRow: {
    display: "flex",
    justifyContent: "space-around",
  },
  date: {
    width: "30px",
    height: "30px",
    lineHeight: "30px",
    borderRadius: "50%",
    cursor: "pointer",
  },
};

export default DateDisplay;
