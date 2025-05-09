import React, { useState, useEffect } from "react";
import {
  MdDashboard,
  MdLogout,
  MdNotificationsActive,
  MdOutlineEventAvailable,
  MdSchool,
  MdSubscriptions,
} from "react-icons/md";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSchool } from "../../context/SchoolContext";
import {
  FaBookOpen,
  FaLaptopCode,
  FaMoneyBillWave,
  FaRegClipboard,
  FaTasks,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { BiSolidReceipt, BiSpreadsheet } from "react-icons/bi";
import { AiOutlineBank, AiOutlineFileText } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { CgClose, CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoReceiptSharp } from "react-icons/io5";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { BsExclamationCircleFill } from "react-icons/bs";
import PoweredBy from "../../components/PoweredBy";

const Home = ({ children, activeTabName }) => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const { authState, logout } = useAuth();
  const { schoolState, inLatestSession, termId, sessionId } = useSchool();

  const { user } = authState;
  const { classes, schoolSession } = schoolState;

  let session = null;
  let term = null;

  if (schoolSession.length > 0) {
    session = schoolSession?.find((obj) => obj?.id === sessionId) ?? "None";

    if (session?.terms?.length > 0) {
      term = session?.terms?.find((obj) => obj?.id === termId) ?? "None";
    }
  }

  const [showDropdown, setShowDropdown] = useState({
    studentManagerDropdown: false,
    attendanceManagerDropdown: false,
    resultManagerDropdown: false,
    virtualClassroomDropdown: false,
  });

  function removeNumbers(input) {
    if (input) {
      return input.replace(/[0-9]/g, "");
    }
  }

  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (
      activeTabName !== "Student Manager" &&
      activeTabName !== "Attendance Manager" &&
      activeTabName !== "Result Manager"
    ) {
      setActiveTab(activeTabName);
    }
    document.title = `Dashboard - ${user?.school?.name}`;
  }, [activeTabName, user]);

  function daysBetween(dateString) {
    const givenDate = new Date(dateString); // Convert input string to Date object
    const currentDate = new Date(); // Get today's date

    // Calculate difference in milliseconds
    const diffInMs = Math.abs(currentDate - givenDate);

    // Convert milliseconds to days (1 day = 1000ms * 60s * 60min * 24hrs)
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  const remainingDays = daysBetween(user?.school?.subscription_end_date);

  const assignedClasses =
    user?.class_subject_permission?.map((obj) => obj.classId) || [];

  return (
    <div className="home-page">
      <div
        className={`home-aside ${mobileNav ? "show-toggle" : "hidden-toggle"}`}
      >
        <div className="close-hamburger-container">
          <CgClose
            className="close-hamburger"
            onClick={() => setMobileNav(false)}
          />
        </div>
        <div className="logo">
          <img src={user?.school?.logo} alt="" srcset="" />
        </div>
        <div>
          <h4 style={{ color: "#fff", textAlign: "center" }}>
            {user?.school?.name || "School Name"}
          </h4>
          <div className="session-term-banner">
            <p style={{ textAlign: "center", fontWeight: 500 }}>
              {session?.name || "None"} | {term?.name || "None"}
            </p>
          </div>
        </div>
        <div className="option-container overflow">
          <div>
            <div className="divider-line"></div>
          </div>
          <Link
            className={`action-container ${activeTab === "Dashboard" ? "btn-active" : "btn-inactive"}`}
            onClick={() => {
              setMobileNav(false);
            }}
            to={"/dashboard"}
          >
            <MdDashboard />
            <p>Dashboard</p>
          </Link>
          <div>
            <div className="divider-line"></div>
          </div>
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <Link
              className={`action-container ${activeTab === "Academic Session" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/academic-session"}
            >
              <MdSchool />
              <p>Academic Sessions</p>
            </Link>
          )}
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <Link
              className={`action-container ${activeTab === "Registration" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/registration"}
            >
              <FaRegClipboard />
              <p>Registration</p>
            </Link>
          )}
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <Link
              className={`action-container ${activeTab === "Staff Manager" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/staff-manager"}
            >
              <FaUserTie />
              <p>Staff Manager</p>
            </Link>
          )}
          {user?.role !== "Student" && (
            <div className="list-dropdown">
              <div
                className="list-dropdown-keeper"
                onClick={() => {
                  setShowDropdown((prev) => ({
                    studentManagerDropdown: !prev.studentManagerDropdown,
                  }));
                }}
              >
                <FaUserGraduate />
                <p>Student Manager</p>
              </div>
              <div
                className={
                  showDropdown.studentManagerDropdown
                    ? "dropdown-classes-show overflow"
                    : "dropdown-classes-hide"
                }
              >
                {classes
                  .filter((obj) => assignedClasses.includes(obj.id))
                  .map((obj, index) => (
                    <Link
                      key={index}
                      className={`action-container sub-dropdown ${activeTab === `Student Manager ${obj.id}` ? "btn-active" : "btn-inactive"}`}
                      onClick={() => {
                        setActiveTab(`Student Manager ${obj.id}`);
                        setMobileNav(false);
                      }}
                      to="/student-manager"
                      state={{ className: obj.name, classId: obj.id }}
                    >
                      <p>{obj.name}</p>
                    </Link>
                  ))}
              </div>
            </div>
          )}
          {user?.role !== "Student" && (
            <div className="list-dropdown">
              <div
                className="list-dropdown-keeper"
                onClick={() => {
                  setShowDropdown((prev) => ({
                    attendanceManagerDropdown: !prev.attendanceManagerDropdown,
                  }));
                }}
              >
                <MdOutlineEventAvailable />
                <p>Attendance Manager</p>
              </div>
              <div
                className={
                  showDropdown.attendanceManagerDropdown
                    ? "dropdown-classes-show overflow"
                    : "dropdown-classes-hide"
                }
              >
                {classes
                  .filter((obj) => assignedClasses.includes(obj.id))
                  .map((obj, index) => (
                    <Link
                      key={index}
                      className={`action-container sub-dropdown ${activeTab === `Attendance Manager ${obj.id}` ? "btn-active" : "btn-inactive"}`}
                      onClick={() => {
                        setActiveTab(`Attendance Manager ${obj.id}`);
                        setMobileNav(false);
                      }}
                      to="/attendance-manager"
                      state={{ className: obj.name, classId: obj.id }}
                    >
                      <p>{obj.name}</p>
                    </Link>
                  ))}
              </div>
            </div>
          )}
          {user?.role !== "Student" && (
            <div className="list-dropdown">
              <div
                className="list-dropdown-keeper"
                onClick={() => {
                  setShowDropdown((prev) => ({
                    resultManagerDropdown: !prev.resultManagerDropdown,
                  }));
                }}
              >
                <BiSpreadsheet />
                <p>Result Manager</p>
              </div>
              <div
                className={
                  showDropdown.resultManagerDropdown
                    ? "dropdown-classes-show overflow"
                    : "dropdown-classes-hide"
                }
              >
                <Link
                  className={`action-container sub-dropdown ${activeTab === `Result Manager 11111111111119999999999999` ? "btn-active" : "btn-inactive"}`}
                  onClick={() => {
                    setActiveTab(`Result Manager 11111111111119999999999999`);
                    setMobileNav(false);
                  }}
                  to="/view-result"
                >
                  <p>View Result</p>
                </Link>
                {classes
                  .filter((obj) => assignedClasses.includes(obj.id))
                  .map((obj, index) => (
                    <Link
                      key={index}
                      className={`action-container sub-dropdown ${activeTab === `Result Manager ${obj.id}` ? "btn-active" : "btn-inactive"}`}
                      onClick={() => {
                        setActiveTab(`Result Manager ${obj.id}`);
                        setMobileNav(false);
                      }}
                      to="/result-manager"
                      state={{ className: obj.name, classId: obj.id }}
                    >
                      <p>{obj.name}</p>
                    </Link>
                  ))}
              </div>
            </div>
          )}
          {user?.role === "Student" && (
            <Link
              className={`action-container ${activeTab === "School Bill" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/school-bills"}
            >
              <BiSolidReceipt />
              <p>School Bills</p>
            </Link>
          )}
          {user?.role === "Student" && (
            <Link
              className={`action-container ${activeTab === "Payment" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/payments"}
            >
              <IoReceiptSharp />
              <p>Payments</p>
            </Link>
          )}
          {user?.role === "Student" && (
            <Link
              className={`action-container ${activeTab === "Result" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/results"}
            >
              <BiSpreadsheet />
              <p>Results</p>
            </Link>
          )}
          {user?.role !== "Student" && (
            <div className="list-dropdown">
              <div
                className="list-dropdown-keeper"
                onClick={() => {
                  setShowDropdown((prev) => ({
                    virtualClassroomDropdown: !prev.virtualClassroomDropdown,
                  }));
                }}
              >
                <FaBookOpen />
                <p>Virtual Classroom</p>
              </div>
              <div
                className={
                  showDropdown.virtualClassroomDropdown
                    ? "dropdown-classes-show overflow"
                    : "dropdown-classes-hide"
                }
              >
                {classes.map((obj, index) => (
                  <Link
                    key={index}
                    className={`action-container sub-dropdown ${activeTab === `Virtual Classroom ${obj.id}` ? "btn-active" : "btn-inactive"}`}
                    onClick={() => {
                      setActiveTab(`Virtual Classroom ${obj.id}`);
                      setMobileNav(false);
                    }}
                    to="/virtual-classroom"
                    state={{ className: obj.name, classId: obj.id }}
                  >
                    <p>{obj.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {user?.role === "Student" && (
            <Link
              className={`action-container ${activeTab === "Virtual Classroom" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/virtual-class"}
            >
              <FaBookOpen />
              <p>Virtual Classroom</p>
            </Link>
          )}
          <Link
            className={`action-container ${activeTab === "CBT Quiz" ? "btn-active" : "btn-inactive"}`}
            onClick={() => {
              setMobileNav(false);
            }}
            to={"/cbt-quiz"}
          >
            <FaLaptopCode />
            <p>CBT Quiz</p>
          </Link>
          {user?.role !== "Student" && (
            <Link
              className={`action-container ${activeTab === "Exam Manager" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/exam-manager"}
            >
              <AiOutlineFileText />
              <p>Exam Manager</p>
            </Link>
          )}
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <div>
              <div className="divider-line"></div>
            </div>
          )}
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <Link
              className={`action-container ${activeTab === "Tuition Manager" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/tuition-fee-manager"}
            >
              <FaMoneyBillWave />
              <p>Tuition Manager</p>
            </Link>
          )}
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <Link
              className={`action-container ${activeTab === "Account Manager" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/account-manager"}
            >
              <AiOutlineBank />
              <p>Account Manager</p>
            </Link>
          )}
          <div>
            <div className="divider-line"></div>
          </div>
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <Link
              className={`action-container ${activeTab === "Settings" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/settings"}
            >
              <FiSettings />
              <p>Settings</p>
            </Link>
          )}
          <Link
            className={`action-container ${activeTab === "Profile" ? "btn-active" : "btn-inactive"}`}
            onClick={() => {
              setMobileNav(false);
            }}
            to={"/profile"}
          >
            <CgProfile />
            <p>Profile</p>
          </Link>
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <div>
              <div className="divider-line"></div>
            </div>
          )}
          {user?.role !== "Teacher" && user?.role !== "Student" && (
            <Link
              className={`action-container ${activeTab === "Subscription" ? "btn-active" : "btn-inactive"}`}
              onClick={() => {
                setMobileNav(false);
              }}
              to={"/subscription"}
            >
              <MdSubscriptions />
              <p>Subscription</p>
            </Link>
          )}
        </div>
        <div className="mobile-logout">
          <CustomSmallButton
            text={"Logout"}
            icon={<MdLogout className="use-font-style" />}
            runFunction={logout}
          />
        </div>
        <div className="home-side-bottom">
          <PoweredBy dark={false} center={true} />
        </div>
      </div>
      <div className="home-main">
        <div className="home-heading">
          <div className="home-heading-right">
            <GiHamburgerMenu
              className="mobile-hamburger"
              onClick={() => setMobileNav(true)}
            />
            <h1>{removeNumbers(activeTab)}</h1>
          </div>
          <div className="home-heading-left">
            <div className="home-heading-right">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={user?.passport} alt="" />
                <p className="mobile-logout member-role-ui">
                  {user?.role?.split(" ")[0]}{" "}
                  {user?.role.includes("Account") ? "M." : ""}
                </p>
              </div>
              <div>
                <h4>
                  Welcome{` `}
                  {user?.full_name?.split(" ")[0] || user?.first_name || "User"}
                </h4>
                <p className="logout">
                  {user?.role} | {user?.staff_id || user?.student_id || "ID"}
                </p>
                <p className="mobile-logout">
                  {user?.staff_id || user?.student_id || "ID"}
                </p>
              </div>
            </div>
            <div className="logout no-width">
              <CustomSmallButton
                text={"Logout"}
                icon={<MdLogout className="use-font-style" />}
                runFunction={logout}
              />
            </div>
          </div>
        </div>
        {!inLatestSession && user.role !== "Student" && (
          <div className="notice-banner">
            <BsExclamationCircleFill size={15} />
            <p>
              {session
                ? "You may not be able to make some effects to this session or term."
                : "Please create an academic session to begin with."}
            </p>
          </div>
        )}
        {remainingDays <= 14 && user.role !== "Student" && (
          <div className="notice-banner">
            <BsExclamationCircleFill size={15} />
            <p>
              {user?.school?.subscription_ref_number
                ? `Your subscription will expire in ${remainingDays < 0 ? 0 : remainingDays} day(s).`
                : `Your trial will expire in ${remainingDays < 0 ? 0 : remainingDays} day(s).`}
            </p>
          </div>
        )}
        <div className="children">{children}</div>
      </div>
    </div>
  );
};

export default Home;
