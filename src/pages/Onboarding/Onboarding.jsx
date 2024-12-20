import React, { useState, useEffect } from "react";
import "./Onboarding.css";
import { MdOutlineSchool } from "react-icons/md";
import {
  HiOutlineClipboardList,
  HiOutlineLocationMarker,
} from "react-icons/hi";
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
import ListItem from "../../components/ListItem/ListItem";
import SubjectDropdown from "../../utils/SubjectDropdown/SubjectDropdown";
import result_1 from "../../images/result_template/result_1.jpg";
import result_2 from "../../images/result_template/result_2.jpg";
import result_3 from "../../images/result_template/result_3.jpg";
import result_4 from "../../images/result_template/result_4.jpg";
import result_5 from "../../images/result_template/result_5.jpg";
import result_6 from "../../images/result_template/result_6.jpg";
import { isFormValid } from "../../utils/OnboardingUtils/FormChecker";
import { AlertBadge } from "../../components/AlertBadge";

const SchoolProfile = ({ onNext, setOnboardingForm }) => {
  const [formData, setFormData] = useState({
    school_name: "",
    address: "",
    state: "",
    lga: "",
    contact_email: "",
    contact_phone: "",
    school_logo: null,
  });

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
    console.log("selected state", e.target.value);
    setLocation({
      ...location,
      selectedState: e.target.value,
      selectedLGA: "", // Reset LGA when state changes
    });
    setFormData({
      ...formData,
      state: e.target.value,
      lga: "",
    });
  };

  const handleLGAChange = (e) => {
    setLocation({
      ...location,
      selectedLGA: e.target.value,
    });
    setFormData({
      ...formData,
      lga: e.target.value,
    });
  };

  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    const fileInput = document.getElementById("fileInput");

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoImage(reader.result);
          setFormData((prevData) => ({
            ...prevData,
            school_logo: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.addEventListener("change", handleFileChange);

    return () => {
      fileInput.removeEventListener("change", handleFileChange); // Cleanup event listener
    };
  }, []);

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleNext = () => {
    setAlert(false);
    if (isFormValid(formData, setMessage)) {
      setOnboardingForm((prevData) => ({
        ...prevData,
        schoolProfile: formData,
      }));
      onNext();
    } else {
      setAlert(true);
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
      {alert && <AlertBadge message={message} />}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="image-upload">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
          />
          <label htmlFor="fileInput" id="imageBox">
            <span className={logoImage ? "hid-image" : "show-image"}>
              Click to upload logo image
            </span>
            {logoImage && (
              <img
                className="show-image"
                id="uploadedImage"
                src={logoImage}
                alt="Uploaded"
              />
            )}
          </label>
        </div>
      </div>
      <div className="input-form-container">
        <input
          type="text"
          name="school_name"
          value={formData.school_name}
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
            name="contact_email"
            value={formData.contact_email}
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
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            placeholder="Contact Phone Number"
          />
          <div className="form-icons">
            <FiPhone className="icons" />
          </div>
        </div>
      </div>
      <div className="btn-container">
        <button onClick={handleNext} className="btn">
          Next
        </button>
      </div>
    </section>
  );
};

const AdminForm = ({ onNext, setOnboardingForm }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleNext = () => {
    setAlert(false);
    if (isFormValid(formData, setMessage)) {
      setOnboardingForm((prevData) => ({
        ...prevData,
        adminProfile: formData,
      }));
      onNext();
    } else {
      setAlert(true);
    }
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
      {alert && <AlertBadge message={message} />}
      <div className="input-form-container">
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
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
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <div className="form-icons">
          <FiLock className="icons" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="btn-container">
        <button onClick={handleNext} className="btn">
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

const PlanCard = ({ onNext, setOnboardingForm }) => {
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

  const handleNext = (planName) => {
    setOnboardingForm((prevData) => ({
      ...prevData,
      planProfile: { plan: planName },
    }));
    onNext();
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
            <button onClick={() => handleNext("Basic")} className="btn">
              Proceed
            </button>
          </div>
          <div className="plan-item-container">
            {planList.map((plan, index) => (
              <div className="plan-item" key={index}>
                <UseIcon planItemNumber={plan.planLevel} planNumber={1} />
                <p>{plan.planName}</p>
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
            <button onClick={() => handleNext("Pro")} className="btn">
              Proceed
            </button>
          </div>
          <div className="plan-item-container">
            {planList.map((plan, index) => (
              <div className="plan-item" key={index}>
                <UseIcon planItemNumber={plan.planLevel} planNumber={2} />
                <p>{plan.planName}</p>
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
            <button onClick={() => handleNext("Enterprise")} className="btn">
              Proceed
            </button>
          </div>
          <div className="plan-item-container">
            {planList.map((plan, index) => (
              <div className="plan-item" key={index}>
                <UseIcon planItemNumber={plan.planLevel} planNumber={3} />
                <p>{plan.planName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Preferences = ({ setOnboardingForm }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const [currentSetting, setCurrentSetting] = useState(1);
  const [appendTeacherObject, setAppendTeacherObject] = useState([]);

  const result_images = [
    {
      id: "result_1",
      image: result_1,
    },
    {
      id: "result_2",
      image: result_2,
    },
    {
      id: "result_3",
      image: result_3,
    },
    {
      id: "result_4",
      image: result_4,
    },
    {
      id: "result_5",
      image: result_5,
    },
    {
      id: "result_6",
      image: result_6,
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelect = (image) => {
    setSelectedImage(image.image);
  };

  const [formData, setFormData] = useState({
    teacher_to_class: [],
    subject_to_class: [],
    result_design_id: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      teacher_to_class: appendTeacherObject,
    }));
  }, [appendTeacherObject]);

  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = (index) => {
    console.log("Edit index", index);
    setEditIndex(index);
    setIsModalVisible(true);
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
            {formData.teacher_to_class.length > 0 ? (
              <div className="list-parent">
                <div className="list-container">
                  {formData.teacher_to_class.map((obj, index) => (
                    <ListItem
                      object={obj}
                      index={index + 1}
                      handleEdit={handleEdit}
                    />
                  ))}
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
            ) : (
              <div className="no-record-yet">
                <HiOutlineClipboardList
                  className="no-record-icon"
                  style={{ transform: "scale(1.2)" }}
                />
                <p>No records yet</p>
                <div className="btn-container">
                  <button onClick={handleOpenModal}>Add record</button>
                </div>
              </div>
            )}

            <AddTeachersModal
              isVisible={isModalVisible}
              onClose={handleCloseModal}
              appendTeacherObject={appendTeacherObject}
              setAppendTeacherObject={setAppendTeacherObject}
              isEdit={editIndex}
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
                      value={image.image}
                      checked={selectedImage === image.image}
                      onChange={() => handleSelect(image)}
                    />
                    <img
                      src={image.image}
                      alt={`Option ${index + 1}`}
                      className={
                        selectedImage === image.image ? "selected" : ""
                      }
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
  const [currentForm, setCurrentForm] = useState(4);

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

  const [onboardingForm, setOnboardingForm] = useState({
    schoolProfile: {},
    adminProfile: {},
    planProfile: {},
    academicProfile: {},
  });

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
              <SchoolProfile
                setOnboardingForm={setOnboardingForm}
                onNext={() => setCurrentForm(2)}
              />
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
              <AdminForm
                setOnboardingForm={setOnboardingForm}
                onNext={() => setCurrentForm(3)}
              />
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
              <PlanCard
                setOnboardingForm={setOnboardingForm}
                onNext={() => setCurrentForm(4)}
              />
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
