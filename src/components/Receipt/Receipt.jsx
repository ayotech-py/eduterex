import React, { useState } from "react";
import "../StudentBill/StudentBill.css";
import { formatAmount } from "../FormatAmount";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiArrowCircleDownBold, PiCheckCircleBold } from "react-icons/pi";
import Loading from "../../utils/Loader";
import { formatDate, generatePDF, toTitleCase } from "../../utils/Utils";
import { toWords } from "number-to-words";
import { PDFDownloadLink } from "@react-pdf/renderer";

const Receipt = ({
  school,
  student,
  tuition,
  session,
  term,
  studentClass,
  id,
  ReceiptPDF,
}) => {
  const [loading, setLoading] = useState(false);
  const waivers = ["Scholarship", "Discount", "Grants", "Others"];
  const totalAmountPaid = tuition?.payments?.reduce(
    (sum, acc, index) => (index <= id ? sum + parseInt(acc?.amount) : sum),
    0,
  );

  return (
    <div className="sb-bill-container">
      <div id={`schoolreceipt$${id}`}>
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
            <p>Payment Receipt</p>
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
                    Date Paid
                  </th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Amount
                  </th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Amount in words
                  </th>
                </tr>
              </thead>
              <tbody>
                {tuition?.payments
                  ?.filter((_, index) => index <= id)
                  .map((obj, index) => (
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
                        {formatDate(obj?.payment_date)}
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        ₦{formatAmount(obj?.amount)}
                      </td>
                      <td style={{ backgroundColor: school?.light_color }}>
                        {toTitleCase(toWords(obj?.amount))} Naira Only
                      </td>
                    </tr>
                  ))}
                {tuition?.waiver > 0 && (
                  <tr className="content-style">
                    <td
                      style={{
                        backgroundColor: school?.light_color,
                        paddingLeft: "5px",
                        paddingRight: "5px",
                      }}
                    >
                      {tuition?.payments?.length + 1}.{" "}
                    </td>
                    <td style={{ backgroundColor: school?.light_color }}>
                      {waivers.map((obj) => {
                        const w = tuition?.bills?.find(
                          (item) => item.billName === obj,
                        );
                        return `${w?.billName ?? ""}`;
                      })}
                    </td>
                    <td style={{ backgroundColor: school?.light_color }}>
                      (₦{formatAmount(tuition?.waiver)})
                    </td>
                    <td style={{ backgroundColor: school?.light_color }}>
                      {toTitleCase(toWords(tuition?.waiver))} Naira Only
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Total Bill
                  </th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Total Amount Paid
                  </th>
                  <th style={{ backgroundColor: school?.dark_color }}>
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="content-style">
                  <td
                    style={{ backgroundColor: school?.light_color }}
                    className="bold-text"
                  >
                    ₦{formatAmount(tuition?.total_fee)}
                  </td>
                  <td
                    style={{ backgroundColor: school?.light_color }}
                    className="bold-text"
                  >
                    ₦{formatAmount(totalAmountPaid + parseInt(tuition?.waiver))}
                  </td>
                  <td
                    style={{ backgroundColor: school?.light_color }}
                    className="bold-text"
                  >
                    ₦
                    {formatAmount(
                      tuition?.total_fee - totalAmountPaid - tuition?.waiver,
                    )}
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
          document={ReceiptPDF}
          fileName={`${student?.last_name}-${student?.first_name}-receipt-${tuition?.payments[id].ref_number}.pdf`}
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

export default Receipt;
