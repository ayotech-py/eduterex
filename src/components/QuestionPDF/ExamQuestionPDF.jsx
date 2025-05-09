import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { formatDate } from "../../utils/Utils";
import MontserratMedium from "../../fonts/Montserrat-Medium.ttf";

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
      src: MontserratMedium, // Light 500
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.ttf", // Semi-Bold 600
      fontWeight: 600,
    },
  ],
});

const ExamQuestionPDF = ({
  school,
  session,
  term,
  subject,
  class_name,
  settings,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 5,
      backgroundColor: "#fff",
      padding: 20,
      boxSizing: "border-box",
    },
    logoStyle: { width: "auto", height: 45, resizeMode: "cover" },
    schoolProfileContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    schoolProfile: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 1,
    },
    headingText: {
      fontSize: 15,
      fontWeight: 600,
      fontFamily: "Montserrat",
    },
    bodyText: {
      fontSize: settings?.font_size ?? 12,
      fontFamily: "Montserrat",
      fontWeight: "bold",
    },
    boldText: {
      fontWeight: 500,
    },
    centerText: {
      textAlign: "center",
    },
    examDetail: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    questionContainer: {
      display: "flex",
      width: "100%",
      gap: 10,
      marginTop: 5,
    },
    question: {
      display: "flex",
      flexDirection: "row",
      gap: 5,
      marginRight: 20,
    },
    questionImage: {
      maxWidth: 150,
      height: 100,
      resizeMode: "cover",
    },
    doubleColumnContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    column: {
      flexDirection: "column",
      gap: 10,
    },
    leftColumn: {
      width: "50%", // Ensure columns don't overlap
      borderRightWidth: 1,
      paddingRight: 10,
    },
    rightColumn: {
      width: "48%",
    },
  });

  const OptionType = ({ question }) => {
    return (
      <View style={{ display: "flex", gap: 2 }}>
        {settings.question_layout.split("-")[0].trim() === "Stacked" &&
          settings.option_layout.split("-")[0].trim() === "Side by Side" && (
            <Text style={styles.bodyText}>
              {question.options
                .map(
                  (option, index) =>
                    `(${String.fromCharCode(97 + index)}) ${option}`,
                )
                .join(" ")}
            </Text>
          )}
        {settings.question_layout.split("-")[0].trim() === "Stacked" &&
          settings.option_layout.split("-")[0].trim() ===
            "Stacked Vertically" &&
          question.options.map((option, index) => (
            <Text
              style={styles.bodyText}
            >{`(${String.fromCharCode(97 + index)}) ${option}`}</Text>
          ))}
        {question.image && (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image src={question.image} style={styles.questionImage} />
          </View>
        )}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.container}>
        <View style={styles.schoolProfileContainer}>
          <Image src={school?.logo ?? ""} style={styles.logoStyle} />
          <View style={styles.schoolProfile}>
            <Text style={styles.headingText}>
              {school?.name?.toUpperCase() ?? "School name"}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Address: </Text>
              {school?.address ?? "School address"}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Tel: </Text>{" "}
              {school?.phone_number ?? "School phone"} |{" "}
              <Text style={styles.boldText}>Email: </Text>
              {school?.email ?? "school email"}
            </Text>
          </View>
        </View>
        <Text style={[styles.bodyText, styles.boldText, styles.centerText]}>
          {term?.name?.toUpperCase() ?? "academic term"} EXAMINATION{" "}
          {session?.name?.toUpperCase() ?? "academic session"}
        </Text>
        <View style={styles.examDetail}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Subject: </Text>
            {subject}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Class: </Text>
            {class_name}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Duration: </Text>
            {settings?.duration ?? "duration"}
          </Text>
        </View>
        <View style={styles.examDetail}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Name: </Text>
            ________________________
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Student ID: </Text>
            __________________
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Date: </Text>
            {settings?.date ? formatDate(settings?.date) : ""}
          </Text>
        </View>
        {settings.questions.filter((obj) => obj.question_type === "MCQ")
          .length > 0 && (
          <View style={styles.questionContainer}>
            <View>
              <Text style={[styles.bodyText, styles.boldText]}>
                Objective Questions
              </Text>
              <Text style={[styles.bodyText, styles.boldText]}>
                Instruction: {settings.mcq_instr}
              </Text>
            </View>
            {settings.column_layout.split("-")[0].trim() === "Double Column" ? (
              <View style={styles.doubleColumnContainer}>
                {/* Left Column */}
                <View style={[styles.column, styles.leftColumn]}>
                  {settings.questions
                    .filter((obj) => obj.question_type === "MCQ")
                    .slice(
                      0,
                      Math.ceil(
                        settings.questions.filter(
                          (obj) => obj.question_type === "MCQ",
                        ).length / 2,
                      ),
                    )
                    .map((question, index) => (
                      <View key={index} style={styles.question}>
                        <Text style={styles.bodyText}>{index + 1}.</Text>
                        <View>
                          <Text style={styles.bodyText}>
                            {question.question}{" "}
                            {settings.question_layout.split("-")[0].trim() ===
                              "Side by Side" &&
                              question.options
                                .map(
                                  (option, index) =>
                                    `(${String.fromCharCode(97 + index)}) ${option}`,
                                )
                                .join(" ")}
                          </Text>
                          <OptionType question={question} />
                        </View>
                      </View>
                    ))}
                </View>

                {/* Right Column */}
                <View style={[styles.column, styles.rightColumn]}>
                  {settings.questions
                    .filter((obj) => obj.question_type === "MCQ")
                    .slice(
                      Math.ceil(
                        settings.questions.filter(
                          (obj) => obj.question_type === "MCQ",
                        ).length / 2,
                      ),
                    )
                    .map((question, index) => (
                      <View key={index} style={styles.question}>
                        <Text style={styles.bodyText}>
                          {index +
                            1 +
                            Math.ceil(
                              settings.questions.filter(
                                (obj) => obj.question_type === "MCQ",
                              ).length / 2,
                            )}
                          .
                        </Text>
                        <View>
                          <Text style={styles.bodyText}>
                            {question.question}{" "}
                            {settings.question_layout.split("-")[0].trim() ===
                              "Side by Side" &&
                              question.options
                                .map(
                                  (option, index) =>
                                    `(${String.fromCharCode(97 + index)}) ${option}`,
                                )
                                .join(" ")}
                          </Text>
                          <OptionType question={question} />
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            ) : (
              settings.questions
                .filter((obj) => obj.question_type === "MCQ")
                .map((question, index) => (
                  <View style={{ display: "flex" }} key={index}>
                    <View style={[styles.question]}>
                      <Text style={styles.bodyText}>{index + 1}.</Text>
                      <View>
                        <Text style={styles.bodyText}>
                          {question.question}{" "}
                          {settings.question_layout.split("-")[0].trim() ===
                            "Side by Side" &&
                            question.options
                              .map(
                                (option, index) =>
                                  `(${String.fromCharCode(97 + index)}) ${option}`,
                              )
                              .join(" ")}
                        </Text>
                        <OptionType question={question} />
                      </View>
                    </View>
                  </View>
                ))
            )}
          </View>
        )}
        {settings.questions.filter((obj) => obj.question_type === "Cloze")
          .length > 0 && (
          <View style={styles.questionContainer}>
            <view>
              <Text style={[styles.bodyText, styles.boldText]}>
                Cloze Questions
              </Text>
              <Text style={[styles.bodyText, styles.boldText]}>
                Instruction: {settings.cloze_instr}
              </Text>
            </view>
            {settings.questions
              .filter((obj) => obj.question_type === "Cloze")
              .map((question, index) => (
                <View>
                  <View style={[styles.question]}>
                    <Text style={styles.bodyText}>{index + 1}.</Text>
                    <Text style={styles.bodyText}>{question.question} </Text>
                  </View>
                  {question.image && (
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src={question.image}
                        style={styles.questionImage}
                      />
                    </View>
                  )}
                </View>
              ))}
          </View>
        )}
        {settings.questions.filter((obj) => obj.question_type === "Theory")
          .length > 0 && (
          <View style={styles.questionContainer}>
            <View>
              <Text style={[styles.bodyText, styles.boldText]}>
                Theory Questions
              </Text>
              <Text style={[styles.bodyText, styles.boldText]}>
                Instruction: {settings.theory_instr}
              </Text>
            </View>
            {settings.questions
              .filter((obj) => obj.question_type === "Theory")
              .map((question, index) => (
                <View>
                  <View style={[styles.question]}>
                    <Text style={styles.bodyText}>{index + 1}.</Text>
                    <Text style={styles.bodyText}>{question.question} </Text>
                  </View>
                  {question.image && (
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src={question.image}
                        style={styles.questionImage}
                      />
                    </View>
                  )}
                </View>
              ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ExamQuestionPDF;
