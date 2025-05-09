import React, { useEffect, useState, useMemo } from "react";
import "./AdminDashboard.css";
import {
  FaChalkboardTeacher,
  FaDollarSign,
  FaFemale,
  FaGraduationCap,
  FaMale,
  FaUserGraduate,
  FaUserShield,
} from "react-icons/fa";
import { useSchool } from "../../context/SchoolContext";
import { MdOutlineSchool } from "react-icons/md";
import DataPieChart from "../../components/DataPieChart";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import AttendanceChart from "../../components/AttendanceChart";
import TuitionChart from "../../components/TuitionChart";
import DateDisplay from "../../components/DateCard";
import { formatAmount } from "../../components/FormatAmount";
import { useAuth } from "../../context/AuthContext";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import { BiSolidUserAccount } from "react-icons/bi";

const AdminDashboard = () => {
  const { schoolState, setSchoolDatas, termId, sessionId } = useSchool();
  const {
    schoolStudents,
    schoolSession,
    schoolTuition,
    schoolStaffList,
    classes,
  } = schoolState;
  const { authState, hasAccess } = useAuth();
  const { user } = authState;

  function calculateFees() {
    let totalReceivedFees = 0;
    let totalExpectedFees = 0;
    let totalWaiverFees = 0;

    schoolTuition?.forEach((account) => {
      if (account?.academic_term === termId) {
        // Add to total received fees
        totalReceivedFees += parseFloat(account.amount_paid);

        // Add to total expected fees
        totalExpectedFees += parseFloat(account.total_fee);
        totalWaiverFees += parseFloat(account.waiver);
      }
    });

    return {
      totalReceivedFees: totalReceivedFees.toFixed(2),
      totalExpectedFees: totalExpectedFees.toFixed(2),
      totalWaiverFees: totalWaiverFees.toFixed(2),
    };
  }

  const topCardList = [
    {
      icon: <FaUserGraduate />,
      title: "Students",
      count: schoolStudents?.length || 0,
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Teachers",
      count:
        schoolStaffList?.filter((obj) => obj?.role === "Teacher")?.length || 0,
    },
    {
      icon: <FaUserShield />,
      title: "Admins",
      count:
        schoolStaffList?.filter((obj) => obj?.role === "Admin")?.length || 0,
    },
    {
      icon: <BiSolidUserAccount />,
      title: "Account Manager",
      count:
        schoolStaffList?.filter((obj) => obj?.role === "Account Manager")
          ?.length || 0,
    },
  ];

  const [classId, setClassId] = useState("All");

  const data = useMemo(() => {
    return [
      {
        name: "No. of Male Students",
        value: schoolStudents?.filter(
          (obj) =>
            obj?.gender === "Male" &&
            (classId === "All" || obj?.student_class.toString() === classId),
        )?.length,
      },
      {
        name: "No. of Female Students",
        value: schoolStudents?.filter(
          (obj) =>
            obj?.gender === "Female" &&
            (classId === "All" || obj?.student_class.toString() === classId),
        )?.length,
      },
    ];
  }, [schoolStudents, classId]);

  return !hasAccess(1) ? (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="d-top-cards">
          {topCardList.map((card, index) => (
            <div className={`d-card ${index % 2 === 0 ? "d-card-dark" : ""}`}>
              <div
                className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
              >
                {card.icon}
              </div>
              <div>
                <h3>{card.count}</h3>
                <p>{card.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="d-middle-cards">
          <div className="d-student-chart">
            <div className="d-student-chart-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  className="d-card-icon"
                  style={{ width: "35px", height: "35px", minWidth: "35px" }}
                >
                  <FaUserGraduate style={{ fontSize: "14px" }} />
                </div>
                <p>Student</p>
              </div>
              <div style={{ width: "max-content" }}>
                <CustomSelectionInput
                  options={[
                    { label: "All", value: "All" },
                    ...classes.map((obj) => ({
                      label: obj?.name,
                      value: obj?.id,
                    })),
                  ]}
                  handleChange={(e) => setClassId(e.target.value)}
                  value={classId}
                  name="class"
                />
              </div>
            </div>
            <DataPieChart
              data={data}
              COLORS={["#711a75", "#ffadbc"]}
              centerIcons={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <FaMale style={{ fontSize: "50px", color: "#711a75" }} />
                  <FaFemale style={{ fontSize: "50px", color: "#ffadbc" }} />
                </div>
              }
            />
          </div>
          <div className="d-attendance-chart">
            <AttendanceChart />
          </div>
        </div>
        {user?.role !== "Teacher" && (
          <div className="d-tuition-chart">
            <div className="d-student-chart-header">
              <p>Fees Inflow</p>
              <div
                className="d-card-icon"
                style={{ width: "35px", height: "35px", minWidth: "35px" }}
              >
                <FaDollarSign className="use-font-style" />
              </div>
            </div>
            <TuitionChart />
          </div>
        )}
      </div>
      <div className="dashboard-aside">
        <DateDisplay />
        {user?.role !== "Teacher" && (
          <p style={{ textAlign: "center", fontWeight: 600 }}>
            {
              schoolSession
                .find((obj) => obj.id === sessionId)
                ?.terms?.find((item) => item.id === termId)?.name
            }{" "}
            Account Summary
          </p>
        )}
        {user?.role !== "Teacher" && (
          <div className="d-top-cards bottom-part">
            <div className="d-card">
              <div className="d-card-icon">
                <FaDollarSign style={{ fontSize: "16px" }} />
              </div>
              <div>
                <h3>₦{formatAmount(calculateFees().totalReceivedFees)}</h3>
                <p>Received Fees</p>
              </div>
            </div>
          </div>
        )}
        {user?.role !== "Teacher" && (
          <div className="d-top-cards bottom-part">
            <div className="d-card-dark">
              <div className="d-card-icon-dark">
                <FaDollarSign style={{ fontSize: "16px" }} />
              </div>
              <div>
                <h3>₦{formatAmount(calculateFees().totalWaiverFees)}</h3>
                <p>Waivers</p>
              </div>
            </div>
          </div>
        )}

        {user?.role !== "Teacher" && (
          <div className="d-top-cards bottom-part">
            <div className="d-card" style={{ backgroundColor: "#fff" }}>
              <div className="d-card-icon">
                <FaDollarSign style={{ fontSize: "16px" }} />
              </div>
              <div>
                <h3>
                  ₦
                  {formatAmount(
                    calculateFees().totalExpectedFees -
                      calculateFees().totalReceivedFees -
                      calculateFees().totalWaiverFees,
                  )}
                </h3>
                <p>Outstanding Fees</p>
              </div>
            </div>
          </div>
        )}
        {user?.role !== "Teacher" && (
          <div className="d-top-cards bottom-part">
            <div className="d-card-dark">
              <div className="d-card-icon-dark">
                <FaDollarSign style={{ fontSize: "16px" }} />
              </div>
              <div>
                <h3>₦{formatAmount(calculateFees().totalExpectedFees)}</h3>
                <p>Expected Fees</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <FeatureLockModal
      isLocked={hasAccess(1)}
      message="You dont have an active subscription or your subscription have expired, please subscribe to a new plan."
    />
  );
};

export default AdminDashboard;
