import React, { useState } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  );
};

const Onboarding = () => {
  return (
    <div>
      <h1>Onboarding</h1>
      <SchoolProfile />
    </div>
  );
};

export default Onboarding;
