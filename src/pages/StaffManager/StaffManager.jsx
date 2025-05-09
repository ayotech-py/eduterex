import React, { useEffect, useState } from "react";
import "./StaffManager.css";
import { BiSearch } from "react-icons/bi";
import { useSchool } from "../../context/SchoolContext";
import { BsEye, BsThreeDotsVertical } from "react-icons/bs";
import NoRecord from "../../components/NoRecord";
import ShowProfile from "../../components/modals/ShowProfile/ShowProfile";
import _ from "lodash";
import AssignClassRoleModal from "../../components/modals/AssignClassRoleModal/AssignClassRoleModal";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import { updateStaff } from "../../services/schoolService";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import { useAuth } from "../../context/AuthContext";

const StaffManager = () => {
  const { schoolState, setSchoolDatas, reloadData } = useSchool();
  const { schoolStaffList, classes, subjects } = schoolState;

  const { hasAccess, updateUser } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const handleOpenAssignModal = () => setIsAssignModalVisible(true);
  const handleCloseAssignModal = () => setIsAssignModalVisible(false);
  const [isAssignLoading, setIsAssignLoading] = useState(false);

  const [modalIndex, setModalIndex] = useState(1);

  const removeKeys = (formData) => {
    let keysToDelete = [
      "created_at",
      "id",
      "permission_list",
      "school",
      "updated_at",
      "user",
      "is_admin",
      "is_active",
    ];

    let updatedFormData = _.omit(formData, keysToDelete);

    return updatedFormData;
  };

  const [search, setSearch] = useState("");

  const filterStaffs = (search) => {
    return schoolStaffList.filter(
      (staff) =>
        staff.full_name.toLowerCase().includes(search.toLowerCase()) ||
        staff.staff_id.toLowerCase().includes(search.toLowerCase()) ||
        classes
          .find((obj) => obj.staff.includes(staff.id))
          ?.name.toLowerCase()
          .includes(search.toLowerCase()),
    );
  };

  const [selectedStaffId, setSelectedStaffId] = useState("");

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const handleUpdateStaff = async (formData, setMessage) => {
    setIsAssignLoading(true);

    try {
      const response = await updateStaff(
        JSON.stringify(formData),
        formData.staffId,
      );
      setIsAssignLoading(false);

      if (response.success) {
        updateUser(response.user);
        setSchoolDatas(response.schoolData);
        handleCloseAssignModal();
        setMessage("");
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setIsAssignLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
    reloadData();
  };

  return !hasAccess(1) ? (
    <div className="staff-manager-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for staff by name, staff id, or class"
          id=""
        />
        <BiSearch className="search-icon" />
      </div>
      <div className="new-table-style">
        {filterStaffs(search).length > 0 ? (
          <table>
            <thead>
              <tr className="heading-style">
                <th></th>
                <th>Full Name</th>
                <th>Staff ID</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Role</th>
                <th>Status</th>
                <th>Class</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filterStaffs(search).map((staff, index) => (
                <tr
                  key={staff.id}
                  className="content-style"
                  /*  onClick={() => {
                    setModalIndex(index);
                    setIsModalVisible(true);
                  }} */
                >
                  <td>
                    <img
                      src={
                        staff.passport
                          ? staff?.passport
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={`${staff.id}'s profile`}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{staff.full_name}</td>
                  <td>{staff.staff_id}</td>
                  <td>{staff.email_address}</td>
                  <td>{staff.gender || "N/A"}</td>
                  <td>{staff.role}</td>
                  <td>{staff.is_active ? "Active" : "Suspended"}</td>
                  <td>
                    {classes
                      .filter((obj) => obj.staff.includes(staff.id))
                      .map((obj) => `${obj.name}, `)}
                  </td>
                  <td>
                    <BsEye
                      className="use-font-style"
                      style={{ cursor: "pointer" }}
                      color="#711a75"
                      onClick={() => {
                        setSelectedStaffId(staff.id);
                        handleOpenAssignModal();
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoRecord />
        )}
      </div>
      <ShowProfile
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        formData={removeKeys(schoolStaffList[modalIndex])}
      />
      <AssignClassRoleModal
        isVisible={isAssignModalVisible}
        onClose={handleCloseAssignModal}
        isLoading={isAssignLoading}
        classList={classes}
        staff={schoolStaffList.find((obj) => obj.id === selectedStaffId)}
        classes={classes
          .filter((obj) => obj.staff.includes(selectedStaffId))
          .map((obj) => obj.name)}
        handleUpdateStaff={handleUpdateStaff}
        subjects={subjects}
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

export default StaffManager;
