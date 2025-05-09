import React, { useState } from "react";
import "./Profile.css";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { BiEdit } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import CustomTextInput from "../../components/CustomTextInput/CustomTextInput";
import { MdPassword } from "react-icons/md";
import { PiCheckCircleBold, PiCheckCircleLight } from "react-icons/pi";
import EditStaffModal from "../../components/modals/EditStaffModal/EditStaffModal";
import { useSchool } from "../../context/SchoolContext";
import { updatePassword, updateStaffData } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import Loading from "../../utils/Loader";
import { compressImage } from "../../utils/Utils";

const Profile = () => {
  const { authState, updateUser } = useAuth();
  const { user } = authState;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });
  const { schoolState, setSchoolDatas } = useSchool();
  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const handleUpdateData = async (data) => {
    const body = JSON.stringify(data);

    setLoading({ ...loading, profile: true });

    try {
      const response = await updateStaffData(body);
      setLoading({ ...loading, profile: false });

      if (response.success) {
        setSchoolDatas(response.schoolData);
        updateUser(response.user);
        setMessage(response.message);
        setSuccessStatus(true);
        handleCloseModal();
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading({ ...loading, profile: false });
      setMessage("An error occurred while updating profile.");
      setSuccessStatus(false);
    }
  };

  const handleChangePassword = async () => {
    const body = JSON.stringify({ password: confirmPassword });

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setSuccessStatus(false);
      return;
    } else if (password.length <= 8) {
      setMessage("Password must be more than 8 characters.");
      setSuccessStatus(false);
      return;
    }

    setLoading({ ...loading, password: true });

    try {
      const response = await updatePassword(body);
      setLoading({ ...loading, password: false });

      if (response.success) {
        setMessage(response.message);
        setSuccessStatus(true);
        handleCloseModal();
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading({ ...loading, password: false });
      setMessage("An error occurred while updating password.");
      setSuccessStatus(false);
    }
  };

  const getFullName = (first_name, last_name) => `${first_name} ${last_name}`;

  return (
    <div className="profile-container">
      <div className="p-top-section">
        <img src={user?.passport} alt="" srcset="" />
        <div className="p-top-section-right">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3>
              {user?.full_name ||
                getFullName(user?.first_name, user?.last_name)}
            </h3>
            <p>
              <span className="p-label">
                {user?.role !== "student" ? "Staff ID:" : "Student ID:"}{" "}
              </span>
              {user?.staff_id} | <span className="p-label">Role: </span>{" "}
              {user?.role}
            </p>
          </div>
          {user?.role !== "Student" && (
            <div className="no-width">
              <CustomSmallButton
                icon={<BiEdit className="use-font-style" />}
                text={"Edit"}
                runFunction={handleOpenModal}
              />
            </div>
          )}
        </div>
      </div>
      <div className="p-staff-info">
        <div className="p-info-card">
          <p className="p-label">Name</p>
          <p className="p-value">
            {user?.full_name || getFullName(user?.first_name, user?.last_name)}
          </p>
        </div>
        <div className="p-info-card">
          <p className="p-label">
            {user?.role === "Staff" ? "Staff ID:" : "Student ID:"}
          </p>
          <p className="p-value">
            {user?.staff_id || user?.student_id || "N/A"}
          </p>
        </div>
        <div className="p-info-card">
          <p className="p-label">Email Address</p>
          <p className="p-value">{user?.email_address || "N/A"}</p>
        </div>
        <div className="p-info-card">
          <p className="p-label">Phone</p>
          <p className="p-value">{user?.phone_number || "N/A"}</p>
        </div>
        <div className="p-info-card">
          <p className="p-label">Gender</p>
          <p className="p-value">{user?.gender || "N/A"}</p>
        </div>
        <div className="p-info-card">
          <p className="p-label">Date of Birth</p>
          <p className="p-value">{user?.date_of_birth || "N/A"}</p>
        </div>
        <div className="change-password">
          <h3>Change Password</h3>
          <CustomTextInput
            name={"password"}
            placeholder={"Password"}
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
            icon={<MdPassword />}
          />
          <CustomTextInput
            name={"password"}
            placeholder={"Confirm Password"}
            value={confirmPassword}
            handleChange={(e) => setConfirmPassword(e.target.value)}
            icon={<MdPassword />}
          />
          <CustomSmallButton
            text={loading.password ? <Loading /> : "Update Password"}
            icon={
              !loading.password && (
                <PiCheckCircleBold className="use-font-style" />
              )
            }
            runFunction={handleChangePassword}
            disabled={loading.password}
          />
        </div>
      </div>
      <EditStaffModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        staffObject={user}
        updateData={handleUpdateData}
        loading={loading.profile}
      />
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
    </div>
  );
};

export default Profile;
