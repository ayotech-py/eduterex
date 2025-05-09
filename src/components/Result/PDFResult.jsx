import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459Wlhzg.ttf", // Regular 400
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_cJD3gnD-w.ttf", // Bold 700
      fontWeight: "bold",
    },
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WxhzA.ttf", // Light 300
      fontWeight: 300,
    },
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.ttf", // Semi-Bold 600
      fontWeight: 600,
    },
  ],
});

const PDFResult = ({
  school,
  studentObj,
  studentClass,
  session,
  term,
  subjects,
  gradings,
  tuition,
  getGradeAndRemark,
  filteredSchoolResult,
}) => {
  const styles = StyleSheet.create({
    sbBillContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
      paddingVertical: 10,
      boxSizing: "border-box",
    },
    sbBillContainerChild: {
      flex: 1,
      minWidth: 0,
      boxSizing: "border-box",
    },
    sbStudentProfile: {
      display: "flex",
      flexDirection: "row",
      textAlign: "left",
    },
    sbStudentProfileText: {
      fontSize: 8,
      fontFamily: "Montserrat",
      flexWrap: "wrap", // Ensures text wraps to the next line
    },
    sbHeading: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      width: "100%",
      marginBottom: -10,
    },
    sbHeadingText: {
      fontSize: 13,
      fontFamily: "Montserrat",
      fontWeight: 600,
      textAlign: "left",
      color: school?.dark_color,
      flexWrap: "wrap", // Ensures text wraps to the next line
      maxWidth: "100%", // Restricts text within the container's width
    },
    sbLeft: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
      gap: 10,
      width: "70%",
    },
    sbRight: {
      backgroundColor: school?.dark_color,
      paddingVertical: 8,
      paddingHorizontal: 20,
      color: "#fff",
      textAlign: "center",
      width: "25%",
    },
    sbLeftImage: {
      width: 50,
      height: 50,
      resizeMode: "cover",
      objectFit: "cover",
    },
    sbBillContent: {
      marginTop: 20,
      marginBottom: 20,
      display: "flex",
      gap: 5,
    },
    schoolContactDiv: {
      marginTop: 10,
      textAlign: "center",
    },
    schoolContactText: {
      fontSize: 8,
      fontWeight: 600,
      fontFamily: "Montserrat",
      flexWrap: "wrap",
    },
    schoolSignatory: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: 80,
      boxSizing: "border-box",
      paddingHorizontal: 40,
    },
    signature: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
    },
    signatoryLine: {
      height: 1,
      width: 130,
      backgroundColor: "#000",
    },
    boldText: {
      fontWeight: "600",
    },
    sbHeadingContainer: {
      display: "flex",
      flexDirection: "row", // Ensures items are laid out horizontally
      flexWrap: "wrap", // Allows content to wrap to the next line
      maxWidth: "100%", // Restricts the container width
      alignItems: "flex-start",
    },
    table: {
      display: "table",
      width: "100%",
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      borderStyle: "solid",
      borderWidth: 3,
      borderColor: "#fff",
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 4,
      fontSize: 7,
      fontFamily: "Montserrat",
      flexWrap: "wrap",
    },
    tableColContent: {
      borderStyle: "solid",
      borderWidth: 3,
      borderColor: "#fff",
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 4,
      fontSize: 8,
      fontFamily: "Montserrat",
      flexWrap: "wrap",
      backgroundColor: school?.light_color,
      textAlign: "center",
    },
    tableHeader: {
      backgroundColor: school?.dark_color,
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      borderColor: "#fff",
    },
    middleSection: {
      display: "flex",
      flexDirection: "row",
    },
    middleSectionLeft: {
      width: "30%",
      display: "flex",
      flex: 1,
    },
    middleSectionRight: {
      width: "70%",
      display: "flex",
      flex: 2,
    },
    profileContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    profileTextContainer: {
      display: "flex",
      gap: 5,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: 15,
    },
  });

  const calculateOverallPercentage = () => {
    const results = filteredSchoolResult;
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

      totalObtainedScore += obtainedScore;
      totalMaxScore += maxScore;
    });

    // Calculate and return percentage
    return ((totalObtainedScore / totalMaxScore) * 100).toFixed(2);
  };

  return (
    <Document>
      <Page size="A4" style={styles.sbBillContainer}>
        {school?.logo && (
          <View
            style={{
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={school?.logo}
              style={{
                width: "100%",
                objectFit: "contain",
                opacity: 0.1,
              }}
            />
          </View>
        )}
        <View id={`result${studentObj?.id}`} style={{ zIndex: 3 }}>
          <View style={styles.sbHeading}>
            <View style={styles.sbLeft}>
              {school?.logo && (
                <Image src={school?.logo} style={styles.sbLeftImage} />
              )}
              <View style={styles.sbHeadingContainer}>
                <Text style={styles.sbHeadingText}>
                  {school?.name.toUpperCase() ?? "School name"}
                </Text>
              </View>
            </View>
            <View style={styles.sbRight}>
              <Text style={{ fontSize: 10, fontFamily: "Montserrat" }}>
                Report Card
              </Text>
            </View>
          </View>
          <View style={styles.sbBillContent}>
            <View style={styles.profileContainer}>
              <View style={styles.profileTextContainer}>
                <View style={styles.sbStudentProfile}>
                  <Text
                    style={[
                      { width: "20%", fontWeight: 600 },
                      styles.sbStudentProfileText,
                    ]}
                  >
                    Name:
                  </Text>
                  <Text style={[{ width: "80%" }, styles.sbStudentProfileText]}>
                    {studentObj?.last_name} {studentObj?.first_name}
                  </Text>
                </View>
                <View style={styles.sbStudentProfile}>
                  <Text
                    style={[
                      { width: "20%", fontWeight: 600 },
                      styles.sbStudentProfileText,
                    ]}
                  >
                    Student ID:
                  </Text>
                  <Text style={[{ width: "80%" }, styles.sbStudentProfileText]}>
                    {studentObj?.student_id}
                  </Text>
                </View>
                <View style={styles.sbStudentProfile}>
                  <Text
                    style={[
                      { width: "20%", fontWeight: 600 },
                      styles.sbStudentProfileText,
                    ]}
                  >
                    Class:
                  </Text>
                  <Text style={[{ width: "80%" }, styles.sbStudentProfileText]}>
                    {studentClass?.name}
                  </Text>
                </View>
                <View style={styles.sbStudentProfile}>
                  <Text
                    style={[
                      { width: "20%", fontWeight: 600 },
                      styles.sbStudentProfileText,
                    ]}
                  >
                    Acad. Session:
                  </Text>
                  <Text style={[{ width: "80%" }, styles.sbStudentProfileText]}>
                    {session?.name}
                  </Text>
                </View>
                <View style={styles.sbStudentProfile}>
                  <Text
                    style={[
                      { width: "20%", fontWeight: 600 },
                      styles.sbStudentProfileText,
                    ]}
                  >
                    Acad. Term:
                  </Text>
                  <Text style={[{ width: "80%" }, styles.sbStudentProfileText]}>
                    {term?.name}
                  </Text>
                </View>
              </View>
              <View>
                {studentObj?.passport && (
                  <Image
                    src={studentObj?.passport}
                    style={styles.profileImage}
                  />
                )}
              </View>
            </View>
            <View style={[{ marginTop: 10 }, styles.table]}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text
                  style={[{ width: "5%", fontWeight: "600" }, styles.tableCol]}
                >
                  S/N
                </Text>
                <Text
                  style={[
                    {
                      width: term?.ca_max_score !== 0 ? "20%" : "30%",
                      fontWeight: "600",
                    },
                    styles.tableCol,
                  ]}
                >
                  Subjects
                </Text>
                {term?.ca_max_score !== 0 && (
                  <Text
                    style={[
                      { width: "15%", fontWeight: "600" },
                      styles.tableCol,
                    ]}
                  >
                    CA Score ({term?.ca_max_score})
                  </Text>
                )}
                <Text
                  style={[{ width: "15%", fontWeight: "600" }, styles.tableCol]}
                >
                  Test Score ({term?.test_max_score})
                </Text>
                <Text
                  style={[{ width: "15%", fontWeight: "600" }, styles.tableCol]}
                >
                  Exam Score ({term?.exam_max_score})
                </Text>
                <Text
                  style={[{ width: "12%", fontWeight: "600" }, styles.tableCol]}
                >
                  Total (
                  {term?.ca_max_score +
                    term?.test_max_score +
                    term?.exam_max_score}
                  )
                </Text>
                <Text
                  style={[
                    {
                      width: term?.ca_max_score !== 0 ? "7%" : "12%",
                      fontWeight: "600",
                    },
                    styles.tableCol,
                  ]}
                >
                  Grade
                </Text>
                <Text
                  style={[{ width: "11%", fontWeight: "600" }, styles.tableCol]}
                >
                  Remark
                </Text>
              </View>

              {/* Table Body */}
              {filteredSchoolResult?.map((studentResult, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[{ width: "5%" }, styles.tableColContent]}>
                    {index + 1}
                  </Text>
                  <Text
                    style={[
                      { width: term?.ca_max_score !== 0 ? "20%" : "30%" },
                      styles.tableColContent,
                    ]}
                  >
                    {subjects.find((obj) => obj.id === studentResult?.subject)
                      ?.name || ""}
                  </Text>
                  {term?.ca_max_score !== 0 && (
                    <Text style={[{ width: "15%" }, styles.tableColContent]}>
                      {studentResult?.ca_score}
                    </Text>
                  )}
                  <Text style={[{ width: "15%" }, styles.tableColContent]}>
                    {studentResult?.test_score}
                  </Text>
                  <Text style={[{ width: "15%" }, styles.tableColContent]}>
                    {studentResult?.exam_score}
                  </Text>
                  <Text style={[{ width: "12%" }, styles.tableColContent]}>
                    {studentResult?.ca_score +
                      studentResult?.test_score +
                      studentResult?.exam_score}
                  </Text>
                  <Text
                    style={[
                      { width: term?.ca_max_score !== 0 ? "7%" : "12%" },
                      styles.tableColContent,
                    ]}
                  >
                    {
                      getGradeAndRemark(
                        studentResult?.ca_score +
                          studentResult?.test_score +
                          studentResult?.exam_score,
                      ).grade
                    }
                  </Text>
                  <Text style={[{ width: "11%" }, styles.tableColContent]}>
                    {
                      getGradeAndRemark(
                        studentResult?.ca_score +
                          studentResult?.test_score +
                          studentResult?.exam_score,
                        gradings,
                      ).remark
                    }
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.middleSection}>
              <View style={styles.middleSectionLeft}>
                <View style={[{ marginTop: 10 }, styles.table]}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text
                      style={[
                        { width: "100%", fontWeight: "600" },
                        styles.tableCol,
                      ]}
                    >
                      Grading System
                    </Text>
                  </View>
                </View>
                {gradings?.map((obj, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[{ width: "20%" }, styles.tableColContent]}>
                      {obj?.grade}
                    </Text>
                    <Text style={[{ width: "40%" }, styles.tableColContent]}>
                      {obj?.minScore} - {obj?.maxScore}
                    </Text>
                    <Text style={[{ width: "40%" }, styles.tableColContent]}>
                      {obj?.remark}{" "}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.middleSectionRight}>
                <View style={[{ marginTop: 10 }, styles.table]}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text
                      style={[
                        { width: "100%", fontWeight: "600" },
                        styles.tableCol,
                      ]}
                    >
                      Class Teacher's Comment
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    {
                      display: "flex",
                      flex: 2,
                    },
                    styles.tableRow,
                  ]}
                >
                  <Text
                    style={[
                      {
                        width: "100%",
                      },
                      styles.tableColContent,
                    ]}
                  >
                    {tuition?.result_comment}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 2,
                    flexDirection: "row",
                  }}
                >
                  <View style={{ width: "60%" }}>
                    <View style={[{ marginTop: 0 }, styles.table]}>
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text
                          style={[
                            { width: "100%", fontWeight: "600" },
                            styles.tableCol,
                          ]}
                        >
                          Attendance
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={[{ width: "80%" }, styles.tableColContent]}>
                        No. of Days Present
                      </Text>
                      <Text style={[{ width: "20%" }, styles.tableColContent]}>
                        {studentObj?.attendance?.filter(
                          (obj) => obj?.status === "Present",
                        )?.length ?? "N/A"}
                      </Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={[{ width: "80%" }, styles.tableColContent]}>
                        No. of Days Absent
                      </Text>
                      <Text style={[{ width: "20%" }, styles.tableColContent]}>
                        {studentObj?.attendance?.filter(
                          (obj) => obj?.status === "Absent",
                        )?.length ?? "N/A"}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "40%" }}>
                    <View style={[{ marginTop: 0 }, styles.table]}>
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text
                          style={[
                            { width: "100%", fontWeight: "600" },
                            styles.tableCol,
                          ]}
                        >
                          Overall Performance
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[{ display: "flex", flex: 2 }, styles.tableRow]}
                    >
                      <Text
                        style={[
                          styles.tableColContent,
                          { width: "100%", fontSize: 20 },
                        ]}
                      >
                        {calculateOverallPercentage()}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.schoolSignatory}>
              <View style={styles.signature}>
                {school?.signature && (
                  <View>
                    <Image
                      src={school?.signature}
                      style={{
                        width: "auto",
                        maxWidth: 100,
                        maxHeight: 60,
                        objectFit: "cover",
                      }}
                    />
                  </View>
                )}
                <View style={styles.signatoryLine} />
                <Text style={[styles.sbStudentProfileText]}>
                  Head of School's Signature
                </Text>
              </View>
              <View style={styles.signature}>
                {school?.stamp && (
                  <View>
                    <Image
                      src={school?.stamp}
                      style={{
                        width: "auto",
                        maxWidth: 100,
                        maxHeight: 60,
                        objectFit: "cover",
                      }}
                    />
                  </View>
                )}
                <View style={styles.signatoryLine} />
                <Text style={[styles.sbStudentProfileText]}>Stamp</Text>
              </View>
            </View>
            <View style={styles.schoolContactDiv}>
              <Text style={[styles.schoolContactText]}>
                Address: {school?.address ?? "Student address"} | Phone:{" "}
                {school?.phone_number ?? "phone"} | Email:{" "}
                {school?.email ?? "school email"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFResult;
