import React, { useState, useContext, useEffect } from "react";
import "./Signin.css";
import { FiMail, FiLock } from "react-icons/fi";
import { AlertBadge } from "../../components/AlertBadge";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import from context
import Loading from "../../utils/Loader";
import { loginUser } from "../../services/authService"; // Use loginUser function from authService
import { useSchool } from "../../context/SchoolContext";
import { PiIdentificationBadge } from "react-icons/pi";
import { getSchool } from "../../services/schoolService";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";

const Signin = ({ schoolData }) => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    member: "Staff",
  });
  const { login, authState } = useContext(AuthContext);
  const { user } = authState;
  const { setSchoolDatas } = useSchool();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    document.title = `EduTerex - ${schoolData?.name}`;
  }, [schoolData]);

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const url = window.location.hostname.split(".")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim(),
    });
  };

  const toTitleCase = (str) => {
    return str.toLowerCase().replace(/(?:^|\s|-)\w/g, function (match) {
      return match.toUpperCase();
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const isNullOrEmpty = (value) =>
      value === null || value === undefined || value === "";

    const body = {
      id: formData.id,
      password: formData.password,
      slug: schoolData?.slug,
      member: formData.member,
    };

    for (const key in body) {
      if (body.hasOwnProperty(key) && isNullOrEmpty(body[key])) {
        setMessage(
          `${key === "id" ? formData.member : ""} ${toTitleCase(key.replaceAll("_", " "))} cannot be blank or empty`,
        );
        setLoading(false);
        return null;
      }
    }

    try {
      const response = await loginUser(body);
      // If login is successful, set user data in AuthContext and navigate
      if (response.success) {
        login(response.user, response.tokens);
        setSchoolDatas(response.schoolData);
        navigate("/", { replace: true });
      } else {
        setMessage(response.message || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="sigin-header">
          <div className="logo">
            <img src={schoolData?.logo} alt="" srcset="" />
          </div>
          <h2 style={{ fontWeight: 600, color: "#711a75" }}>
            {schoolData?.name}
          </h2>
          <div className="member-div-label">
            <p>{formData.member} Login</p>
          </div>
          {formData.member === "Staff" ? (
            <p style={{ textAlign: "center" }}>
              Staff should login with their staff ID and password.
            </p>
          ) : (
            <p style={{ textAlign: "center" }}>
              Student should login with their student ID and surname in
              lowercase as password.
            </p>
          )}
        </div>
        {message && <AlertBadge message={message} />}
        <div className="input-form-container">
          <input
            type="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder={`${formData.member} ID`}
          />
          <div className="form-icons">
            <PiIdentificationBadge className="icons" />
          </div>
        </div>

        <div className="input-form-container">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
          />
          <div className="form-icons">
            <FiLock className="icons" />
          </div>
        </div>
        <div className="signin-page-action">
          {formData.member === "Staff" ? (
            <Link
              onClick={() => setFormData({ ...formData, member: "Student" })}
            >
              Student Login
            </Link>
          ) : (
            <Link onClick={() => setFormData({ ...formData, member: "Staff" })}>
              Staff Login
            </Link>
          )}
          <Link to={"/auth/forgot-password"}>Forgot Password</Link>
        </div>
        <div className="next-btn">
          <CustomSmallButton
            text={loading ? <Loading /> : "Login"}
            runFunction={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
