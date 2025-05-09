import React from "react";
import eduterexDarkLogo from "../images/eduterex_logo.png";
import eduterexLightLogo from "../images/eduterex_logo_light.png";
import { Link } from "react-router-dom";

const PoweredBy = ({ dark, center = false }) => {
  return (
    <div
      className="poweredby-container"
      style={{ alignItems: center ? "center" : "flex-start" }}
    >
      <p style={{ color: dark ? "#000" : "#fff" }}>Powered By:</p>
      <Link to={"https://eduterex.com.ng"} className="poweredby">
        <img
          src={dark ? eduterexDarkLogo : eduterexLightLogo}
          alt=""
          srcset=""
        />
        <h3 style={{ color: dark ? "#711a75" : "#f3e8ff" }}>Eduterex</h3>
      </Link>
    </div>
  );
};

export default PoweredBy;
