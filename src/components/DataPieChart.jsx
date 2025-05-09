import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const ExpenseChart = ({ data, COLORS, centerText, centerIcons }) => {
  return (
    <div
      style={{
        textAlign: "center",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PieChart width={200} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70} // Inner radius for the doughnut effect
          outerRadius={100} // Outer radius for the chart
          paddingAngle={5}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* Text inside the doughnut */}
        {centerText && (
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: "16px",
            }}
          >
            Total Students
          </text>
        )}
        {centerIcons && (
          <foreignObject x="35%" y="35%" width="30%" height="30%">
            {centerIcons}
          </foreignObject>
        )}
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: "35px",
            fontWeight: "bold",
          }}
        >
          {centerText}
        </text>
      </PieChart>
      <div
        style={{
          textAlign: "left",
          marginTop: "20px",
          fontSize: "14px",
          display: "inline-block",
        }}
      >
        {data.map((entry, index) => (
          <div
            key={index}
            style={{
              margin: "5px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "15px",
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: COLORS[index % COLORS.length],
                borderRadius: "50%",
                display: "inline-block",
                marginRight: "10px",
              }}
            ></span>
            {entry.name}:{" "}
            <span style={{ marginLeft: "5px" }}>
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;
