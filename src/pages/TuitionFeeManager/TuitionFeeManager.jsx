import React, { useEffect, useState } from "react";
import "./TuitionFeeManager.css";
import { BiFilter, BiSearch } from "react-icons/bi";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { GrActions } from "react-icons/gr";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiPlusCircleBold } from "react-icons/pi";
import { useSchool } from "../../context/SchoolContext";
import NoRecord from "../../components/NoRecord";
import { BsEye } from "react-icons/bs";
import { formatDate } from "../../utils/Utils";
import AddPaymentModal from "../../components/modals/AddPaymentModal/AddPaymentModal";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import { addTuitionFee, sendMail } from "../../services/schoolService";
import SchoolBillModal from "../../components/modals/SchoolBillModal/SchoolBillModal";
import { formatAmount } from "../../components/FormatAmount";
import ReceiptPDF from "../../components/Receipt/ReceiptPDF";
import { pdf } from "@react-pdf/renderer";
import Loading from "../../utils/Loader";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import { useAuth } from "../../context/AuthContext";
import FilterModal from "../../components/modals/FilterModal";

const TuitionFeeManager = () => {
  const {
    schoolState,
    setSchoolDatas,
    inLatestSession,
    sessionId,
    termId,
    updateSchoolStateById,
  } = useSchool();
  const { schoolStudents, classes, schoolTuition, schoolSession } = schoolState;
  const { hasAccess } = useAuth();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const [selectedList, setSelectedList] = useState(null);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const handleOpenFilterModal = () => setIsFilterModalVisible(true);
  const handleCloseFilterModal = () => setIsFilterModalVisible(false);

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const handleOpenPaymentModal = () => setIsPaymentModalVisible(true);
  const handleClosePaymentModal = () => setIsPaymentModalVisible(false);

  const [isBillModalVisible, setIsBillModalVisible] = useState(false);
  const handleOpenBillModal = () => setIsBillModalVisible(true);
  const handleCloseBillModal = () => setIsBillModalVisible(false);

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const waivers = ["Scholarship", "Discount", "Grants", "Others"];

  const [data, setData] = useState({});

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const handleSelection = (id) => {
    const student = schoolTuition.find(
      (student) => student.student === id && student.academic_term === termId,
    );
    const studentAllTuition = schoolTuition.filter(
      (student) => student.student === id,
    );
    const totalBalance = studentAllTuition.reduce(
      (sum, student) => sum + parseInt(student.balance),
      0,
    );

    return {
      student_name: `${getStudent(student?.student)?.last_name} ${getStudent(student?.student)?.first_name}`,
      student_id: getStudent(student?.student)?.student_id,
      session: schoolSession.find((obj) => obj.id === student?.academic_session)
        ?.name,
      term: [
        schoolSession
          .find((obj) => obj.id === student?.academic_session)
          ?.terms.find((obj) => obj.id === student?.academic_term)?.name,
        "All",
      ],
      balance: parseInt(student?.balance),
      totalBalance: parseInt(totalBalance),
    };
  };

  const handleAddPayment = () => {
    if (selectedList) {
      if (handleSelection(selectedList).balance === 0) {
        setSuccessStatus(true);
        setModalMessage(
          "This student has no outstanding payment for this term.",
        );
        return;
      }
      setData(handleSelection(selectedList));
      handleOpenPaymentModal();
    } else {
      setModalMessage("Please select a student to add payment.");
    }
  };

  const toggleIdInList = (id) => {
    setSelectedList((prevList) => {
      if (prevList.includes(id)) {
        return prevList.filter((item) => item !== id);
      } else {
        return [...prevList, id];
      }
    });
  };

  const [action, setAction] = useState("reminder");
  const [emailLoading, setEmailLoading] = useState(false);

  const handleSubmitPayment = async (formData, setMessage, setLoading) => {
    setLoading(true);

    try {
      const response = await addTuitionFee(JSON.stringify(formData));
      setLoading(false);

      if (response.success) {
        setSelectedList(null);
        updateSchoolStateById(response.schoolData);
        handleClosePaymentModal();
        setModalMessage(response.message);
        setSuccessStatus(true);

        /* const studentData = response.schoolData.schoolStudents.find(
          (obj) => obj.student_id === data?.student_id,
        );

        const studentTuition = response.schoolData.schoolTuition.find(
          (obj) =>
            obj.student === studentData.id && obj.academic_term === termId,
        );

        const session = response.schoolData.schoolSession.find(
          (obj) => obj.id === studentData?.current_session,
        );
        const term = session?.terms.find(
          (obj) => obj.id === studentData?.current_term,
        );

        const studentClass = response.schoolData.classes.find(
          (obj) => obj.id === studentData.student_class,
        );

        const blob = await pdf(
          <ReceiptPDF
            school={studentData?.school}
            student={studentData}
            tuition={studentTuition}
            session={session}
            term={term}
            studentClass={studentClass}
            id={studentTuition?.payments?.length - 1}
          />,
        ).toBlob();

        const formData = new FormData();
        formData.append(
          "file",
          new File([blob], "receipt.pdf", { type: "application/pdf" }),
        );
        formData.append("student_id", studentData?.id);
        formData.append("mail_type", "payment");
        sendNotificationMail(formData); */
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

  const sendNotificationMail = async (formData) => {
    setEmailLoading(true);
    try {
      const response = await sendMail(formData);
      setEmailLoading(false);

      if (response.success) {
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setModalMessage(error);
      setSuccessStatus(false);
      setEmailLoading(false);
    }
  };

  const [search, setSearch] = useState("");

  const filterStudents = (search) => {
    return schoolStudents.filter(
      (student) =>
        student.first_name.toLowerCase().includes(search.toLowerCase()) ||
        student.last_name.toLowerCase().includes(search.toLowerCase()) ||
        student.student_id.toLowerCase().includes(search.toLowerCase()) ||
        classes
          .find((obj) => obj.id === student?.student_class)
          ?.name.toLowerCase()
          .includes(search.toLowerCase()),
    );
  };

  const filterStudentsTuition = (search, tuition) => {
    return (
      schoolTuition
        .filter((student) => student.academic_term === termId)
        .filter((student) => {
          const studentData = getStudent(student.student);
          const studentClass = classes.find(
            (obj) => obj.id === student?.student_class,
          );

          // Match search input with student details
          const matchesSearch =
            studentData?.first_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            studentData?.last_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            studentData?.student_id
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            studentClass?.name.toLowerCase().includes(search.toLowerCase());

          // Determine if student matches the payment status
          const matchesPaymentStatus =
            (tuition === "cleared" && student.balance === "0.00") ||
            (tuition === "outstanding" && student.balance !== "0.00") ||
            (tuition === "none" && student.balance);

          return matchesSearch && matchesPaymentStatus;
        })
        // Sorting the filtered list by last name
        .sort((a, b) => {
          const studentDataA = getStudent(a.student);
          const studentDataB = getStudent(b.student);

          const lastNameA = studentDataA?.last_name.toLowerCase();
          const lastNameB = studentDataB?.last_name.toLowerCase();

          return lastNameA?.localeCompare(lastNameB);
        })
    );
  };

  const [locked, setLocked] = useState(7);

  const [filter, setFilter] = useState("none");

  return !hasAccess(locked) ? (
    <div className="tfm-container">
      <div className="tfm-heading">
        <div className="tfm-filter" onClick={handleOpenFilterModal}>
          <BiFilter className="tfm-filter-icon" />
          <p>Filter</p>
        </div>
        <div className="search-container">
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, student id, and class."
          />
          <BiSearch className="search-icon" />
        </div>
      </div>
      {filterStudents(search).length > 0 ? (
        <div className="tfm-table-container">
          <div className="tfm-tc-heading">
            <div className="tfm-action">
              <h4>Action: </h4>
              <CustomSelectionInput
                placeholder={""}
                name={"action"}
                value={action}
                handleChange={(e) => setAction(e.target.value)}
                options={[
                  { label: "Notify owing parents", value: "reminder" },
                  { label: "Notify parents of new term bill", value: "bill" },
                ]}
                icon={<GrActions className="use-font-style" />}
                small={true}
              />
              <div className="no-width">
                <CustomSmallButton
                  text={emailLoading ? <Loading /> : "Go"}
                  runFunction={() => {
                    if (!hasAccess(10)) {
                      sendNotificationMail(
                        JSON.stringify({ mail_type: action }),
                      );
                    } else {
                      setLocked(10);
                    }
                  }}
                  disabled={!inLatestSession ? true : false || emailLoading}
                />
              </div>
            </div>
            <div className="tfm-add">
              <CustomSmallButton
                text={"Record Payment"}
                icon={<PiPlusCircleBold className="use-font-style" />}
                runFunction={handleAddPayment}
                disabled={!inLatestSession ? true : false}
              />
            </div>
          </div>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th></th>
                  <th></th>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>School Fee</th>
                  <th>Amount Paid</th>
                  <th>Balance</th>
                  <th>Waivers</th>
                  <th>Last Payment Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterStudentsTuition(search, filter).map((student, index) => (
                  <tr key={student.id} className="content-style">
                    <td>
                      {index + 1}.{" "}
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={
                          selectedList === getStudent(student.student)?.id
                        }
                        onChange={() =>
                          setSelectedList(getStudent(student.student)?.id)
                        }
                      />
                    </td>
                    <td>
                      <img
                        src={
                          getStudent(student.student)?.passport
                            ? getStudent(student.student)?.passport
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt={`${student.first_name} ${student.last_name}`}
                        className="profile-image"
                      />
                    </td>
                    <td>
                      {getStudent(student.student)?.last_name}{" "}
                      {getStudent(student.student)?.first_name}
                    </td>
                    <td>{getStudent(student.student)?.student_id || "N/A"}</td>
                    <td>
                      {
                        classes.find((obj) => obj.id === student?.student_class)
                          ?.name
                      }
                    </td>
                    <td>₦{formatAmount(student?.total_fee)}</td>
                    <td>₦{formatAmount(student.amount_paid)}</td>
                    <td>₦{formatAmount(student.balance)}</td>
                    <td>
                      {student?.bills
                        ?.filter((bill) => waivers?.includes(bill.billName)) // Keep only waived bills
                        ?.map(
                          (bill) =>
                            `${bill?.billName} (₦${formatAmount(bill?.billAmount)})`,
                        ) // Format them
                        ?.join(", ") || "None"}
                    </td>
                    <td>
                      {student?.payments?.length > 0
                        ? formatDate(student?.payments.at(-1)?.payment_date)
                        : "N/A"}
                    </td>
                    <td>
                      {student.status ? (
                        <p className="tuition-cleared">Cleared</p>
                      ) : (
                        <p className="tuition-not-cleared">Unpaid</p>
                      )}
                    </td>
                    <td>
                      <BsEye
                        className="action-icon"
                        onClick={() => {
                          setStudentInfo(getStudent(student.student));
                          handleOpenBillModal();
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AddPaymentModal
            isVisible={isPaymentModalVisible}
            onClose={handleClosePaymentModal}
            isLoading={isPaymentLoading}
            setIsLoading={setIsPaymentLoading}
            handlePayment={handleSubmitPayment}
            data={data}
          />
          <AlertModal
            isVisible={modalMessage ? true : false}
            onClose={() => setModalMessage("")}
            message={modalMessage}
            success={successStatus}
          />
          <SchoolBillModal
            isVisible={isBillModalVisible}
            onClose={handleCloseBillModal}
            studentInfo={studentInfo}
            setModalMessage={setModalMessage}
            setSuccessStatus={setSuccessStatus}
          />
          <FilterModal
            isVisible={isFilterModalVisible}
            onClose={handleCloseFilterModal}
            setFilter={setFilter}
          />
        </div>
      ) : (
        <NoRecord message="No record found." />
      )}
    </div>
  ) : locked ? (
    <FeatureLockModal isLocked={hasAccess(locked)} />
  ) : (
    <FeatureLockModal isLocked={hasAccess(7)} />
  );
};

export default TuitionFeeManager;
