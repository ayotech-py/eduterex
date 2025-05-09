import React, { useState } from "react";
import "./StudentBill.css";
import { formatAmount } from "../FormatAmount";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiArrowCircleDownBold, PiCheckCircleBold } from "react-icons/pi";
import Loading from "../../utils/Loader";
import { generatePDF } from "../../utils/Utils";
import { PDFDownloadLink } from "@react-pdf/renderer";

const StudentSessionBill = ({
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
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th style={{ backgroundColor: school?.dark_color }}>S/N</th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Description
                  </th>
                  {session?.terms?.map((obj) => (
                    <th style={{ backgroundColor: school?.dark_color }}>
                      {obj?.name} (₦)
                    </th>
                  ))}
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Total (₦)
                  </th>
                </tr>
              </thead>
              <tbody>
                {tuition?.map((obj, index) => (
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
                    {obj?.map((item, idx) => (
                      <td
                        style={{
                          backgroundColor: school?.light_color,
                          fontWeight:
                            tuition?.length === index + 1 ? "bold" : "none",
                        }}
                      >
                        {typeof item === "string"
                          ? item
                          : waivers.includes(obj[0].split(" ")[0])
                            ? `(${formatAmount(item)})`
                            : formatAmount(item)}
                      </td>
                    ))}
                  </tr>
                ))}
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

export default StudentSessionBill;
