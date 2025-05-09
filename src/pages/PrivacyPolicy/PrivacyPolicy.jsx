import React from "react";
import {
  PiArrowRight,
  PiFacebookLogoFill,
  PiInstagramLogoFill,
  PiPhoneCallFill,
  PiTwitterLogoFill,
  PiWhatsappLogoFill,
} from "react-icons/pi";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";
import eduterexDarkLogo from "../../images/eduterex_logo.png";
import eduterexLightLogo from "../../images/eduterex_logo_light.png";
import "../LandingPage/LandingPage.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <div className="privacy-link">
          <Link to={"/"}>Home</Link>
          <PiArrowRight className="use-font-style" />
          <Link>Privacy Policy</Link>
        </div>
      </div>
      <div className="content-container">
        <div className="privacy-content">
          <p>
            Welcome to EduTerex! Your privacy is important to us, and we are
            committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, store, and protect your data
            when you use our school management services in Nigeria.
          </p>

          <h2>1. Who We Are</h2>
          <p>
            EduTerex is a school management service that helps schools,
            teachers, students, and parents manage academic and administrative
            activities efficiently. By using our services, you agree to the
            practices described in this Privacy Policy.
          </p>

          <h2>2. What Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Details:</strong> Name, contact information
              (email, phone number), date of birth, and profile image.
            </li>
            <li>
              <strong>Educational Records:</strong> Academic history, grades,
              and attendance records.
            </li>
            <li>
              <strong>Staff Datas:</strong> Name, contact information (email,
              phone number), date of birth, gender and profile image.
            </li>
            <li>
              <strong>Student Datas:</strong> Name, parent's contact information
              (email, phone number), date of birth, gender, and profile image.
            </li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>Provide and improve our school management services.</li>
            <li>Enhance user experience and system performance.</li>
            <li>Offer customer support and technical assistance.</li>
            <li>Develop new features and improve existing ones.</li>
            <li>Ensure compliance with legal and security obligations.</li>
            <li>Communicate important updates about EduTerex.</li>
          </ul>

          <h2>4. Legal Basis for Data Processing</h2>
          <ul>
            <li>
              <strong>Your Consent:</strong> When you explicitly agree to
              provide your data.
            </li>
            <li>
              <strong>Contractual Obligations:</strong> When we need to fulfill
              a service agreement.
            </li>
            <li>
              <strong>Legal Requirements:</strong> When processing is required
              by law.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> When processing is
              necessary for the security and improvement of our services.
            </li>
          </ul>

          <h2>5. Data Security Measures</h2>
          <ul>
            <li>
              <strong>Encryption:</strong> Protecting data both in storage and
              during transmission.
            </li>
            <li>
              <strong>Secure Servers:</strong> Hosting data on protected systems
              with firewalls.
            </li>
            <li>
              <strong>Access Control:</strong> Ensuring only authorized
              personnel can access sensitive data.
            </li>
            <li>
              <strong>Regular Audits:</strong> Monitoring and reviewing security
              practices.
            </li>
          </ul>

          <h2>6. Who We Share Your Data With</h2>
          <ul>
            <li>
              <strong>Trusted Third-Party Service Providers:</strong> Such as
              email service providers, and payment service providers.
            </li>
            <li>
              <strong>Regulatory Authorities:</strong> If required by law or
              legal proceedings.
            </li>
            <li>
              <strong>Schools and Institutions:</strong> To facilitate
              administrative functions and academic reporting.
            </li>
          </ul>

          <h2>7. Data Retention & Deletion</h2>
          <p>
            We retain personal data only for as long as necessary. If you wish
            to delete your data, you can request removal unless legal or
            regulatory obligations require us to keep it.
          </p>

          <h2>8. Your Rights</h2>
          <ul>
            <li>
              <strong>Access your personal data</strong> and request copies.
            </li>
            <li>
              <strong>Correct inaccurate information.</strong>
            </li>
            <li>
              <strong>Request deletion</strong> of your data (unless required by
              law).
            </li>
            <li>
              <strong>Withdraw consent</strong> at any time.
            </li>
            <li>
              <strong>Restrict processing</strong> under certain conditions.
            </li>
          </ul>

          <h2>9. Data Breach Notification</h2>
          <p>
            In case of a data breach, we will notify affected users and relevant
            authorities within 72 hours, as required by law.
          </p>

          <h2>10. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you
            of any significant changes.
          </p>
          <p>Thank you for trusting EduTerex with your data!</p>
        </div>
      </div>
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
            <a href="mailto://eduterex001@gmail.com">eduterex001@gmail.com</a>
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
                <PiTwitterLogoFill
                  style={{ color: "#fff", fontSize: "20px" }}
                />
              </div>
              <div className="social-icon">
                <PiFacebookLogoFill
                  style={{ color: "#fff", fontSize: "20px" }}
                />
              </div>
              <div className="social-icon">
                <PiInstagramLogoFill
                  style={{ color: "#fff", fontSize: "20px" }}
                />
              </div>
              <div className="social-icon">
                <PiPhoneCallFill style={{ color: "#fff", fontSize: "20px" }} />
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

export default PrivacyPolicy;
