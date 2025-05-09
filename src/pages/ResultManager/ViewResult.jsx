import React, { useEffect, useMemo, useState } from "react";
import "./ResultManager.css";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import NoRecord from "../../components/NoRecord";
import { Link } from "react-router-dom";
import { useSchool } from "../../context/SchoolContext";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { PiArrowCircleDownBold, PiCheckCircleBold } from "react-icons/pi";
import { BiSearch } from "react-icons/bi";
import { approveResult, updatedBill } from "../../services/schoolService";
import Loading from "../../utils/Loader";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import Result from "../../components/Result/Result";
import { useAuth } from "../../context/AuthContext";
import CustomSectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { FiUser } from "react-icons/fi";
import { generatePDF } from "../../utils/Utils";
import { transform } from "framer-motion";
import PDFResult from "../../components/Result/PDFResult";
import { pdf } from "@react-pdf/renderer";
import DataPieChart from "../../components/DataPieChart";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import CummPDFResult from "../../components/Result/CummPDFResult";
import AlertOptionModal from "../../components/modals/AlertModal/AlertOptionModal";

const ViewResult = () => {
  const {
    schoolState,
    setSchoolDatas,
    inLatestSession,
    termId,
    sessionId,
    updateSchoolStateById,
  } = useSchool();
  const {
    classes,
    subjects,
    schoolStudents,
    schoolSession,
    schoolResult,
    schoolTuition,
  } = schoolState;

  const [classId, setClassId] = useState(0);
  const [search, setSearch] = useState("");
  const [gradings, setGradings] = useState([]);
  const [loading, setLoading] = useState({
    approve: false,
    comment: false,
    resultDownload: false,
  });
  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const { authState, logout, hasAccess } = useAuth();
  const { user } = authState;

  const [studentId, setStudentId] = useState(null);
  const [studentComment, setStudentComment] = useState("");

  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const handleOpenOptionModal = () => setIsOptionModalVisible(true);
  const handleCloseOptionModal = () => setIsOptionModalVisible(false);

  const academic_session = schoolSession.find((obj) => obj?.id === sessionId);
  const academic_term = academic_session?.terms.find(
    (obj) => obj.id === termId,
  );

  const [studentList, setStudentList] = useState(null);
  const [studentName, setStudentName] = useState("");

  const assignedClasses =
    user?.class_subject_permission?.map((obj) => obj.classId) || [];

  const mutated_class = classes.filter((obj) =>
    assignedClasses.includes(obj.id),
  );

  const getStudent = (id) =>
    schoolStudents.find((student) => student.id === id);

  const filteredStudents = useMemo(() => {
    return schoolTuition
      .filter(
        (obj) =>
          obj?.student_class === mutated_class[classId]?.id &&
          obj?.academic_session === sessionId &&
          obj?.academic_term === termId,
      )
      .map((obj) => getStudent(obj?.student))
      .sort((a, b) => {
        const lastNameA = a?.last_name.toLowerCase();
        const lastNameB = b?.last_name.toLowerCase();

        return lastNameA.localeCompare(lastNameB);
      });
  }, [schoolTuition, classId, sessionId, termId]);

  const searchFilteredStudents = (search) => {
    return filteredStudents.filter(
      (student) =>
        student?.first_name.toLowerCase().includes(search.toLowerCase()) ||
        student?.middle_name.toLowerCase().includes(search.toLowerCase()) ||
        student?.last_name.toLowerCase().includes(search.toLowerCase()) ||
        search.toLowerCase().includes(student?.first_name.toLowerCase()) ||
        search.toLowerCase().includes(student?.last_name.toLowerCase()) ||
        search.toLowerCase().includes(student?.middle_name.toLowerCase()) ||
        student?.student_id.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const filteredSchoolResult = (id) => {
    return schoolResult?.filter(
      (student) =>
        student.student_class === mutated_class[classId].id &&
        student?.student === id &&
        student?.academic_session === sessionId &&
        student?.academic_term === termId,
    );
  };

  const filteredAllTermResult = (id) => {
    return schoolResult?.filter(
      (student) =>
        student.student_class === mutated_class[classId].id &&
        student?.student === id &&
        student?.academic_session === sessionId,
    );
  };

  const allResult = (id) => {
    const result = schoolResult?.filter(
      (student) =>
        student.student_class === mutated_class[classId].id &&
        student?.student === id &&
        student?.academic_session === sessionId &&
        student?.academic_term === termId,
    );

    const all_result = schoolResult?.filter(
      (student) =>
        student.student_class === mutated_class[classId].id &&
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
        const all_su_re_ids = subject_result.map((s_r) => s_r.academic_term);
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
        [subjects.find((item) => item.id === obj?.subject)?.name]: term_scores,
      });
      term_scores = [];
    });
    return overallResult;
  };

  useEffect(() => {
    const activeSession = schoolSession?.find((obj) => obj?.id === sessionId);
    setGradings(activeSession?.gradings || []);
  }, [schoolSession, sessionId]);

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

  const handleApproveResult = async (student_list) => {
    const body = JSON.stringify({
      student_list: student_list,
      current_session: sessionId,
      current_term: termId,
      current_class: mutated_class[classId]?.name,
    });

    setLoading({ ...loading, approve: true });

    try {
      const response = await approveResult(body);
      setLoading({ ...loading, approve: false });

      if (response.success) {
        handleCloseOptionModal();
        updateSchoolStateById(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  const handleComment = async () => {
    setLoading({ ...loading, comment: true });

    try {
      const response = await updatedBill(
        JSON.stringify({
          student_id: studentId || filteredStudents[0]?.id,
          student_comment: studentComment,
          term: termId,
        }),
      );
      setLoading({ ...loading, comment: false });

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  const checkApprovedStatus = (studentId) => {
    return schoolTuition.find(
      (obj) => obj.student === studentId && obj.academic_term === termId,
    )?.approved_result;
  };

  const downloadPDF = async (doc, filename) => {
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDFAsync = async (student) => {
    try {
      await downloadPDF(
        academic_term?.cumm_result ? (
          <CummPDFResult
            studentObj={student}
            session={academic_session}
            term={academic_term}
            filteredSchoolResult={filteredSchoolResult(student?.id)}
            filteredAllTermResult={filteredAllTermResult(student?.id)}
            gradings={gradings}
            school={user?.school}
            getGradeAndRemark={getGradeAndRemark}
            studentClass={mutated_class[classId]}
            tuition={schoolTuition.find(
              (item) =>
                item?.student === student?.id && item.academic_term === termId,
            )}
            subjects={subjects}
            allResult={allResult}
          />
        ) : (
          <PDFResult
            studentObj={student}
            session={academic_session}
            term={academic_term}
            filteredSchoolResult={filteredSchoolResult(student?.id)}
            gradings={gradings}
            school={user?.school}
            getGradeAndRemark={getGradeAndRemark}
            studentClass={mutated_class[classId]}
            tuition={schoolTuition.find(
              (item) =>
                item?.student === student?.id && item.academic_term === termId,
            )}
            subjects={subjects}
          />
        ),
        `${student?.last_name}-${student?.first_name}-result.pdf`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const downloadALLResult = async (id) => {
    setLoading({ ...loading, resultDownload: true });
    try {
      if (id) {
        const student = getStudent(id);
        downloadPDFAsync(student);
      } else {
        for (const student of filteredStudents) {
          downloadPDFAsync(student);
        }
      }
      setLoading({ ...loading, resultDownload: false });
    } catch (error) {
      setLoading({ ...loading, resultDownload: false });
    }
  };

  const getWaterMark = (img) => ({
    position: "relative", // Allow child elements to stack properly
    width: "100%",
    height: "100%",
    padding: "10px",
    zIndex: 0, // Background watermark stays below content
  });

  const watermarkOverlay = (img) => ({
    content: "''", // Necessary for pseudo-element
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    backgroundImage: `url(${img})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    opacity: 0.1,
    zIndex: -1,
  });

  const studentAllResult = (sub, id) =>
    allResult(id)?.find(
      (obj) => obj[subjects.find((obj) => obj.id === sub)?.name],
    )[subjects.find((obj) => obj.id === sub)?.name];

  const calculateOverallPercentage = (student_id) => {
    const results = filteredSchoolResult(student_id);
    if (!results || results.length === 0) return 0;

    let totalObtainedScore = 0;
    let totalMaxScore = 0;

    results.forEach((result) => {
      const obtainedScore =
        (result?.ca_score || 0) +
        (result?.test_score || 0) +
        (result?.exam_score || 0);

      // Assuming a maximum score of 100 for CA, Test, and Exam each
      const maxScore =
        academic_term.ca_max_score +
        academic_term.test_max_score +
        academic_term.exam_max_score;

      if (academic_term?.cumm_result) {
        totalObtainedScore += parseFloat(
          studentAllResult(result?.subject, student_id).at(-1),
        );
      } else {
        totalObtainedScore += obtainedScore;
      }
      totalMaxScore += maxScore;
    });

    // Calculate and return percentage
    return ((totalObtainedScore / totalMaxScore) * 100).toFixed(2);
  };

  const overallPercentageList = filteredStudents.map((student) =>
    calculateOverallPercentage(student.id),
  );

  const data = useMemo(() => {
    return [
      {
        name: "No. of Pass Students",
        value: overallPercentageList.filter(
          (percentage) => percentage >= academic_term.cut_off_point,
        ).length,
      },
      {
        name: "No. of Fail Students",
        value: overallPercentageList.filter(
          (percentage) => percentage < academic_term.cut_off_point,
        ).length,
      },
    ];
  }, [schoolStudents, classId, overallPercentageList]);

  useEffect(() => {
    if (studentList?.length > 0) {
      handleOpenOptionModal();
    }
  }, [studentList]);

  return (
    <div className="result-container">
      <div className="vr-action-container">
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
        <div className="list-controller-ui">
          <CgChevronLeftO
            className="list-controller-ui-icon"
            onClick={() => setClassId((prev) => Math.max(prev - 1, 0))}
          />
          <h3>{mutated_class && mutated_class[classId]?.name}</h3>
          <CgChevronRightO
            className="list-controller-ui-icon"
            onClick={() =>
              setClassId((prev) => Math.min(prev + 1, classes.length - 1))
            }
          />
        </div>
        <div className="vr-action-btn">
          <CustomSmallButton
            text={`Approve all`}
            icon={<PiCheckCircleBold className="use-font-style" />}
            runFunction={() => {
              setStudentList(filteredStudents.map((student) => student.id));
              setStudentName("all the student's results in this class");
            }}
            disabled={!inLatestSession ? true : false}
          />
          <CustomSmallButton
            text={loading.resultDownload ? <Loading /> : `Download all`}
            icon={
              !loading.resultDownload && (
                <PiArrowCircleDownBold className="use-font-style" />
              )
            }
            runFunction={() => downloadALLResult(null)}
            disabled={loading.resultDownload}
          />
        </div>
      </div>
      {filteredStudents.length > 0 ? (
        <div className="vr-card-container">
          <div className="vr-left">
            {searchFilteredStudents(search).map((obj, index) => (
              <div key={index} className="vr-card">
                <Result
                  watermark={getWaterMark(user?.school?.logo)}
                  watermarkOverlay={watermarkOverlay(user?.school?.logo)}
                  studentObj={obj}
                  session={academic_session}
                  sessionId={sessionId}
                  termId={termId}
                  term={academic_term}
                  filteredSchoolResult={filteredSchoolResult}
                  filteredAllTermResult={filteredAllTermResult}
                  gradings={gradings}
                  inLatestSession={inLatestSession}
                  school={user?.school}
                  getGradeAndRemark={getGradeAndRemark}
                  studentClass={mutated_class[classId]}
                  tuition={schoolTuition.find(
                    (item) =>
                      item?.student === obj?.id &&
                      item?.academic_term === termId,
                  )}
                  subjects={subjects}
                  allResult={allResult}
                  addOns={
                    <CustomSmallButton
                      text={
                        checkApprovedStatus(obj?.id) ? "Approved" : `Approve`
                      }
                      icon={<PiCheckCircleBold className="use-font-style" />}
                      runFunction={() => {
                        setStudentList([obj.id]);
                        setStudentName(
                          `${obj?.last_name} ${obj?.first_name} result`,
                        );
                      }}
                      disabled={checkApprovedStatus(obj?.id) ? true : false}
                    />
                  }
                  downloadPDF={downloadALLResult}
                />
              </div>
            ))}
          </div>
          <div className="vr-right">
            <CustomSectionInput
              icon={<FiUser />}
              placeholder={"Select student to comment..."}
              name={"student_obj"}
              options={filteredStudents.map((student) => ({
                value: student.id,
                label: `${student.first_name} ${student.middle_name} ${student.last_name}`,
              }))}
              handleChange={(e) => setStudentId(e.target.value)}
              value={studentId}
            />
            <textarea
              name="comment"
              id=""
              placeholder="Comment on student result..."
              value={studentComment}
              onChange={(e) => setStudentComment(e.target.value)}
            ></textarea>
            <CustomSmallButton
              text={loading.comment ? <Loading /> : `Comment`}
              runFunction={handleComment}
              disabled={!inLatestSession ? true : loading.comment}
              icon={
                !loading.comment && (
                  <PiCheckCircleBold className="use-font-style" />
                )
              }
            />
            <DataPieChart
              data={data}
              COLORS={["green", "red"]}
              centerIcons={
                <div
                  className="chart-center-text"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <h1>{academic_term?.cut_off_point}%</h1>
                  <p>Pass Mark</p>
                </div>
              }
            />
          </div>
        </div>
      ) : (
        <div className="no-record-container">
          <NoRecord message="No students found in this class." />
        </div>
      )}
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
      <AlertOptionModal
        isVisible={isOptionModalVisible}
        onClose={handleCloseOptionModal}
        message={`Are you sure you want to approve ${studentName}? This can't be undone.`}
        runFunction={() => handleApproveResult(studentList)}
        loading={loading.approve}
      />
      <FeatureLockModal isLocked={hasAccess(6)} />
    </div>
  );
};

export default ViewResult;
