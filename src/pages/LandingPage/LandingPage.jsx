import React from "react";
import "./LandingPage.css";
import {
  PiCheckCircleBold,
  PiFacebookLogoFill,
  PiInstagramLogoFill,
  PiPhoneCallFill,
  PiTwitterLogoFill,
  PiWhatsappLogoFill,
} from "react-icons/pi";
import { Link } from "react-router-dom";
import eduterexDarkLogo from "../../images/eduterex_logo.png";
import eduterexLightLogo from "../../images/eduterex_logo_light.png";
import { FiCheck, FiX } from "react-icons/fi";
import revolutionImg from "../../images/revolution.jpg";
import priceCalculatorImg from "../../images/price-calculator.png";
import StatsCounter from "../../components/StatsCounter/StatsCounter";

const LandingPage = () => {
  const planList = [
    "Select Features – Choose the modules that fit your school's needs.",
    "Enter Quantity – Specify the number of students and staff members.",
    "Pick a Subscription Duration – Get discounts for longer plans!",
    "See Your Total Cost – The calculator updates in real time.",
    "Proceed to Payment – Subscribe seamlessly via secure payment gateways.",
    "Enjoy discounts on long-term subscriptions and flexible pricing tailored to your institution!",
  ];

  const UseIcon = ({ planNumber, planItemNumber }) => {
    if (planNumber >= planItemNumber) {
      return (
        <div className="circle-check" style={{ background: "#925fe2" }}>
          <FiCheck className="checkmark" style={{ color: "#fff" }} />
        </div>
      );
    } else {
      return (
        <div className="circle-check" style={{ background: "#fff" }}>
          <FiX className="checkmark" style={{ color: "#925fe2" }} />
        </div>
      );
    }
  };

  const features = [
    {
      title: "📌 Student Profile Management",
      features: [
        "Effortlessly manage student data, including academic history, attendance, and performance logs. Schools have a dedicated dashboard for quick access and easy updates.",
      ],
    },
    {
      title: "📌 Membership Roles & Dedicated Portals",
      features: [
        "Staff Portal – Designed for administrators, principals, teachers, and account managers to efficiently manage school operations, academics, and finances.",
        "Student Portal – Provides students with access to their subjects, result, school bill, payment history and schedules for a seamless learning experience.",
      ],
    },
    {
      title: "📌 Result Management",
      features: [
        "Students and parents can securely access termly and cumulative results from their dashboards.",
        "Students can download softcopy results anytime.",
        "Lifetime Access to Academic Records: Students can retrieve their results even after graduation, ensuring a permanent digital archive.",
      ],
    },
    {
      title: "📌 Digital Attendance System",
      features: [
        "Digital class attendance system for accurate record-keeping.",
      ],
    },
    {
      title: "📌 School Fees Management",
      features: [
        "Track school fees and payment statuses with ease.",
        "Instant digital receipts for every transaction, ensuring transparency.",
      ],
    },
    {
      title: "📌 Financial Analytics",
      features: [
        "Schools can access detailed financial reports, covering receivables, and overall performance for each term and session.",
        "Gain clarity on financial health and make informed decisions with real-time analytics.",
      ],
    },
    {
      title: "📌 Data Analysis & Visualization",
      features: [
        "Interactive charts and reports provide insights into student performance and school operations.",
        "Identify trends, at-risk students, and areas for improvement with powerful analytics tools.",
      ],
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <img src={eduterexLightLogo} alt="" srcset="" />
        <h1>EDUTEREX</h1>
        <p className="tagline">
          "Transforming School Management with Digital Innovation"
        </p>
        <p className="description">
          With Eduterex, schools can digitize their administrative processes
          without the complexity or high costs of traditional systems. Our
          user-friendly platform makes school management effortless while
          providing valuable insights to improve student performance and
          operational efficiency.
        </p>
        <Link to="/onboarding">
          <button className="cta-button">Get Started</button>
        </Link>
      </section>

      <section className="statement-section">
        <h2>Revolutionizing School Operations for a Smarter Future</h2>
        <div className="statement-div">
          <div className="text-div">
            <p>
              In today’s digital era, schools must embrace technology to
              streamline administrative tasks, enhance communication, and
              improve efficiency. However, many primary and secondary schools
              still struggle with outdated manual processes due to limited
              financial resources or a lack of awareness about modern solutions.
            </p>
            <br />
            <p>
              Eduterex is here to change that. Our comprehensive School
              Management Web Application is designed to empower schools,
              students, and parents with a seamless, transparent, and efficient
              digital platform for managing academic records, student profiles,
              attendance, and financial operations.
            </p>
          </div>
          <div className="image-div">
            <img src={revolutionImg} alt="" srcset="" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <h2>Are you tired of?</h2>
        <div className="problem-list">
          {[
            {
              title: "Manual Student Profile Management",
              description:
                "Schools struggle with maintaining and retrieving student records efficiently.",
            },
            {
              title: "Inefficient Result Management",
              description:
                " Students and parents often face delays in accessing academic results, and schools lack customization options.",
            },
            {
              title: "Attendance Monitoring Issues",
              description:
                "Tracking student attendance manually is time-consuming.",
            },
            {
              title: "Manual data entry and paperwork?",
              description:
                "Schools rely on tedious manual processes for record-keeping, leading to errors, inefficiencies, and difficulty in retrieving student information.",
            },
            {
              title: "School Fees Tracking Difficulties",
              description:
                "Parents may miss payments due to a lack of reminders, and schools may struggle with financial transparency.",
            },
            {
              title: "Lack of Financial Analytics",
              description:
                "Schools lack a clear breakdown of income, and overall financial performance.",
            },
            {
              title: "Limited Data Insights on Student Performance",
              description:
                "Schools struggle to identify at-risk students and trends in academic performance.",
            },
            {
              title: "Poor Communication Between Schools and Parents",
              description:
                "Parents may not be promptly informed about their child’s progress, absences, or school fees.",
            },
            {
              title: "No Digital Archive for Student Records",
              description:
                " Graduated students often lose access to their academic records.",
            },
          ].map((problem, index) => (
            <div key={index} className="problem-card">
              <PiCheckCircleBold className="icon" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section">
        <h2>Bid farewell to manual data entry and lost records</h2>
        <p>
          Our platform solves these problems by providing a secure,
          user-friendly, highly customizable and centralized system for managing
          school records.
        </p>
        <div className="solution-grid">
          <div className="solution-card">
            <h3>Streamline School Record Keeping With Ease</h3>
            <p>
              Our solution automates data entry, minimizes record loss, and
              provides a centralized platform for managing school, staff,
              student, and parent information.
            </p>
          </div>
          <div className="solution-card">
            <h3>Empower Your School with Eduterex Today</h3>
            <p>
              Join the growing number of schools transforming their management
              with Eduterex. Take the first step toward efficiency,
              transparency, and digital excellence.
            </p>
          </div>
        </div>
      </section>

      <section className="key-features">
        <h2>Key Features</h2>
        {features?.map((feature, index) => (
          <div key={index} className="features-card">
            <h3>{feature.title}</h3>
            <ul>
              {feature.features.map((obj, index) => (
                <li key={index}>{obj}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      {/* Plan Section */}
      <section className="plan-container">
        <h2>Smart Pricing Calculator</h2>
        <p>Get an instant estimate for your subscription plan!</p>
        <div className="plan-subcontainer">
          <div
            className="plan-card"
            style={{ backgroundColor: "#fff", padding: "20px" }}
          >
            <p style={{ lineHeight: 2 }}>
              Our pricing calculator allows you to customize your subscription
              based on the features your school needs. Simply select the
              features, specify the number of school members, and choose your
              subscription duration. The total cost updates instantly, helping
              you make an informed decision before checkout.
            </p>
            <div className="plan-item-container">
              {planList.map((obj) => (
                <div className="plan-item">
                  <UseIcon planItemNumber={1} planNumber={2} />
                  <p>{obj}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="plan-card">
            <img src={priceCalculatorImg} alt="" srcset="" />
          </div>
        </div>
        <h1
          style={{
            color: "red",
            marginTop: "20px",
            padding: "0px 10px",
            lineHeight: 1.5,
          }}
        >
          Enjoy a 7-Days Free Trial – Start Your Journey Today!
        </h1>
      </section>
      <section>
        <StatsCounter />
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Empower Your School with Smart, Digital Management</h2>
        <p>Sign up today and experience hassle-free school management!</p>
        <Link to="/onboarding">
          <button className="cta-button">Get Started</button>
        </Link>
      </section>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="brand-name">
              <img src={eduterexDarkLogo} alt="" srcset="" />
              <h2>EDUTEREX</h2>
            </div>
            <p className="description">
              Join the growing number of schools transforming their management
              with Eduterex. Take the first step toward efficiency,
              transparency, and digital excellence.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              {/* <li>About Us</li> */}
              <li>
                <a href="tel:+2349163573276">Contact</a>
              </li>
              <li>
                <Link to="/onboarding">Get Started</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li>
                <a href="mailto://eduterex001@gmail.com">Support Center</a>
              </li>
              <li>
                <a href="tel:+2349163573276">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Get in Touch</h3>
            <p>
              Email:{" "}
              <a href="mailto://info@eduterex.com.ng">info@eduterex.com.ng</a>
            </p>
            <p>Address: Bakes Ville Estate, Badore Ajah, Lagos</p>
            <div className="social-icon-container">
              <div className="social-icon">
                <a
                  href="https://wa.me/+2349163573276"
                  target="_blank"
                  rel="noreferrer"
                >
                  <PiWhatsappLogoFill
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
                </a>
              </div>
              <div className="social-icon">
                <a
                  href="https://x.com/eduterex?s=21"
                  target="_blank"
                  rel="noreferrer"
                >
                  <PiTwitterLogoFill
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
                </a>
              </div>
              <div className="social-icon">
                <a
                  href="https://www.facebook.com/share/1GbMWm3Qwt/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                >
                  <PiFacebookLogoFill
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
                </a>
              </div>
              <div className="social-icon">
                <a
                  href="https://www.instagram.com/eduterex?igsh=MTd0b24zY3dpaWFsaw%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                >
                  <PiInstagramLogoFill
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
                </a>
              </div>
              <div className="social-icon">
                <a href="tel:+2349163573276">
                  <PiPhoneCallFill
                    style={{ color: "#fff", fontSize: "20px" }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© Eduterex Innovations Ltd. All Rights Reserved.</p>
          <div className="footer-links">
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
