import React, { useState, useEffect } from "react";
import "./SchoolAccountManager.css";
import DataPieChart from "../../components/DataPieChart";
import { useSchool } from "../../context/SchoolContext";
import { formatAmount } from "../../components/FormatAmount";
import { CgChevronLeftO, CgChevronRightO } from "react-icons/cg";
import { FaDollarSign } from "react-icons/fa";
import TuitionSessionChart from "../../components/SessionTuitionChart";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import { useAuth } from "../../context/AuthContext";

const SchoolAccountManager = () => {
  const { schoolState, sessionId, termId } = useSchool();
  const { classes, schoolTuition, schoolSession } = schoolState;

  const { hasAccess } = useAuth();

  const [classesAccount, setClassesAccount] = useState([]);
  const [termAccount, setTermAccount] = useState([]);
  const [overallAnalysis, setOverallAnalysis] = useState([]);

  const session = schoolSession?.find((obj) => obj?.id === sessionId);

  const classAccount = (classId) => {
    const returnedData = [];
    const classAccount = schoolTuition.filter(
      (account) => account.student_class === classId,
    );

    const termIds = session?.terms.map((term) => term.id) || [];

    // Ensure termIds always has 3 elements
    while (termIds.length < 3) {
      termIds.push(`dummy-${termIds.length + 1}`);
    }

    termIds?.forEach((term_id) => {
      const fees = {
        term_name: "N/A",
        receivedFees: 0,
        expectedFees: 0,
        waivers: 0,
        noFullPayment: 0,
        noPartPayment: 0,
        noNoPayment: 0,
        percentagePaid: 0,
      };

      if (!term_id.toString().startsWith("dummy")) {
        classAccount?.forEach((account) => {
          if (account.academic_term === term_id) {
            fees.noFullPayment +=
              parseInt(account.amount_paid) + parseInt(account.waiver) ===
              parseInt(account.total_fee)
                ? 1
                : 0;
            fees.noPartPayment +=
              parseInt(account.amount_paid) + parseInt(account.waiver) > 0 &&
              parseInt(account.amount_paid) + parseInt(account.waiver) <
                account.total_fee
                ? 1
                : 0;
            fees.noNoPayment +=
              parseInt(account.amount_paid) + parseInt(account.waiver) === 0
                ? 1
                : 0;
            fees.receivedFees += parseFloat(account.amount_paid);
            fees.waivers += parseFloat(account.waiver);
            fees.expectedFees += parseFloat(account.total_fee);
          }
        });

        fees.percentagePaid = fees.expectedFees
          ? ((fees.receivedFees + fees.waivers) / fees.expectedFees) * 100
          : 0;
        fees.term_name = session.terms.find(
          (term) => term.id === term_id,
        )?.name;
      } else {
        fees.noFullPayment = 0;
        fees.noPartPayment = 0;
        fees.noNoPayment = 0;
        fees.waivers = 0;
        fees.receivedFees = 0;
        fees.expectedFees = 0;

        fees.percentagePaid = fees.expectedFees
          ? ((fees.receivedFees + fees.waivers) / fees.expectedFees) * 100
          : 0;
        fees.term_name = "N/A";
      }

      returnedData.push(fees); // Push a fresh fees object each time
    });

    return returnedData;
  };

  const overallTermAccount = () => {
    const returnedData = [];

    const termIds = session?.terms.map((term) => term.id) || [];

    // Ensure termIds always has 3 elements
    while (termIds.length < 3) {
      termIds.push(`dummy-${termIds.length + 1}`);
    }

    termIds?.forEach((term_id) => {
      const overallFees = {
        term_name: "N/A",
        receivedFees: 0,
        expectedFees: 0,
        waivers: 0,
        noFullPayment: 0,
        noPartPayment: 0,
        noNoPayment: 0,
        percentagePaid: 0,
      };

      if (!term_id.toString().startsWith("dummy")) {
        schoolTuition?.forEach((account) => {
          if (account.academic_term === term_id) {
            overallFees.noFullPayment +=
              parseInt(account.amount_paid) + parseInt(account.waiver) ===
              parseInt(account.total_fee)
                ? 1
                : 0;

            overallFees.noPartPayment +=
              parseInt(account.amount_paid) + parseInt(account.waiver) > 0 &&
              parseInt(account.amount_paid) + parseInt(account.waiver) <
                account.total_fee
                ? 1
                : 0;

            overallFees.noNoPayment +=
              parseInt(account.amount_paid) + parseInt(account.waiver) === 0
                ? 1
                : 0;
            overallFees.receivedFees += parseFloat(account.amount_paid);
            overallFees.expectedFees += parseFloat(account.total_fee);
            overallFees.waivers += parseFloat(account.waiver);
          }
        });

        // Calculate overall percentage paid
        overallFees.percentagePaid = overallFees.expectedFees
          ? ((overallFees.receivedFees + overallFees.waivers) /
              overallFees.expectedFees) *
            100
          : 0;

        overallFees.term_name = session.terms.find(
          (term) => term.id === term_id,
        )?.name;
      } else {
        overallFees.noFullPayment = 0;
        overallFees.noPartPayment = 0;
        overallFees.noNoPayment = 0;
        overallFees.receivedFees = 0;
        overallFees.expectedFees = 0;
        overallFees.waivers = 0;

        overallFees.percentagePaid = overallFees.expectedFees
          ? ((overallFees.receivedFees + overallFees.waivers) /
              overallFees.expectedFees) *
            100
          : 0;
        overallFees.term_name = "N/A";
      }

      returnedData.push(overallFees);
    });

    return returnedData;
  };

  useEffect(() => {
    const accounts =
      classes?.map((classItem) => classAccount(classItem.id)) || [];
    setClassesAccount(accounts);
    setTermAccount(overallTermAccount());
    setOverallAnalysis(analyzeData(accounts));
  }, [classes, schoolTuition, session]);

  function analyzeData(data) {
    // Helper function to calculate percentage paid
    const calculatePercentage = (received, expected) =>
      expected > 0 ? (received / expected) * 100 : 0;

    // Initialize overall session and term-specific analyses
    const overallAnalysis = {
      name: "Overall",
      receivedFees: 0,
      expectedFees: 0,
      waivers: 0,
      percentagePaid: 0,
    };

    const termAnalyses = {};

    session?.terms.forEach((obj) => {
      termAnalyses[obj.name] = {
        name: obj.name,
        receivedFees: 0,
        expectedFees: 0,
        waivers: 0,
        percentagePaid: 0,
      };
    });
    // Process data
    data.forEach((session) => {
      session.forEach((term) => {
        if (!term.term_name.toString().startsWith("N/A")) {
          const termName = term.term_name;

          // Update term-specific data
          termAnalyses[termName].receivedFees += term.receivedFees;
          termAnalyses[termName].expectedFees += term.expectedFees;

          // Update overall data
          overallAnalysis.receivedFees += term.receivedFees;
          overallAnalysis.waivers += term.waivers;
          overallAnalysis.expectedFees += term.expectedFees;
        }
      });
    });

    // Calculate percentages
    Object.values(termAnalyses).forEach((term) => {
      term.percentagePaid = calculatePercentage(
        term.receivedFees,
        term.expectedFees,
      ).toFixed(2);
    });

    overallAnalysis.percentagePaid = calculatePercentage(
      overallAnalysis.receivedFees,
      overallAnalysis.expectedFees,
    ).toFixed(2);

    // Combine results
    return [overallAnalysis];
  }

  function getColor(noFullPayment, noPartPayment, noNoPayment) {
    const max = Math.max(noFullPayment, noPartPayment, noNoPayment);

    if (max === noFullPayment) {
      return "#28A745";
    } else if (max === noPartPayment) {
      return "#FFC107";
    } else if (max === noNoPayment) {
      return "#DC3545";
    } else {
      return "gray";
    }
  }

  const [currentClass, setCurrentClass] = useState(0);

  return !hasAccess(9) ? (
    <div className="sam-container">
      <div className="sam-sub-container">
        <div className="sam-main overflow">
          <div className="list-controller-ui">
            <CgChevronLeftO
              className="list-controller-ui-icon"
              onClick={() => setCurrentClass((prev) => Math.max(prev - 1, 0))}
            />
            <h3>{classes && classes[currentClass]?.name}</h3>
            <CgChevronRightO
              className="list-controller-ui-icon"
              onClick={() =>
                setCurrentClass((prev) =>
                  Math.min(prev + 1, classes.length - 1),
                )
              }
            />
          </div>
          <div className="class-card">
            <div className="term-card-container">
              {classesAccount[currentClass]?.map((obj, index) => (
                <div className="term-card" key={index}>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign className="use-font-style" />
                      </div>
                      <div>
                        <h3>₦{formatAmount(obj.receivedFees ?? 0)}</h3>
                        <p>Received Fees</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign className="use-font-style" />
                      </div>
                      <div>
                        <h3>₦{formatAmount(obj.waivers ?? 0)}</h3>
                        <p>Waivers</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign className="use-font-style" />
                      </div>
                      <div>
                        <h3>
                          ₦
                          {formatAmount(
                            obj.expectedFees - obj.receivedFees - obj.waivers ??
                              0,
                          )}
                        </h3>
                        <p>Outstanding Fees</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign className="use-font-style" />
                      </div>
                      <div>
                        <h3>₦{formatAmount(obj.expectedFees ?? 0)}</h3>
                        <p>Expected Fees</p>
                      </div>
                    </div>
                  </div>

                  <div className={`term-card-box-inline`}>
                    <div className="inside-card">
                      <p className="student-percentage">
                        <span
                          style={{
                            color: getColor(
                              obj.noFullPayment,
                              obj.noPartPayment,
                              obj.noNoPayment,
                            ),
                            fontWeight: "600",
                          }}
                        >
                          {Number(obj.percentagePaid).toFixed(0)}%
                        </span>{" "}
                        payment received
                      </p>
                    </div>
                  </div>

                  <div
                    className={`term-name-badge ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <p>{obj.term_name}</p>
                  </div>
                  <div className="account-chart">
                    <DataPieChart
                      data={[
                        {
                          name: "No. of Full Payment",
                          value: obj.noFullPayment,
                        },
                        {
                          name: "No. of Part Payment",
                          value: obj.noPartPayment,
                        },
                        {
                          name: "No. of No Payment",
                          value: obj.noNoPayment,
                        },
                      ]}
                      COLORS={["#28a745", "#FFC107", "#dc3545"]}
                      centerText={
                        obj.noFullPayment + obj.noPartPayment + obj.noNoPayment
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ textAlign: "center", fontWeight: 600 }}>
              Account Analysis Per Term
            </h3>
          </div>
          <div className="class-card">
            <div className="term-card-container">
              {termAccount?.map((obj, index) => (
                <div className="term-card" key={index}>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign className="use-font-style" />
                      </div>
                      <div>
                        <h3>₦{formatAmount(obj.receivedFees ?? 0)}</h3>
                        <p>Received Fees</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign className="use-font-style" />
                      </div>
                      <div>
                        <h3>₦{formatAmount(obj.waivers ?? 0)}</h3>
                        <p>Waivers</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign className="use-font-style" />
                      </div>
                      <div>
                        <h3>
                          ₦
                          {formatAmount(
                            obj.expectedFees - obj.receivedFees - obj.waivers ??
                              0,
                          )}
                        </h3>
                        <p>Outstanding Fees</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`term-card-box ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <div className="inside-card">
                      <div
                        className={`d-card-icon ${index % 2 === 0 ? "d-card-icon-dark" : ""}`}
                      >
                        <FaDollarSign className="use-font-style" />
                      </div>
                      <div>
                        <h3>₦{formatAmount(obj.expectedFees ?? 0)}</h3>
                        <p>Expected Fees</p>
                      </div>
                    </div>
                  </div>

                  <div className={`term-card-box-inline`}>
                    <div className="inside-card">
                      <p className="student-percentage">
                        <span
                          style={{
                            color: getColor(
                              obj.noFullPayment,
                              obj.noPartPayment,
                              obj.noNoPayment,
                            ),
                            fontWeight: "600",
                          }}
                        >
                          {Number(obj.percentagePaid).toFixed(0)}%
                        </span>{" "}
                        payment received
                      </p>
                    </div>
                  </div>

                  <div
                    className={`term-name-badge ${index === 0 ? "first-card" : index === 1 ? "second-card" : "third-card"}`}
                  >
                    <p>{obj.term_name}</p>
                  </div>
                  <div className="account-chart">
                    <DataPieChart
                      data={[
                        {
                          name: "No. of Full Payment",
                          value: obj.noFullPayment,
                        },
                        {
                          name: "No. of Part Payment",
                          value: obj.noPartPayment,
                        },
                        {
                          name: "No. of No Payment",
                          value: obj.noNoPayment,
                        },
                      ]}
                      COLORS={["#28a745", "#FFC107", "#dc3545"]}
                      centerText={
                        obj.noFullPayment + obj.noPartPayment + obj.noNoPayment
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ textAlign: "center", fontWeight: 600 }}>
              Overall Session Account Analysis
            </h3>
          </div>
          <div className="sam-aside overflow">
            {overallAnalysis.map((obj, index) => (
              <div className="aside-card-container">
                <div className={`term-card-box second-card`}>
                  <div className="inside-card">
                    <div className={`d-card-icon`}>
                      <FaDollarSign className="use-font-style" />
                    </div>
                    <div>
                      <h3>₦{formatAmount(obj?.receivedFees ?? 0)}</h3>
                      <p>{obj?.name || "N/A"} Received Fees</p>
                    </div>
                  </div>
                </div>
                <div className={`term-card-box third-card`}>
                  <div className="inside-card">
                    <div className={`d-card-icon-dark`}>
                      <FaDollarSign className="use-font-style" />
                    </div>
                    <div>
                      <h3>₦{formatAmount(obj?.waivers ?? 0)}</h3>
                      <p>{obj?.name || "N/A"} waivers</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`term-card-box first-card`}
                  style={{ backgroundColor: "#fff" }}
                >
                  <div className="inside-card">
                    <div className={`d-card-icon`}>
                      <FaDollarSign className="use-font-style" />
                    </div>
                    <div>
                      <h3>
                        ₦
                        {formatAmount(
                          obj?.expectedFees -
                            obj?.receivedFees -
                            obj?.waivers ?? 0,
                        )}
                      </h3>
                      <p>{obj?.name || "N/A"} Outstanding Fees</p>
                    </div>
                  </div>
                </div>
                <div className={`term-card-box third-card`}>
                  <div className="inside-card">
                    <div className={`d-card-icon-dark`}>
                      <FaDollarSign className="use-font-style" />
                    </div>
                    <div>
                      <h3>₦{formatAmount(obj?.expectedFees ?? 0)}</h3>
                      <p>{obj?.name || "N/A"} Expected Fees</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-tuition-chart">
            <div className="d-student-chart-header">
              <p>Session Fees Inflow</p>
              <div
                className="d-card-icon"
                style={{ width: "35px", height: "35px" }}
              >
                <FaDollarSign className="use-font-style" />
              </div>
            </div>
            <TuitionSessionChart />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <FeatureLockModal isLocked={hasAccess(9)} />
  );
};

export default SchoolAccountManager;
