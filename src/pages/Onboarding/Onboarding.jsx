import React, { useState } from "react";
import "./Onboarding.css";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineSchool } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import {
  FiMap,
  FiMail,
  FiPhone,
  FiUser,
  FiLock,
  FiCheck,
  FiX,
} from "react-icons/fi";
import nigeriaStates from "../../utils/nigeria-state-and-lgas.json"; // Import JSON file
import { motion, AnimatePresence } from "framer-motion";
import { UseProgressIcon } from "../../components/UseProgressIcon";
import AddTeachersModal from "../../components/modals/AddTeacherModal/AddTeachersModal";
import { HiOutlineClipboardList } from "react-icons/hi";
import ListItem from "../../components/ListItem/ListItem";
import SubjectDropdown from "../../utils/SubjectDropdown/SubjectDropdown";
import result_1 from "../../images/result_template/result_1.jpg";
import result_2 from "../../images/result_template/result_2.jpg";
import result_3 from "../../images/result_template/result_3.jpg";
import result_4 from "../../images/result_template/result_4.jpg";
import result_5 from "../../images/result_template/result_5.jpg";
import result_6 from "../../images/result_template/result_6.jpg";

const SchoolProfile = ({ onNext }) => {
  const [formData, setFormData] = useState({
    schoolName: "",
    address: "",
    state: "",
    lga: "",
    contactEmail: "",
    contactPhone: "",
    schoolLogo: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const [location, setLocation] = useState({
    selectedState: "",
    selectedLGA: "",
  });

  const handleStateChange = (e) => {
    setLocation({
      ...location,
      selectedState: e.target.value,
      selectedLGA: "", // Reset LGA when state changes
    });
  };

  const handleLGAChange = (e) => {
    setLocation({
      ...location,
      selectedLGA: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setPreviewImage(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          image: e.target.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="signup-form">
      <div className="onboarding-title">
        <h3>Set Up Your School Profile</h3>
        <p>
          Begin by providing essential details about your school to help us
          tailor your experience.
        </p>
      </div>
      <div className="image-container">
        <label htmlFor="image">Upload your school logo</label>
        {previewImage && (
          <img src={previewImage} alt="Preview" className="image-preview" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
      </div>
      <div className="input-form-container">
        <input
          type="text"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleChange}
          placeholder="School Name"
        />
        <div className="form-icons">
          <MdOutlineSchool className="icons" />
        </div>
      </div>
      <div className="input-form-container">
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <div className="form-icons">
          <HiOutlineLocationMarker className="icons" />
        </div>
      </div>
      <div className="form-flex">
        <div className="input-form-container" style={{ width: "45%" }}>
          <select
            name="state"
            value={location.selectedState}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {nigeriaStates.map((state) => (
              <option key={state.alias} value={state.state}>
                {state.state}
              </option>
            ))}
          </select>
          <div className="form-icons">
            <FiMap className="icons" />
          </div>
        </div>

        {/* LGA Dropdown */}
        <div className="input-form-container" style={{ width: "45%" }}>
          <select
            name="lga"
            value={location.selectedLGA}
            onChange={handleLGAChange}
          >
            <option value="">Select LGA</option>
            {nigeriaStates
              .find((state) => state.state === location.selectedState)
              ?.lgas.map((lga) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
          </select>
          <div className="form-icons">
            <FiMap className="icons" />
          </div>
        </div>
      </div>
      <div className="form-flex">
        <div className="input-form-container" style={{ width: "45%" }}>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
          />
          <div className="form-icons">
            <FiMail className="icons" />
          </div>
        </div>
        <div className="input-form-container" style={{ width: "45%" }}>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Contact Phone Number"
          />
          <div className="form-icons">
            <FiPhone className="icons" />
          </div>
        </div>
      </div>
      <div className="btn-container">
        <button onClick={onNext} className="btn">
          Next
        </button>
      </div>
    </section>
  );
};

const AdminForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <section className="signup-form">
      <div className="onboarding-title">
        <h3>Admin Registration</h3>
        <p>
          Provide the necessary details to create your admin profile. This
          ensures secure access and effective management of your school's
          dashboard.
        </p>
      </div>
      <div className="input-form-container">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <div className="form-icons">
          <FiUser className="icons" />
        </div>
      </div>

      {/* Email Address */}
      <div className="input-form-container">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
        />
        <div className="form-icons">
          <FiMail className="icons" />
        </div>
      </div>

      {/* Phone Number */}
      <div className="input-form-container">
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <div className="form-icons">
          <FiPhone className="icons" />
        </div>
      </div>

      {/* Password */}
      <div className="input-form-container">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create Password"
        />
        <div className="form-icons">
          <FiLock className="icons" />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="input-form-container">
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <div className="form-icons">
          <FiLock className="icons" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="btn-container">
        <button onClick={onNext} className="btn">
          Next
        </button>
      </div>
    </section>
  );
};

const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="progress-container">
      <div className="progress-indicator">
        <UseProgressIcon currentStep={currentStep} step={1} />
        <div className="x-line"></div>
        <UseProgressIcon currentStep={currentStep} step={2} />
        <div className="x-line"></div>
        <UseProgressIcon currentStep={currentStep} step={3} />
        <div className="x-line"></div>
        <UseProgressIcon currentStep={currentStep} step={4} />
        <div className="x-line"></div>
        <UseProgressIcon currentStep={currentStep} step={5} />
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
        <h4>Account Plan Setup</h4>
        <p>Choose a plan that meets your needs.</p>
      </div>
      <div className="title" style={{ left: "calc(67.8% - 150px)" }}>
        <h4>Academic Setup</h4>
        <p>Configure Your Academic Setup.</p>
      </div>
      <div className="title" style={{ left: "calc(85% - 150px)" }}>
        <h4>Confirmation & Completion</h4>
        <p>Finalize setup and provide subdomain.</p>
      </div>
    </div>
  );
};

const PlanCard = ({ onNext }) => {
  const planList = [
    {
      planName: "Acess to free wifie",
      planLevel: 1,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 1,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 1,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 1,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 1,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 2,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 2,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 2,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 3,
    },
    {
      planName: "Acess to free wifie",
      planLevel: 3,
    },
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
  return (
    <div className="plan-container">
      <div className="onboarding-title">
        <h3>Choose your plan</h3>
        <p>Select a plan that works best for your school’s needs</p>
      </div>
      <div className="plan-subcontainer">
        <div className="plan-card" style={{ backgroundColor: "#ffadbc" }}>
          <h3>Basic</h3>
          <div className="amount-flex">
            <h1>N20,000 </h1>
            <p> / term</p>
          </div>
          <div className="btn-container">
            <button onClick={onNext} className="btn">
              Proceed
            </button>
          </div>
          <div className="plan-item-container">
            {planList.map((plan, index) => (
              <div className="plan-item" key={index}>
                <UseIcon planItemNumber={plan.planLevel} planNumber={1} />
                <p>1-50 Students</p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="plan-card"
          style={{ backgroundColor: "#711A75", color: "#fff" }}
        >
          <h3>Pro</h3>
          <div className="amount-flex">
            <h1>N35,000 </h1>
            <p> / term</p>
          </div>
          <div className="btn-container">
            <button onClick={onNext} className="btn">
              Proceed
            </button>
          </div>
          <div className="plan-item-container">
            {planList.map((plan, index) => (
              <div className="plan-item" key={index}>
                <UseIcon planItemNumber={plan.planLevel} planNumber={2} />
                <p>1-50 Students</p>
              </div>
            ))}
          </div>
        </div>
        <div className="plan-card" style={{ backgroundColor: "#F9E2AF" }}>
          <h3>Enterprise</h3>
          <div className="amount-flex">
            <h1>N50,000 </h1>
            <p> / term</p>
          </div>
          <div className="btn-container">
            <button onClick={onNext} className="btn">
              Proceed
            </button>
          </div>
          <div className="plan-item-container">
            {planList.map((plan, index) => (
              <div className="plan-item" key={index}>
                <UseIcon planItemNumber={plan.planLevel} planNumber={3} />
                <p>1-50 Students</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Preferences = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const [currentSetting, setCurrentSetting] = useState(1);

  const result_images = [
    result_1,
    result_2,
    result_3,
    result_4,
    result_5,
    result_6,
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelect = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="preferences-container">
      <div className="onboarding-title">
        <h3>Configure Your Academic Setup</h3>
        <p>Streamline your school operations by setting up key preferences. </p>
      </div>
      <div className="preferences">
        <div className="aside">
          <div className="preference-item">
            <div style={{ width: "10%" }}>
              <UseProgressIcon currentStep={currentSetting} step={1} />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Assign Teachers to Classes</h3>
              <p>
                Match teachers to their respective classes for efficient class
                management.
              </p>
            </div>
          </div>
          <div className="preference-item">
            <div style={{ width: "10%", lineHeight: 1.4 }}>
              <UseProgressIcon currentStep={currentSetting} step={2} />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Assign Subjects to Classes</h3>
              <p>
                Allocate subjects to the appropriate classes based on the
                curriculum.
              </p>
            </div>
          </div>

          <div className="preference-item">
            <div style={{ width: "10%" }}>
              <UseProgressIcon currentStep={currentSetting} step={3} />
            </div>
            <div style={{ width: "90%", lineHeight: 1.3 }}>
              <h3>Result Format Preference</h3>
              <p>
                Allocate subjects to the appropriate classes based on the
                curriculum.
              </p>
            </div>
          </div>
        </div>
        {currentSetting === 1 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Assign Teachers to Classes</h3>
              <p>
                Match teachers to their respective classes for efficient class
                management.
              </p>
            </div>
            {/* <div className="no-record-yet">
              <HiOutlineClipboardList
                className="no-record-icon"
                style={{ transform: "scale(1.2)" }}
              />
              <p>No records yet</p>
              <div className="btn-container">
                <button onClick={handleOpenModal}>Add record</button>
              </div>
            </div> */}
            <div className="list-parent">
              <div className="list-container">
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
                <ListItem />
              </div>
              <div className="preferences-footer">
                <p>
                  Teachers who handles more than one classes should be done
                  after the onboarding process
                </p>
                <div className="btn-container">
                  <button onClick={handleOpenModal} className="btn">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <AddTeachersModal
              isVisible={isModalVisible}
              onClose={handleCloseModal}
            />
          </div>
        )}
        {currentSetting === 2 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Assign Subjects to Classes</h3>
              <p>
                Allocate subjects to the appropriate classes based on the
                curriculum.
              </p>
            </div>
            <div>
              <SubjectDropdown />
            </div>
          </div>
        )}

        {currentSetting === 3 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Result Format Preference</h3>
              <p>Choose a result design that suits your taste format.</p>
            </div>
            <div>
              <div className="image-selector">
                {result_images.map((image, index) => (
                  <label key={index} className="image-option">
                    <input
                      type="radio"
                      name="image"
                      value={image}
                      checked={selectedImage === image}
                      onChange={() => handleSelect(image)}
                    />
                    <img
                      src={image}
                      alt={`Option ${index + 1}`}
                      className={selectedImage === image ? "selected" : ""}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="btn-container">
        <button
          onClick={() => setCurrentSetting(currentSetting + 1)}
          className="btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const [currentForm, setCurrentForm] = useState(1);

  const formVariants = {
    initial: (direction) => ({
      x: direction === "next" ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction === "next" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="onboarding-container">
      <div className="omooo">
        <AnimatePresence custom="next" mode="wait">
          {currentForm === 1 && (
            <motion.div
              key="school"
              custom="next"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <SchoolProfile onNext={() => setCurrentForm(2)} />
            </motion.div>
          )}

          {currentForm === 2 && (
            <motion.div
              key="admin"
              custom="next"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <AdminForm onNext={() => setCurrentForm(3)} />
            </motion.div>
          )}

          {currentForm === 3 && (
            <motion.div
              key="plan"
              custom="next"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <PlanCard onNext={() => setCurrentForm(4)} />
            </motion.div>
          )}

          {currentForm === 4 && (
            <motion.div
              key="preferences"
              custom="next"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <Preferences />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ marginTop: "1rem", width: "100%" }}>
        <ProgressIndicator currentStep={currentForm} />
      </div>
    </div>
  );
};

export default Onboarding;
