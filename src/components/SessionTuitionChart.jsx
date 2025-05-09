import React, { useRef, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useSchool } from "../context/SchoolContext";
import { generateMonthlyDetails } from "../utils/Utils";

Chart.register(...registerables);

const TuitionSessionChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { schoolState, termId, sessionId } = useSchool();
  const { schoolTuition, schoolSession } = schoolState;
  const [monthArray, setMonthArray] = useState([]);
  const [monthlyInflowData, setMonthlyInflowData] = useState([]);

  useEffect(() => {
    // Extract session start and end dates
    const sessionDetails = schoolSession?.find((obj) => obj?.id === sessionId);
    const session_start_date = sessionDetails?.start_date;
    const session_end_date = sessionDetails?.end_date;

    // Generate month array for the session
    const month_array = generateMonthlyDetails(
      session_start_date,
      session_end_date,
    );
    setMonthArray(month_array);

    // Calculate inflow data for each month
    const monthly_inflow_data = month_array.map((month) => {
      const totalInflow = schoolTuition.reduce((sum, student) => {
        const inflowForMonth = student?.payments?.filter((tuition) =>
          month.days_in_month.includes(tuition.payment_date),
        );
        const totalForMonth = inflowForMonth?.reduce(
          (acc, curr) => Number(acc) + Number(curr.amount),
          0,
        );
        return sum + totalForMonth;
      }, 0);
      return totalInflow;
    });
    setMonthlyInflowData(monthly_inflow_data);
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: monthArray.map((month) => month.name), // Month names
        datasets: [
          {
            label: "Inflow",
            data: monthlyInflowData,
            borderColor: "#711a75",
            backgroundColor: "#711a75",
            pointBackgroundColor: "#711a75",
            pointBorderColor: "#fff",
            tension: 0.4, // Smooth curve
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                family: "'Montserrat', sans-serif",
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
              label: function (context) {
                const value = context.raw; // Inflow value
                return `₦${value.toLocaleString()}.00`; // Format to currency
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                family: "'Montserrat', sans-serif",
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                family: "'Montserrat', sans-serif",
              },
              callback: function (value) {
                return `₦${value.toLocaleString()}.00`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [monthArray, monthlyInflowData]);

  return <canvas ref={canvasRef} />;
};

export default TuitionSessionChart;
