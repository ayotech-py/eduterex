import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import { formatAmount } from "../FormatAmount";

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

const StudentSessionBillPDF = ({
  school,
  student,
  studentClass,
  session,
  term,
  tuition,
}) => {
  const styles = StyleSheet.create({
    sbBillContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      backgroundColor: "#fff",
      padding: 20,
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
      fontSize: 10,
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
    },
    sbHeadingText: {
      fontSize: 12,
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
      gap: 5,
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
      width: "auto",
      height: 30,
      resizeMode: "cover",
    },
    sbBillContent: {
      marginTop: 20,
      marginBottom: 20,
      display: "flex",
      gap: 5,
    },
    schoolContactDiv: {
      marginTop: 20,
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
      paddingHorizontal: 20,
    },
    signature: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
    },
    signatoryLine: {
      height: 1,
      width: 100,
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
      borderWidth: 2,
      borderColor: "#fff",
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 4,
      fontSize: 8,
      fontFamily: "Montserrat",
      flexWrap: "wrap",
    },
    tableColContent: {
      borderStyle: "solid",
      borderWidth: 2,
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
  });

  const getFontWeight = (index) => (tuition?.length === index + 1 ? 600 : 400);
  const waivers = ["Scholarship", "Discount", "Grants", "Others"];

  return (
    <Document>
      <Page size="A5" style={styles.sbBillContainer}>
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
              style={{ width: "100%", objectFit: "contain", opacity: 0.1 }}
            />
          </View>
        )}
        <View id={`result${student?.id}`} style={{ zIndex: 3 }}>
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
                School Bill
              </Text>
            </View>
          </View>
          <View style={styles.sbBillContent}>
            <View style={styles.sbStudentProfile}>
              <Text
                style={[
                  { width: "30%", fontWeight: 600 },
                  styles.sbStudentProfileText,
                ]}
              >
                Name:
              </Text>
              <Text style={[{ width: "70%" }, styles.sbStudentProfileText]}>
                {student?.last_name} {student?.first_name}
              </Text>
            </View>
            <View style={styles.sbStudentProfile}>
              <Text
                style={[
                  { width: "30%", fontWeight: 600 },
                  styles.sbStudentProfileText,
                ]}
              >
                Student ID:
              </Text>
              <Text style={[{ width: "70%" }, styles.sbStudentProfileText]}>
                {student?.student_id}
              </Text>
            </View>
            <View style={styles.sbStudentProfile}>
              <Text
                style={[
                  { width: "30%", fontWeight: 600 },
                  styles.sbStudentProfileText,
                ]}
              >
                Class:
              </Text>
              <Text style={[{ width: "70%" }, styles.sbStudentProfileText]}>
                {studentClass?.name}
              </Text>
            </View>
            <View style={styles.sbStudentProfile}>
              <Text
                style={[
                  { width: "30%", fontWeight: 600 },
                  styles.sbStudentProfileText,
                ]}
              >
                Acad. Session:
              </Text>
              <Text style={[{ width: "70%" }, styles.sbStudentProfileText]}>
                {session?.name}
              </Text>
            </View>

            <View style={[{ marginTop: 10 }, styles.table]}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text
                  style={[{ width: "20%", fontWeight: "600" }, styles.tableCol]}
                >
                  S/N
                </Text>
                <Text
                  style={[{ width: "40%", fontWeight: "600" }, styles.tableCol]}
                >
                  Description
                </Text>
                {session?.terms?.map((obj) => (
                  <Text
                    style={[
                      { width: "40%", fontWeight: "600" },
                      styles.tableCol,
                    ]}
                  >
                    {obj?.name}
                    (#)
                  </Text>
                ))}
                <Text
                  style={[{ width: "40%", fontWeight: "600" }, styles.tableCol]}
                >
                  Total (#)
                </Text>
              </View>

              {/* Table Body */}
              {tuition?.map((obj, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[{ width: "20%" }, styles.tableColContent]}>
                    {index + 1}
                  </Text>
                  {obj?.map((item, idx) => (
                    <Text
                      style={[
                        {
                          width: "40%",
                          fontWeight: getFontWeight(index),
                        },
                        styles.tableColContent,
                      ]}
                    >
                      {typeof item === "string"
                        ? item
                        : waivers.includes(obj[0].split(" ")[0])
                          ? `(${formatAmount(item)})`
                          : formatAmount(item)}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.schoolSignatory}>
              <View style={styles.signature}>
                <View>
                  {school?.signature && (
                    <Image
                      src={school?.signature}
                      style={{ width: "auto", maxHeight: 60, maxWidth: 100 }}
                    />
                  )}
                </View>
                <View style={styles.signatoryLine} />
                <Text style={[styles.sbStudentProfileText]}>
                  Head of School's Signature
                </Text>
              </View>
              <View style={styles.signature}>
                <View>
                  {school?.stamp && (
                    <Image
                      src={school?.stamp}
                      style={{ width: "auto", maxHeight: 60, maxWidth: 100 }}
                    />
                  )}
                </View>
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

export default StudentSessionBillPDF;
