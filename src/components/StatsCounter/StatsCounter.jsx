import { useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import "./StatsCounter.css";

const stats = [
  { label: "Onboarded Schools", value: 40 },
  { label: "Enrolled Staffs", value: 600 },
  { label: "Enrolled Students", value: 5000 },
];

const StatsCounter = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  return (
    <div ref={ref} className="stats-container">
      {stats.map((stat, index) => (
        <div key={index} className="stat-box">
          <h2 className="stat-value">
            {inView ? <CountUp start={0} end={stat.value} duration={2.5} /> : 0}
            <span>+</span>
          </h2>
          <p className="stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;
