import React from "react";

const ContentTitle = ({ title }) => {
  return (
    <div className="content-title">
      <h3>{title}</h3>
      <div className="horizontal-line"></div>
    </div>
  );
};

export default ContentTitle;
