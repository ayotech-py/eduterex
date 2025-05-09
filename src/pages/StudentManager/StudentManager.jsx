import React, { useEffect, useState } from "react";
import "../StaffManager/StaffManager.css";
import { Link, useLocation } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { useSchool } from "../../context/SchoolContext";
import { BsEye, BsThreeDotsVertical } from "react-icons/bs";
import NoRecord from "../../components/NoRecord";
import ShowProfile from "../../components/modals/ShowProfile/ShowProfile";
import _ from "lodash";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiCheckCircleBold, PiPlusCircleBold } from "react-icons/pi";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { GrActions } from "react-icons/gr";
import PromoteStudentModal from "../../components/modals/PromoteStudentModal/PromoteStudentModal";
import {
  advancedStudentAction,
  promoteStudents,
  updateStudent,
} from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import { useAuth } from "../../context/AuthContext";
import EditStudentModal from "../../components/modals/AddStudentModal/EditStudentModal";
import Loading from "../../utils/Loader";

const StudentManager = () => {
  const location = useLocation();
  const { state } = location || {};
  const { className, classId } = state || {};
  const { hasAccess, authState } = useAuth();

  const {
    schoolState,
    setSchoolDatas,
    termId,
    sessionId,
    updateSchoolStateById,
  } = useSchool();
  const {
    schoolStudents = [],
    classes,
    schoolSession,
    schoolTuition,
  } = schoolState;

  const { user } = authState;

  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const handleOpenStudentModal = () => setIsStudentModalVisible(true);
  const handleCloseStudenteModal = () => setIsStudentModalVisible(false);
  const [studentObject, setStudentObject] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);

  const [isPromoteModalVisible, setIsPromoteModalVisible] = useState(false);
  const handleOpenPromoteModal = () => setIsPromoteModalVisible(true);
  const handleClosePromoteModal = () => setIsPromoteModalVisible(false);

  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState("");
  const [studentActionLoading, setStudentActionLoading] = useState({
    deleteLoading: false,
    resetLoading: false,
  });

  const handleOpenModal = (studentId) => {
    setModalIndex(studentId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  const removeKeys = (formData) =>
    _.omit(formData, [
      "id",
      "student_class",
      "school",
      "user",
      "is_promoted",
      "current_term",
      "current_session",
      "attendance",
    ]);

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const filteredStudents = schoolTuition
    .filter(
      (obj) =>
        obj?.student_class === classId &&
        obj?.academic_session === sessionId &&
        obj?.academic_term === termId,
    )
    .map((obj) => getStudent(obj?.student));

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [search, setSearch] = useState("");

  const searchFilteredStudents = (search) => {
    return filteredStudents
      .filter(
        (student) =>
          student?.first_name.toLowerCase().includes(search.toLowerCase()) ||
          student?.middle_name.toLowerCase().includes(search.toLowerCase()) ||
          student?.last_name.toLowerCase().includes(search.toLowerCase()) ||
          search.toLowerCase().includes(student?.first_name.toLowerCase()) ||
          search.toLowerCase().includes(student?.last_name.toLowerCase()) ||
          search.toLowerCase().includes(student?.middle_name.toLowerCase()) ||
          student?.student_id.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        const lastNameA = a?.last_name.toLowerCase();
        const lastNameB = b?.last_name.toLowerCase();

        return lastNameA.localeCompare(lastNameB);
      });
  };

  const handlePromoteStudent = async (formData, setMessage, setLoading) => {
    setLoading(true);

    try {
      const response = await promoteStudents(JSON.stringify(formData));
      setLoading(false);

      if (response.success) {
        handleClosePromoteModal();
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  const executeAction = () => {
    if (action === "Promote to next class") {
      handleOpenPromoteModal();
    }
  };

  const [studentEditIndex, setStudentEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateStudent = async (formData, setMessage) => {
    setLoading(true);

    try {
      const response = await updateStudent(
        JSON.stringify(formData),
        formData.studentId,
      );
      setLoading(false);

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        handleCloseStudenteModal();
        setMessage("");
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  const [actionUser, setActionUser] = useState(null);

  const studentAction = async (student_id, action) => {
    setStudentActionLoading({
      ...studentActionLoading,
      deleteLoading: action === "delete" ? true : false,
      resetLoading: action === "reset" ? true : false,
    });
    setActionUser(student_id);

    try {
      const response = await advancedStudentAction(student_id, action);
      setStudentActionLoading({
        ...studentActionLoading,
        deleteLoading: false,
        resetLoading: false,
      });
      setActionUser(null);

      if (response.success) {
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setActionUser(null);
      setStudentActionLoading({
        ...studentActionLoading,
        deleteLoading: false,
        resetLoading: false,
      });
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  const handleStudentEdit = (id) => {
    setStudentObject(schoolStudents.find((obj) => obj?.id === id));
    setStudentEditIndex(id);
    setIsStudentModalVisible(true);
  };

  return !hasAccess(1) ? (
    <div className="staff-manager-container">
      <div className="student-class">
        <h2>{className || "Class Name"}</h2>
      </div>
      <div className="manager-action-container">
        <div className="tfm-action">
          <h3>Action: </h3>
          <CustomSelectionInput
            placeholder={""}
            name={"action"}
            value={action || "Select action"}
            handleChange={(e) => setAction(e.target.value)}
            data={["Select action", "Promote to next class"]}
            icon={<GrActions className="icons" />}
            small={true}
          />
          <div className="no-width">
            <CustomSmallButton
              runFunction={() => executeAction()}
              text={"Go"}
            />
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for students by name, or student id"
          />
          <BiSearch className="search-icon" />
        </div>
      </div>
      <div className="new-table-style">
        {filteredStudents.length > 0 ? (
          <table>
            <thead>
              <tr className="heading-style">
                {/* <th style={{ paddingLeft: "5px", paddingRight: "5px" }}></th> */}
                <th>S/N</th>
                <th>Profile</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Student ID</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Parent Phone No.</th>
                <th>Parent Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
                <th>Advanced Action</th>
              </tr>
            </thead>
            <tbody>
              {searchFilteredStudents(search).map((student, index) => (
                <tr key={student.id} className="content-style">
                  <td>
                    {index + 1}.{" "}
                    {/* <input
                      type="checkbox"
                      checked={selectedList?.includes(student?.id)}
                      onChange={() => toggleIdInList(student.id)}
                      style={{ cursor: "pointer", width: "min-content" }}
                    /> */}
                  </td>
                  <td>
                    <img
                      src={
                        student.passport
                          ? student.passport
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={`${student.first_name} ${student.last_name}`}
                      className="profile-image"
                    />
                  </td>
                  <td>{student.last_name}</td>
                  <td>{student.first_name}</td>
                  <td>{student.middle_name || "N/A"}</td>
                  <td>{student.student_id}</td>
                  <td>{student.date_of_birth}</td>
                  <td>{student.gender}</td>
                  <td>{student.parent_phone_number}</td>
                  <td>{student.parent_email_address}</td>
                  <td>{student.address}</td>
                  <td>{student.is_active ? "Active" : "Suspended"}</td>
                  <td className="no-width">
                    <BsEye
                      className="use-font-style"
                      style={{ cursor: "pointer" }}
                      color="#711a75"
                      onClick={() => handleStudentEdit(student.id)}
                    />
                  </td>
                  <td className="reset-password no-width">
                    <CustomSmallButton
                      runFunction={() => studentAction(student.user, "reset")}
                      text={
                        actionUser === student.user &&
                        studentActionLoading.resetLoading ? (
                          <Loading />
                        ) : (
                          "Reset Password"
                        )
                      }
                      disabled={
                        actionUser === student.user &&
                        studentActionLoading.resetLoading
                      }
                    />
                    {user?.role === "Admin" && (
                      <div className="delete-student-account">
                        <CustomSmallButton
                          runFunction={() =>
                            studentAction(student.user, "delete")
                          }
                          text={
                            actionUser === student.user &&
                            studentActionLoading.deleteLoading ? (
                              <Loading />
                            ) : (
                              "Delete Student"
                            )
                          }
                          disabled={
                            actionUser === student.user &&
                            studentActionLoading.deleteLoading
                          }
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-record-container">
            <NoRecord
              message="No students found in this class."
              addon={
                <Link to={"/registration"}>
                  <CustomSmallButton
                    text={"Add Student"}
                    icon={<PiPlusCircleBold className="use-font-style" />}
                  />
                </Link>
              }
            />
          </div>
        )}
      </div>
      {isModalVisible && (
        <ShowProfile
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          formData={removeKeys(
            schoolStudents.find((student) => student.id === modalIndex),
          )}
        />
      )}
      <PromoteStudentModal
        isVisible={isPromoteModalVisible}
        onClose={handleClosePromoteModal}
        isLoading={isLoading}
        handlePromoteStudents={handlePromoteStudent}
        setIsLoading={setIsLoading}
        current_class={className}
        current_session={sessionId}
        current_term={termId}
        classes={classes?.map((obj) => obj?.name) || []}
        data={schoolSession || []}
      />
      <EditStudentModal
        isVisible={isStudentModalVisible}
        onClose={handleCloseStudenteModal}
        studentObject={studentObject}
        setStudentObject={setStudentObject}
        loading={loading}
        handleUpdateStudent={handleUpdateStudent}
      />
      <AlertModal
        isVisible={modalMessage ? true : false}
        onClose={() => setModalMessage("")}
        message={modalMessage}
        success={successStatus}
      />
    </div>
  ) : (
    <FeatureLockModal
      isLocked={hasAccess(1)}
      message="You dont have an active subscription or your subscription have expired, please subscribe to a new plan."
    />
  );
};

export default StudentManager;
