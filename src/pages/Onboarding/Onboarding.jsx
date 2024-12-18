import React, { useState } from "react";
import "./Onboarding.css";

const SchoolProfile = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    address: "",
    stateCity: "",
    contactEmail: "",
    contactPhone: "",
    schoolLogo: null,
    academicYearStart: "",
    academicYearEnd: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <section>
      <div>
        <label>School Name:</label>
        <input
          type="text"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>State/City:</label>
        <input
          type="text"
          name="stateCity"
          value={formData.stateCity}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Contact Email:</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Contact Phone Number:</label>
        <input
          type="tel"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>School Logo Upload (Optional):</label>
        <input type="file" name="schoolLogo" onChange={handleChange} />
      </div>
      <div>
        <label>Academic Year Start Date:</label>
        <input
          type="date"
          name="academicYearStart"
          value={formData.academicYearStart}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Academic Year End Date:</label>
        <input
          type="date"
          name="academicYearEnd"
          value={formData.academicYearEnd}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </section>
  );
};

const ProgressIndicator = () => {
  return (
    <div className="progress-container">
      <div className="progress-indicator">
        <div className="icon-container">
          <div className="icon-circle"></div>
        </div>
        <div className="x-line"></div>
        <div className="icon-container">
          <div className="icon-circle"></div>
        </div>
        <div className="x-line"></div>
        <div className="icon-container">
          <div className="icon-circle"></div>
        </div>
        <div className="x-line"></div>
        <div className="icon-container">
          <div className="icon-circle"></div>
        </div>
        <div className="x-line"></div>
        <div className="icon-container">
          <div className="icon-circle"></div>
        </div>
      </div>
      <div className="title" style={{ left: "calc(15% - 150px)" }}>
        <h4>School Profile Setup</h4>
        <p>Provide basic school information.</p>
      </div>
      <div className="title" style={{ left: "calc(32.6% - 150px)" }}>
        <h4>Admin Account Setup</h4>
        <p>Create admin login credentials.</p>
      </div>
      <div className="title" style={{ left: "calc(50.2% - 150px)" }}>
        <h4>Payment Confirmation</h4>
        <p>Confirm and complete payment.</p>
      </div>
      <div className="title" style={{ left: "calc(67.8% - 150px)" }}>
        <h4>Preferences & Customization</h4>
        <p>Configure settings and enable features.</p>
      </div>
      <div className="title" style={{ left: "calc(85% - 150px)" }}>
        <h4>Confirmation & Completion</h4>
        <p>Finalize setup and provide subdomain.</p>
      </div>
    </div>
  );
};

const Onboarding = () => {
  return (
    <div className="onboarding-container">
      <h1>Onboarding</h1>
      <ProgressIndicator />
    </div>
  );
};

export default Onboarding;
