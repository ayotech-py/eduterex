import React, { useState } from "react";
import "./Registration.css";
import AddStaffModal from "../../components/modals/AddStaffModal/AddStaffModal";
import AddStudentModal from "../../components/modals/AddStudentModal/AddStudentModal";
import { useAuth } from "../../context/AuthContext";
import { useSchool } from "../../context/SchoolContext";
import ListItem from "../../components/ListItem/ListItem";
import { HiOutlineClipboardList } from "react-icons/hi";
import Loading from "../../utils/Loader";
import { AlertBadge } from "../../components/AlertBadge";
import { registerStaff, registerStudent } from "../../services/schoolService";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";

const Registration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const [staffObject, setStaffObject] = useState({});

  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const handleOpenStudentModal = () => setIsStudentModalVisible(true);
  const handleCloseStudenteModal = () => setIsStudentModalVisible(false);
  const [studentObject, setStudentObject] = useState({});

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const { authState, getMaxMembers, hasAccess } = useAuth();
  const {
    schoolState,
    setSchoolDatas,
    inLatestSession,
    sessionId,
    termId,
    updateSchoolState,
  } = useSchool();

  const { user } = authState;
  const { classes, schoolSession, schoolStudents, schoolStaffList } =
    schoolState;

  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const handleAddStudent = (studentObject) => {
    studentList.push(studentObject);
  };

  const [staffEditIndex, setStaffEditIndex] = useState(null);
  const [studentEditIndex, setStudentEditIndex] = useState(null);

  const handleStaffEdit = (index) => {
    setStaffObject(staffList[index - 1]);
    setStaffEditIndex(index);
    setIsModalVisible(true);
  };

  const handleStudentEdit = (index) => {
    setStudentObject(studentList[index - 1]);
    setStudentEditIndex(index);
    setIsStudentModalVisible(true);
  };

  const handleStaffDelete = (index) => {
    const newStaffList = staffList.filter((obj, i) => i !== index - 1);
    setStaffList(newStaffList);
    setStaffEditIndex(null);
  };

  const handleStudentDelete = (index) => {
    const newStudentList = studentList.filter((obj, i) => i !== index - 1);
    setStudentList(newStudentList);
    setStudentEditIndex(null);
  };

  function getClassNames(data) {
    return data.map((item) => `${item.name} Teacher`);
  }

  function getClassNamesStudent(data) {
    return data.map((item) => item.name);
  }

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [studentMessage, setStudentMessage] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  const handleUploadStaff = async () => {
    setLoading(true);
    try {
      const response = await registerStaff(
        JSON.stringify({ staff_list: staffList }),
      );

      setMessage(response.message);
      setLoading(false);

      if (response.success) {
        setStaffList(response.error);
        setSchoolDatas(response.schoolData);
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage("An error occured while registering staff(s).");
      setSuccessStatus(false);
    }
  };

  const handleUploadStudent = async () => {
    setStudentLoading(true);
    try {
      const response = await registerStudent(
        JSON.stringify({ student_list: studentList }),
      );
      setStudentLoading(false);
      setStudentMessage(response.message);

      if (response.success) {
        setStudentList(response.error);
        updateSchoolState(response.schoolData);
      } else {
        setStudentMessage(response.message);
      }
    } catch (error) {
      setStudentLoading(false);
      setStudentMessage(error);
      setSuccessStatus(false);
    }
  };

  const newClassNames = ["Admin", "Account Manager", "Teacher"];
  const [registrationType, setRegistrationType] = useState("student");

  const [locked, setLocked] = useState(false);

  const exceededMember =
    schoolStudents?.length + schoolStaffList?.length > getMaxMembers();
  const noMemberLeft =
    getMaxMembers() - (schoolStudents?.length + schoolStaffList?.length);

  return !hasAccess(1) ? (
    <div className="registration-container" style={{ height: "100%" }}>
      <div className="registration-type">
        <CustomSmallButton
          text={
            registrationType === "student"
              ? "Register Staff Instead?"
              : "Register Student Instead?"
          }
          icon={
            registrationType === "staff" ? <FaUserGraduate /> : <FaUserTie />
          }
          runFunction={() =>
            setRegistrationType(
              registrationType === "student" ? "staff" : "student",
            )
          }
        />
      </div>
      <div className="registration-page">
        <div
          className={`${registrationType === "student" ? "r-hide-view" : "r-show-view"} staff-registration `}
        >
          <div className="top-section">
            <CustomSmallButton
              text={"Add Staff"}
              runFunction={() => {
                setMessage("");
                if (exceededMember) {
                  setLocked(true);
                } else if (noMemberLeft - staffList.length <= 0) {
                  setLocked(true);
                } else if (staffList.length >= 5) {
                  setModalMessage(
                    "You can only register maximum of 5 staffs at a time.",
                  );
                  setSuccessStatus(false);
                } else {
                  handleOpenModal();
                }
              }}
              icon={<BiPlusCircle size={"18px"} />}
              disabled={!inLatestSession ? true : false}
            />
          </div>
          {staffList.length > 0 ? (
            <div className="list-container">
              {staffList.map((obj, index) => (
                <ListItem
                  object={obj}
                  index={index + 1}
                  handleEdit={handleStaffEdit}
                  handleDelete={handleStaffDelete}
                />
              ))}
            </div>
          ) : (
            <div className="bottom-section">
              <div className="no-record-yet">
                <HiOutlineClipboardList
                  className="no-record-icon"
                  style={{ transform: "scale(1.2)" }}
                />
                <p>No records yet</p>
              </div>
            </div>
          )}
          <div
            className="top-section"
            style={{ borderBottom: "none", borderTop: "1px solid #711a75" }}
          >
            {message && (
              <AlertBadge
                success={staffList.length > 0 ? false : true}
                message={message}
              />
            )}
            <CustomSmallButton
              text={loading ? <Loading /> : "Upload Data"}
              runFunction={handleUploadStaff}
              disabled={
                !inLatestSession ? true : staffList.length < 1 || loading
              }
            />
          </div>
        </div>
        <div
          className={`${registrationType === "staff" ? "r-hide-view" : "r-show-view"} student-registration`}
        >
          <div className="top-section">
            <CustomSmallButton
              text={"Add Student"}
              runFunction={() => {
                setMessage("");
                if (exceededMember) {
                  setLocked(true);
                } else if (noMemberLeft - studentList.length <= 0) {
                  setLocked(true);
                } else if (studentList.length >= 5) {
                  setModalMessage(
                    "You can only register maximum of 5 students at a time.",
                  );
                  setSuccessStatus(false);
                } else {
                  handleOpenStudentModal();
                }
              }}
              icon={<BiPlusCircle size={"18px"} />}
              disabled={!inLatestSession ? true : false}
            />
          </div>
          {studentList.length > 0 ? (
            <div className="list-container">
              {studentList.map((obj, index) => (
                <ListItem
                  object={obj}
                  index={index + 1}
                  handleEdit={handleStudentEdit}
                  handleDelete={handleStudentDelete}
                />
              ))}
            </div>
          ) : (
            <div className="bottom-section">
              <div className="no-record-yet">
                <HiOutlineClipboardList
                  className="no-record-icon"
                  style={{ transform: "scale(1.2)" }}
                />
                <p>No records yet</p>
              </div>
            </div>
          )}
          <div
            className="top-section"
            style={{ borderBottom: "none", borderTop: "1px solid #711a75" }}
          >
            {studentMessage && (
              <AlertBadge
                success={studentList.length > 0 ? false : true}
                message={studentMessage}
              />
            )}
            <CustomSmallButton
              text={studentLoading ? <Loading /> : "Upload Data"}
              runFunction={handleUploadStudent}
              disabled={
                !inLatestSession
                  ? true
                  : studentList.length < 1 || studentLoading
              }
            />
          </div>
        </div>
        <AddStaffModal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          staffObject={staffObject}
          setStaffObject={setStaffObject}
          isEdit={staffEditIndex}
          setEditIndex={setStaffEditIndex}
          staffList={staffList}
          setStaffList={setStaffList}
          classList={newClassNames}
        />
        <AddStudentModal
          isVisible={isStudentModalVisible}
          onClose={handleCloseStudenteModal}
          studentObject={studentObject}
          setStudentObject={setStudentObject}
          isEdit={studentEditIndex}
          setEditIndex={setStudentEditIndex}
          studentList={studentList}
          setStudentList={setStudentList}
          classList={getClassNamesStudent(classes)}
          sessionList={schoolSession || []}
          sessionId={sessionId}
          termId={termId}
        />
        <AlertModal
          isVisible={modalMessage ? true : false}
          onClose={() => setModalMessage("")}
          message={modalMessage}
          success={successStatus}
        />
      </div>

      {/* <div className="no-permission">
          <p>You dont have permission to carry out this action</p>
        </div> */}

      <FeatureLockModal
        isLocked={locked}
        message="You have reached the maximum number of members your plan can accomodate, please upgrade your plan."
      />
      <FeatureLockModal
        isLocked={hasAccess(1)}
        message="You dont have an active subscription or your subscription have expired, please subscribe to a new plan."
      />
    </div>
  ) : locked ? (
    <FeatureLockModal
      isLocked={locked}
      message="You have reached the maximum number of members your plan can accomodate, please upgrade your plan."
    />
  ) : (
    <FeatureLockModal
      isLocked={hasAccess(1)}
      message="You dont have an active subscription or your subscription have expired, please subscribe to a new plan."
    />
  );
};

export default Registration;
