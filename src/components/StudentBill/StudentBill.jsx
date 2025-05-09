import React, { useState } from "react";
import "./StudentBill.css";
import { formatAmount } from "../FormatAmount";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiArrowCircleDownBold, PiCheckCircleBold } from "react-icons/pi";
import Loading from "../../utils/Loader";
import { generatePDF } from "../../utils/Utils";
import { PDFDownloadLink } from "@react-pdf/renderer";

const StudentBill = ({
  school,
  student,
  tuition,
  session,
  term,
  studentClass,
  StudentBillPDF,
}) => {
  const [loading, setLoading] = useState(false);
  const waivers = ["Scholarship", "Discount", "Grants", "Others"];

  const totalBillAmount =
    tuition?.bills.reduce((total, obj) => {
      return (
        total +
        (waivers.includes(obj?.billName) ? 0 : parseFloat(obj?.billAmount) || 0)
      );
    }, 0) - tuition?.waiver;

  return (
    <div className="sb-bill-container">
      <div id="schoolbill">
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
            <p>School Bill</p>
          </div>
        </div>
        <div className="sb-bill-content">
          <div className="sb-student-profile">
            <h4>Name:</h4>
            <p>
              {student?.last_name} {student?.first_name}
            </p>
          </div>
          <div className="sb-student-profile">
            <h4>Student ID:</h4>
            <p>{student?.student_id}</p>
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
                    Description
                  </th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Amount (₦)
                  </th>
                </tr>
              </thead>
              <tbody>
                {tuition?.bills.map((obj, index) => (
                  <tr className="content-style">
                    <td
                      style={{
                        backgroundColor: school?.light_color,
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      {index + 1}.{" "}
                    </td>

                    <td style={{ backgroundColor: school?.light_color }}>
                      {obj?.billName}
                    </td>
                    <td style={{ backgroundColor: school?.light_color }}>
                      {waivers.includes(obj?.billName)
                        ? `(${formatAmount(tuition?.waiver)})`
                        : `${formatAmount(obj?.billAmount)}`}
                    </td>
                  </tr>
                ))}
                <tr className="content-style">
                  <td
                    colSpan="2"
                    style={{
                      backgroundColor: school?.light_color,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Total:
                  </td>
                  <td
                    style={{
                      backgroundColor: school?.light_color,
                      fontWeight: "bold",
                    }}
                  >
                    {formatAmount(totalBillAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
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
            <p>
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
        }}
      >
        <PDFDownloadLink
          document={StudentBillPDF}
          fileName={`${student?.last_name}-${student?.first_name}-schoolbill.pdf`}
        >
          {({ loading }) => (
            <CustomSmallButton
              text={loading ? "Preparing Document..." : "Download"}
              icon={
                !loading && <PiArrowCircleDownBold className="use-font-style" />
              }
              disabled={loading}
            />
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default StudentBill;
