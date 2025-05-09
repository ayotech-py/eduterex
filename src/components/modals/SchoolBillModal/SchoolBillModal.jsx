import React, { useEffect, useState } from "react";
import "./SchoolBillModal.css";
import StudentBill from "../../StudentBill/StudentBill";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";
import { useSchool } from "../../../context/SchoolContext";
import { formatAmount } from "../../FormatAmount";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiArrowCircleUpBold } from "react-icons/pi";
import Loading from "../../../utils/Loader";
import { doesObjectExist } from "../../../utils/OnboardingUtils/ObjectChecker";
import { updatedBill } from "../../../services/schoolService";
import NoRecord from "../../NoRecord";
import Receipt from "../../Receipt/Receipt";
import StudentBillPDF from "../../StudentBill/StudentBillPDF";
import ReceiptPDF from "../../Receipt/ReceiptPDF";
import StudentSessionBill from "../../StudentBill/StudentSessionBill";
import StudentSessionBillPDF from "../../StudentBill/StudentSessionBillPDF";

const SchoolBillModal = ({
  isVisible,
  onClose,
  studentInfo,
  setModalMessage,
  setSuccessStatus,
}) => {
  const {
    schoolState,
    setSchoolDatas,
    termId,
    sessionId,
    inLatestSession,
    updateSchoolStateById,
  } = useSchool();
  const { schoolStudents, classes, schoolTuition, schoolSession } = schoolState;
  const { authState } = useAuth();
  const [billType, setBillType] = useState("term");
  const waivers = ["Scholarship", "Discount", "Grants", "Others"];

  const tuition = schoolTuition.find(
    (obj) => obj?.student === studentInfo?.id && obj.academic_term === termId,
  );
  const allTuitions = schoolTuition.filter(
    (obj) => obj?.student === studentInfo?.id,
  );
  const academic_session = schoolSession.find((obj) => obj?.id === sessionId);
  const academic_term = academic_session?.terms.find(
    (obj) => obj.id === termId,
  );

  const studentClass = classes.find(
    (obj) => obj?.id === tuition?.student_class,
  );

  const { user } = authState;
  const [loading, setLoading] = useState({
    optionalLoading: false,
    resetLoading: false,
    waiverLoading: false,
  });
  const [newBill, setNewBill] = useState([]);

  useEffect(() => {
    if (tuition?.bills) {
      setNewBill([...tuition?.bills]);
    }
  }, [tuition, isVisible]);

  const checkExtraBills = (obj, waiver) => {
    if (newBill.length > 0 && doesObjectExist(newBill, obj)) {
      const updatedBill = newBill?.filter(
        (item) => item?.billName !== obj?.billName,
      );
      setNewBill(updatedBill);
    } else {
      const updatedBill = waiver
        ? newBill?.filter((item) => !waivers.includes(item?.billName))
        : newBill;
      setNewBill([...updatedBill, obj]);
    }
  };

  const handleAddBill = async (body) => {
    setLoading((prev) => ({ ...prev, [body.loadingType]: true }));

    try {
      const response = await updatedBill(JSON.stringify(body));
      setLoading((prev) => ({ ...prev, [body.loadingType]: false }));

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, [body.loadingType]: false }));
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  function transformTuitionData(allTuition) {
    let resultMap = new Map();
    let numColumns = academic_session?.terms.length + 2; // Extra column for total
    let grandTotal = new Array(numColumns).fill(0);
    grandTotal[0] = "Grand Total";

    const noOfAbsTerm = academic_session?.terms.length - allTuition.length;
    const fakeAbj = {
      bills: [],
      waiver: 0,
    };
    for (let i = 0; i < noOfAbsTerm; i++) {
      allTuition.unshift(fakeAbj);
    }

    // Process each tuition object
    allTuition.forEach((tuition, index) => {
      const updatedBill = tuition.bills.filter((bill, indx) =>
        index > 0
          ? bill["billName"] !== "Outstanding Balance"
          : bill["billName"] !== "",
      );
      updatedBill.forEach(({ billName, billAmount }) => {
        let formattedAmount = parseFloat(
          waivers.includes(billName) ? allTuition[index].waiver : billAmount,
        ); // Convert to decimal

        if (!resultMap.has(billName)) {
          resultMap.set(billName, new Array(numColumns).fill(0));
          resultMap.get(billName)[0] = billName;
        }

        resultMap.get(billName)[index + 1] = formattedAmount || 0;
      });
    });

    // Compute total for each row
    resultMap.forEach((row) => {
      row[row.length - 1] = row.slice(1, -1).reduce((a, b) => {
        if (waivers.includes(row[0].split(" ")[0])) {
          const total_waiver = allTuition.reduce(
            (sum, tuition) => sum + parseInt(tuition?.waiver),
            0,
          );
          return total_waiver;
        } else {
          return a + b;
        }
      });
    });

    // Compute grand total for each column
    for (let i = 1; i < numColumns; i++) {
      grandTotal[i] = [...resultMap.values()].reduce(
        (sum, row) =>
          waivers.includes(row[0].split(" ")[0]) ? sum : sum + row[i],
        0,
      );
      grandTotal[i] =
        i > 0 && i < numColumns - 1
          ? grandTotal[i] - parseInt(allTuition[i - 1]?.waiver)
          : i === numColumns - 1
            ? grandTotal[i] -
              allTuition.reduce(
                (sum, tuition) => sum + parseInt(tuition.waiver),
                0,
              )
            : grandTotal[i];
    }

    return [...resultMap.values(), grandTotal];
  }

  const [newAmount, setNewAmount] = useState("");

  if (!isVisible) return null;
  return (
    <div className="modal-overlay sb-container">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Student Tuition Account</h2>
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            setNewBill([]);
            onClose();
          }}
        />
        <div className="bill-type-container">
          <div className="bill-type">
            <div
              className={`${billType === "term" ? "selected" : ""} bill-name`}
              onClick={() => setBillType("term")}
            >
              <span>Term</span>
            </div>
            <div
              className={`${billType === "session" ? "selected" : ""} bill-name`}
              onClick={() => setBillType("session")}
            >
              <span>Session</span>
            </div>
          </div>
        </div>
        {tuition?.bills?.length > 0 ? (
          <div className="sb-card" style={{ gap: "20px" }}>
            <div className="aside overflow">
              {billType === "term" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "25px",
                  }}
                >
                  <StudentBill
                    school={user?.school}
                    student={studentInfo}
                    tuition={tuition}
                    session={academic_session}
                    term={academic_term}
                    studentClass={studentClass}
                    StudentBillPDF={
                      <StudentBillPDF
                        school={user?.school}
                        student={studentInfo}
                        tuition={tuition}
                        session={academic_session}
                        term={academic_term}
                        studentClass={studentClass}
                      />
                    }
                  />

                  {academic_term?.extra_bills.length > 0 ? (
                    <div className="new-table-style for-student-bill">
                      <table>
                        <thead>
                          <tr className="heading-style">
                            <th></th>
                            <th>Optional Bills</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {academic_term?.extra_bills?.map((obj, index) => (
                            <tr className="content-style">
                              <td
                                style={{
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                }}
                              >
                                {index + 1}.{" "}
                                <input
                                  type="checkbox"
                                  checked={
                                    !!newBill.find(
                                      (item) =>
                                        item?.billName === obj?.billName,
                                    )
                                  }
                                  onChange={() => checkExtraBills(obj, null)}
                                />
                              </td>

                              <td>{obj?.billName}</td>
                              {newBill.find(
                                (item) => item?.billName === obj?.billName,
                              ) ? (
                                <td>
                                  <input
                                    className="text-input"
                                    type="number"
                                    value={
                                      newBill.find(
                                        (item) =>
                                          item.billName === obj.billName,
                                      )?.billAmount || ""
                                    }
                                    onChange={(e) =>
                                      setNewBill((prev) =>
                                        prev.map((item) =>
                                          item.billName === obj.billName
                                            ? {
                                                ...item,
                                                billAmount: e.target.value,
                                              } // Update existing bill
                                            : item,
                                        ),
                                      )
                                    }
                                  />
                                </td>
                              ) : (
                                <td>₦{formatAmount(obj?.billAmount)}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p style={{ textAlign: "center", fontSize: "12px" }}>
                        <span style={{ color: "red", fontSize: "12px" }}>
                          Note:
                        </span>{" "}
                        Resetting a student bill will delete all payment record
                        associated with this student for this term.
                      </p>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <CustomSmallButton
                          text={
                            loading.optionalLoading ? (
                              <Loading />
                            ) : (
                              "Update Bill"
                            )
                          }
                          icon={
                            !loading.optionalLoading && (
                              <PiArrowCircleUpBold className="use-font-style" />
                            )
                          }
                          disabled={
                            !inLatestSession ? true : loading.optionalLoading
                          }
                          runFunction={() =>
                            handleAddBill({
                              student_id: studentInfo?.id,
                              bills: newBill,
                              term: termId,
                              loadingType: "optionalLoading",
                            })
                          }
                        />
                        <CustomSmallButton
                          text={
                            loading.resetLoading ? <Loading /> : "Reset Bill"
                          }
                          icon={
                            !loading.resetLoading && (
                              <PiArrowCircleUpBold className="use-font-style" />
                            )
                          }
                          disabled={
                            !inLatestSession ? true : loading.resetLoading
                          }
                          runFunction={() =>
                            handleAddBill({
                              student_id: studentInfo?.id,
                              reset_bill: true,
                              term: termId,
                              loadingType: "resetLoading",
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <NoRecord message={"No additional bill for this term"} />
                  )}
                  {academic_term?.waivers.length > 0 ? (
                    <div className="new-table-style for-student-bill">
                      <table>
                        <thead>
                          <tr className="heading-style">
                            <th></th>
                            <th>Waivers</th>
                            <th>Percent (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {academic_term?.waivers?.map((obj, index) => (
                            <tr className="content-style">
                              <td
                                style={{
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                }}
                              >
                                {index + 1}.{" "}
                                <input
                                  type="checkbox"
                                  checked={
                                    !!newBill.find(
                                      (item) =>
                                        item?.billName === obj?.billName,
                                    )
                                  }
                                  onChange={() => checkExtraBills(obj, true)}
                                />
                              </td>

                              <td>{obj?.billName}</td>
                              {newBill.find(
                                (item) => item?.billName === obj?.billName,
                              ) ? (
                                <td>
                                  <input
                                    className="text-input"
                                    type="number"
                                    value={
                                      newBill.find(
                                        (item) =>
                                          item.billName === obj.billName,
                                      )?.billAmount || ""
                                    }
                                    onChange={(e) =>
                                      setNewBill((prev) =>
                                        prev.map((item) =>
                                          item.billName === obj.billName
                                            ? {
                                                ...item,
                                                billAmount: e.target.value,
                                              } // Update existing bill
                                            : item,
                                        ),
                                      )
                                    }
                                  />
                                </td>
                              ) : (
                                <td>₦{formatAmount(obj?.billAmount)}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <CustomSmallButton
                        text={
                          loading.waiverLoading ? <Loading /> : "Update Bill"
                        }
                        icon={
                          !loading.waiverLoading && (
                            <PiArrowCircleUpBold className="use-font-style" />
                          )
                        }
                        disabled={
                          !inLatestSession ? true : loading.waiverLoading
                        }
                        runFunction={() =>
                          handleAddBill({
                            student_id: studentInfo?.id,
                            bills: newBill,
                            term: termId,
                            loadingType: "waiverLoading",
                          })
                        }
                      />
                    </div>
                  ) : (
                    <NoRecord message={"No waivers for this term."} />
                  )}
                </div>
              ) : (
                <StudentSessionBill
                  school={user?.school}
                  student={studentInfo}
                  tuition={transformTuitionData(allTuitions)}
                  session={academic_session}
                  term={academic_term}
                  studentClass={studentClass}
                  StudentBillPDF={
                    <StudentSessionBillPDF
                      school={user?.school}
                      student={studentInfo}
                      tuition={transformTuitionData(allTuitions)}
                      session={academic_session}
                      term={academic_term}
                      studentClass={studentClass}
                    />
                  }
                />
              )}
            </div>
            <div className="main overflow">
              {tuition?.payments?.length > 0 ? (
                tuition?.payments?.map((_, index) => (
                  <Receipt
                    school={user?.school}
                    student={studentInfo}
                    tuition={tuition}
                    session={academic_session}
                    term={academic_term}
                    studentClass={studentClass}
                    id={index}
                    ReceiptPDF={
                      <ReceiptPDF
                        school={user?.school}
                        student={studentInfo}
                        tuition={tuition}
                        session={academic_session}
                        term={academic_term}
                        studentClass={studentClass}
                        id={index}
                      />
                    }
                  />
                ))
              ) : (
                <NoRecord
                  message={
                    "No payment record found for this term. Student payment receipt will appear here."
                  }
                />
              )}
            </div>
          </div>
        ) : (
          <NoRecord message={"No bill record found."} />
        )}
      </div>
    </div>
  );
};

export default SchoolBillModal;
