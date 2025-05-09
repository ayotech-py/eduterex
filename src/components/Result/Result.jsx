import React, { useEffect, useState } from "react";
import "../StudentBill/StudentBill.css";
import "./Result.css";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiArrowCircleDownBold } from "react-icons/pi";

const Result = ({
  school,
  sessionId,
  termId,
  session,
  term,
  studentClass,
  getGradeAndRemark,
  gradings,
  studentObj,
  filteredSchoolResult,
  addOns,
  tuition,
  watermark,
  watermarkOverlay,
  subjects,
  allResult,
  filteredAllTermResult,
  downloadPDF,
}) => {
  const [termList, setTermList] = useState([]);
  const calculateOverallPercentage = () => {
    const results = filteredSchoolResult(studentObj?.id);
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
        term.ca_max_score + term.test_max_score + term.exam_max_score;

      if (term?.cumm_result) {
        totalObtainedScore += parseFloat(
          studentAllResult(result?.subject, studentObj?.id).at(-1),
        );
      } else {
        totalObtainedScore += obtainedScore;
      }
      totalMaxScore += maxScore;
    });

    // Calculate and return percentage
    return ((totalObtainedScore / totalMaxScore) * 100).toFixed(2);
  };

  const studentAllResult = (sub) =>
    allResult(studentObj?.id)?.find(
      (obj) => obj[subjects.find((obj) => obj.id === sub)?.name],
    )[subjects.find((obj) => obj.id === sub)?.name];

  useEffect(() => {
    let term_list = [];
    filteredAllTermResult(studentObj?.id).forEach((obj) => {
      const term_name = session?.terms?.find(
        (term) => term.id === obj?.academic_term,
      )?.name;
      if (!term_list.includes(term_name)) {
        term_list.push(term_name);
      }
    });
    setTermList(term_list);
  }, [filteredAllTermResult, studentObj?.id, session?.terms]);

  return (
    <div className="sb-bill-container" style={watermark}>
      <div id={`result${studentObj?.id}`} className="id-field">
        <div className="sb-heading">
          <div className="sb-left">
            <img src={school?.logo} alt="" srcset="" />
            <div className="sb-school-profile">
              <h3 style={{ color: school?.dark_color }}>
                {school?.name.toUpperCase() ?? "School name"}
              </h3>
            </div>
          </div>
          <div
            className="sb-right"
            style={{ backgroundColor: school?.dark_color }}
          >
            <p>Report Card</p>
          </div>
        </div>
        <div className="sb-bill-content">
          <div className="sb-student-profile">
            <h4>Name:</h4>
            <p>
              {studentObj?.last_name} {studentObj?.first_name}
            </p>
          </div>
          <div className="sb-student-profile">
            <h4>Student ID:</h4>
            <p>{studentObj?.student_id}</p>
          </div>
          <div className="sb-student-profile">
            <h4>Class:</h4>
            <p>{studentClass?.name}</p>
          </div>
          <div className="sb-student-profile">
            <h4>Acad. Session:</h4>
            <p>{session?.name}</p>
          </div>
          <div className="sb-student-profile">
            <h4>Acad. Term:</h4>
            <p>{term?.name}</p>
          </div>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th style={{ backgroundColor: school?.dark_color }}>S/N</th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Subjects
                  </th>
                  {term?.ca_max_score !== 0 && (
                    <th style={{ backgroundColor: school?.dark_color }}>
                      CA Score ({term?.ca_max_score})
                    </th>
                  )}
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Test Score ({term?.test_max_score})
                  </th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Exam Score ({term?.exam_max_score})
                  </th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Total (
                    {term?.ca_max_score +
                      term?.test_max_score +
                      term?.exam_max_score}
                    )
                  </th>
                  {term?.cumm_result &&
                    termList?.map((obj, index) => (
                      <th
                        key={index}
                        style={{ backgroundColor: school?.dark_color }}
                      >
                        {obj} (100%){" "}
                      </th>
                    ))}
                  {term?.cumm_result && (
                    <th style={{ backgroundColor: school?.dark_color }}>
                      Cumm. Scores (100%)
                    </th>
                  )}

                  <th style={{ backgroundColor: school?.dark_color }}>Grade</th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSchoolResult(studentObj?.id)?.map(
                  (studentResult, index) => (
                    <tr key={index} className="content-style">
                      <td style={{ backgroundColor: school?.light_color }}>
                        {index + 1}
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        {
                          subjects.find(
                            (obj) => obj.id === studentResult?.subject,
                          )?.name
                        }
                      </td>
                      {term?.ca_max_score !== 0 && (
                        <td style={{ backgroundColor: school?.light_color }}>
                          {studentResult?.ca_score}
                        </td>
                      )}
                      <td style={{ backgroundColor: school?.light_color }}>
                        {studentResult?.test_score}
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        {studentResult?.exam_score}
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        {studentResult?.ca_score +
                          studentResult?.test_score +
                          studentResult?.exam_score}
                      </td>
                      {term?.cumm_result &&
                        studentAllResult(studentResult?.subject)?.map(
                          (obj, index) => (
                            <td
                              key={index}
                              style={{ backgroundColor: school?.light_color }}
                            >
                              {obj}
                            </td>
                          ),
                        )}
                      {term?.cumm_result ? (
                        <td style={{ backgroundColor: school?.light_color }}>
                          {
                            getGradeAndRemark(
                              studentAllResult(studentResult?.subject).at(-1),
                            ).grade
                          }
                        </td>
                      ) : (
                        <td style={{ backgroundColor: school?.light_color }}>
                          {
                            getGradeAndRemark(
                              studentResult?.ca_score +
                                studentResult?.test_score +
                                studentResult?.exam_score,
                            ).grade
                          }
                        </td>
                      )}
                      {term?.cumm_result ? (
                        <td style={{ backgroundColor: school?.light_color }}>
                          {
                            getGradeAndRemark(
                              studentAllResult(studentResult?.subject).at(-1),
                            ).remark
                          }
                        </td>
                      ) : (
                        <td style={{ backgroundColor: school?.light_color }}>
                          {
                            getGradeAndRemark(
                              studentResult?.ca_score +
                                studentResult?.test_score +
                                studentResult?.exam_score,
                              gradings,
                            ).remark
                          }
                        </td>
                      )}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <div className="result-helper">
            <div className="new-table-style">
              <table>
                <thead>
                  <tr className="heading-style">
                    <th
                      style={{ backgroundColor: school?.dark_color }}
                      colSpan={3}
                    >
                      Grading System
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gradings.map((obj, index) => (
                    <tr key={index} className="content-style">
                      <td style={{ backgroundColor: school?.light_color }}>
                        {obj?.grade}
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        {obj?.minScore} - {obj?.maxScore}
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        {obj?.remark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="helper-container">
              <div className="new-table-style">
                <table>
                  <thead>
                    <tr className="heading-style">
                      <th style={{ backgroundColor: school?.dark_color }}>
                        Class Teacher's Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="content-style comment">
                      <td style={{ backgroundColor: school?.light_color }}>
                        {tuition?.result_comment}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="new-table-style bottom-helper">
                <table>
                  <thead>
                    <tr className="heading-style">
                      <th
                        style={{ backgroundColor: school?.dark_color }}
                        colSpan={2}
                      >
                        Attendance
                      </th>
                      <th style={{ backgroundColor: school?.dark_color }}>
                        Overall Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="content-style">
                      <td
                        style={{ backgroundColor: school?.light_color }}
                        className="bold-text"
                      >
                        No. of Days Present
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        {studentObj?.attendance?.filter(
                          (obj) => obj?.status === "Present",
                        )?.length ?? "N/A"}
                      </td>
                      <td
                        rowSpan={2}
                        className="bold-text"
                        style={{
                          fontSize: "25px",
                          verticalAlign: "middle",
                          textAlign: "center",
                          backgroundColor: school?.light_color,
                        }}
                      >
                        {calculateOverallPercentage()}%
                      </td>
                    </tr>
                    <tr className="content-style">
                      <td
                        style={{ backgroundColor: school?.light_color }}
                        className="bold-text"
                      >
                        No. of Days Absent
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        {studentObj?.attendance?.filter(
                          (obj) => obj?.status === "Absent",
                        )?.length ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="school-signatory">
            <div className="signature">
              <div className="signatory-line"></div>
              <p>Head of School's Signature</p>
            </div>
            <div className="signature">
              <div className="signatory-line"></div>
              <p>School Stamp</p>
            </div>
          </div>
          <div className="school-contact-div">
            <p style={{ fontSize: "14px" }}>
              <span>Address: </span>
              {school?.address ?? "Student address"} | <span>Phone: </span>
              {school?.phone_number ?? "phone"} | <span>Email: </span>
              {school?.email ?? "school email"}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {addOns}
        <CustomSmallButton
          text={"Download"}
          icon={<PiArrowCircleDownBold className="use-font-style" />}
          runFunction={() => downloadPDF(studentObj?.id)}
        />
      </div>
      <div
        style={{
          ...watermarkOverlay,
          position: "absolute",
          zIndex: 0, // Ensure this is below all visible elements
        }}
      ></div>
    </div>
  );
};

export default Result;
