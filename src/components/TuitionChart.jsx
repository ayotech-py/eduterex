import React, { useRef, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useSchool } from "../context/SchoolContext";
import { generateWeeklyDetails } from "../utils/Utils";

Chart.register(...registerables);

const TuitionChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { schoolState, sessionId, termId } = useSchool();
  const { schoolSession, schoolTuition } = schoolState;
  const [weekArray, setWeekArray] = useState([]);
  const [weeklyInflowData, setWeeklyInflowData] = useState([]);

  useEffect(() => {
    const termDetails = schoolSession
      ?.find((obj) => obj?.id === sessionId)
      ?.terms.find((obj) => obj?.id === termId);
    const term_start_date = termDetails?.start_date;
    const term_end_date = termDetails?.end_date;

    const week_array = generateWeeklyDetails(term_start_date, term_end_date, 7);
    setWeekArray(week_array);

    const weekly_inflow_data = week_array.map((week) => {
      const totalInflow = schoolTuition.reduce((sum, student) => {
        const inflowForWeek = student?.payments?.filter((tuition) =>
          week.days_in_weeks.includes(tuition.payment_date),
        );
        const totalForWeek = inflowForWeek?.reduce(
          (acc, curr) => Number(acc) + Number(curr.amount),
          0,
        );
        return sum + totalForWeek;
      }, 0);
      return totalInflow;
    });
    setWeeklyInflowData(weekly_inflow_data);
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: weekArray.map((week) => week.name), // Week names
        datasets: [
          {
            label: "Inflow",
            data: weeklyInflowData,
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
  }, [weekArray, weeklyInflowData]);

  return <canvas ref={canvasRef} />;
};

export default TuitionChart;
