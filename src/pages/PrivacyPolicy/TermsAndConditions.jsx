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

const TermsAndConditions = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>Terms & Conditions</h1>
        <div className="privacy-link">
          <Link to={"/"}>Home</Link>
          <PiArrowRight className="use-font-style" />
          <Link>Terms & Conditions</Link>
        </div>
      </div>
      <div className="content-container">
        <div className="privacy-content">
          <p>
            Welcome to EduTerex! These Terms and Conditions outline the rules
            and regulations for using our school management services in Nigeria.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using EduTerex, you agree to comply with these
            terms. If you do not agree, please discontinue use of our services.
          </p>

          <h2>2. Use of Services</h2>
          <p>
            EduTerex provides school management solutions for students,
            teachers, administrators, and parents. You agree to use our platform
            only for lawful purposes.
          </p>

          <h2>3. User Responsibilities</h2>
          <ul>
            <li>Provide accurate and up-to-date information.</li>
            <li>Maintain the confidentiality of your login credentials.</li>
            <li>Not engage in fraudulent, abusive, or harmful activities.</li>
          </ul>

          <h2>4. Payment and Billing</h2>
          <p>
            Some features of EduTerex may require payment. By making a purchase,
            you agree to our pricing and refund policies.
          </p>

          <h2>5. Data Privacy</h2>
          <p>
            We handle your personal data according to our Privacy Policy. By
            using EduTerex, you consent to our data practices.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            EduTerex is not responsible for any damages or losses resulting from
            the use of our platform. Users access our services at their own
            risk.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of
            EduTerex after modifications constitutes acceptance of the new
            terms.
          </p>
          <p>Thank you for using EduTerex!</p>
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

export default TermsAndConditions;
