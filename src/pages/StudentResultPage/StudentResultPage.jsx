import React, { useState } from "react";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { useSchool } from "../../context/SchoolContext";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { FaCheckCircle } from "react-icons/fa";
import Loading from "../../utils/Loader";
import { PiCheckCircleBold } from "react-icons/pi";
import "../SchoolBillPage/SchoolBillPage.css";
import { getSchoolBill } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import { isFormValid } from "../../utils/OnboardingUtils/FormChecker";
import { downloadPDF } from "../../utils/Utils";
import PDFResult from "../../components/Result/PDFResult";
import CummPDFResult from "../../components/Result/CummPDFResult";

const StudentResultPage = () => {
  const { schoolState, sessionId, termId } = useSchool();
  const { schoolSession, student, studentClass, schoolTuition } = schoolState;

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const sessionList = schoolSession.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const [formData, setFormData] = useState({
    session: "",
    term: "",
    type: "result",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getGradeAndRemark = (score) => {
    score = Math.round(score);
    const gradeList =
      schoolSession?.find((obj) => obj?.is_active)?.gradings || [];
    for (let gradeInfo of gradeList) {
      if (score >= gradeInfo.minScore && score <= gradeInfo.maxScore) {
        return {
          grade: gradeInfo.grade,
          remark: gradeInfo.remark,
        };
      }
    }

    // Return a default value for invalid scores
    return {
      grade: "Invalid",
      remark: "Score out of range",
    };
  };

  const handleSubmit = async () => {
    const checkForm = isFormValid(formData, setModalMessage);
    if (!checkForm) {
      setSuccessStatus(false);
      return;
    }
    setIsLoading(true);

    try {
      const response = await getSchoolBill(formData);

      if (response.success) {
        const data = response.studentResult;
        const allTuition = response.allTuition;
        const academic_session = schoolSession.find(
          (obj) => obj?.id === sessionId,
        );
        const academic_term = academic_session?.terms.find(
          (obj) => obj.id === parseInt(formData.term),
        );

        const allResult = (id) => {
          const result = data?.filter(
            (student) =>
              student.student_class === studentClass?.id &&
              student?.student === id &&
              student?.academic_session === sessionId,
            /* student?.academic_term === parseInt(formData.term), */
          );

          const all_result = data?.filter(
            (student) =>
              student.student_class === studentClass.id &&
              student?.student === id &&
              student?.academic_session === sessionId,
          );
          let overallResult = [];
          result?.forEach((obj) => {
            let term_scores = [];

            const subject_result = all_result?.filter(
              (item2) => item2?.subject === obj?.subject,
            );
            academic_session?.terms.forEach((term_sc) => {
              const all_su_re_ids = subject_result.map(
                (s_r) => s_r.academic_term,
              );
              if (all_su_re_ids.includes(term_sc.id)) {
                const sub_res_by_term_id = subject_result.find(
                  (s_r) => s_r.academic_term === term_sc.id,
                );
                const total_subject_scores =
                  sub_res_by_term_id?.ca_score +
                  sub_res_by_term_id?.test_score +
                  sub_res_by_term_id?.exam_score;
                term_scores.push(total_subject_scores);
              } else {
                term_scores.push(0);
              }
            });
            const cumm_score =
              term_scores?.reduce((sum, acc) => sum + acc, 0) /
              academic_session?.terms?.length;
            term_scores.push(cumm_score.toFixed(1));
            overallResult.push({
              [studentClass?.subjects.find((item) => item.id === obj?.subject)
                ?.name]: term_scores,
            });
            term_scores = [];
          });
          return overallResult;
        };

        await downloadPDF(
          academic_term?.cumm_result ? (
            <CummPDFResult
              studentObj={student}
              session={academic_session}
              term={academic_term}
              filteredSchoolResult={data.filter(
                (obj) =>
                  obj.student_class === studentClass?.id &&
                  obj?.academic_session === sessionId &&
                  obj?.academic_term === parseInt(formData.term),
              )}
              filteredAllTermResult={data.filter(
                (obj) =>
                  obj.student_class === studentClass?.id &&
                  obj?.academic_session === sessionId,
              )}
              gradings={academic_session?.gradings}
              school={student?.school}
              getGradeAndRemark={getGradeAndRemark}
              studentClass={studentClass}
              tuition={allTuition.find(
                (item) => item.academic_term === parseInt(formData.term),
              )}
              subjects={studentClass?.subjects}
              allResult={allResult}
            />
          ) : (
            <PDFResult
              studentObj={student}
              session={academic_session}
              term={academic_term}
              filteredSchoolResult={data}
              gradings={academic_session?.gradings}
              school={student?.school}
              getGradeAndRemark={getGradeAndRemark}
              studentClass={studentClass}
              tuition={schoolTuition[0]}
              subjects={studentClass?.subjects}
            />
          ),
          `${student?.last_name}-${student?.first_name}-schoolbill.pdf`,
        );
        setIsLoading(false);
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setIsLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  return (
    <div className="sbp-container">
      <div className="sbp">
        <h3>Generate Academic Result</h3>
        <CustomSelectionInput
          placeholder={"Session"}
          name={"session"}
          value={formData.session}
          handleChange={handleChange}
          options={sessionList || []}
        />
        <CustomSelectionInput
          placeholder={"Term"}
          name={"term"}
          value={formData.term}
          handleChange={handleChange}
          options={
            schoolSession
              ?.filter((item) => item?.id === parseInt(formData?.session))[0]
              ?.terms?.map((item) => ({
                label: item?.name,
                value: item?.id,
              })) || []
          }
        />
        <CustomSmallButton
          text={isLoading ? <Loading /> : "Generate Result"}
          runFunction={handleSubmit}
          disabled={isLoading}
          icon={!isLoading && <PiCheckCircleBold className="use-font-style" />}
        />
      </div>
      <AlertModal
        isVisible={modalMessage ? true : false}
        onClose={() => setModalMessage("")}
        message={modalMessage}
        success={successStatus}
      />
    </div>
  );
};

export default StudentResultPage;
