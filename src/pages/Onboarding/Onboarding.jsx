import React, { useState, useEffect, useCallback } from "react";
import "./Onboarding.css";
import _ from "lodash";
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
  FiUserPlus,
} from "react-icons/fi";
import nigeriaStates from "../../utils/nigeria-state-and-lgas.json"; // Import JSON file
import { motion, AnimatePresence } from "framer-motion";
import { UseProgressIcon } from "../../components/UseProgressIcon";
import AddClassModal from "../../components/modals/AddClassModal/AddClassModal";
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
import AddSubjectModal from "../../components/modals/AddSubjectModal";
import CustomTextInput from "../../components/CustomTextInput/CustomTextInput";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { AiFillCalendar } from "react-icons/ai";

const SchoolProfile = ({ onNext, setOnboardingForm }) => {
  const [formData, setFormData] = useState({
    school_name: "",
    address: "",
    motto: "",
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
      <div className="input-form-container">
        <input
          type="text"
          name="motto"
          value={formData.motto}
          onChange={handleChange}
          placeholder="Motto"
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
        <h3>Admin Profile</h3>
        <p>Provide the necessary details to create your admin profile.</p>
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
const Preferences = ({ setOnboardingForm, onNext }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const [currentSetting, setCurrentSetting] = useState(1);
  const [classList, setClassList] = useState([]);

  const [subjectList, setSubjectList] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelectResult = (image) => {
    setSelectedImage(image.image);
    setFormData((prevData) => ({
      ...prevData,
      result_design_id: image.id,
    }));
  };

  const [formData, setFormData] = useState({
    session: {},
    classes: [],
    subjects: [],
    subject_to_class: [],
    result_design_id: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      classes: classList,
    }));
  }, [classList]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      subjects: subjectList,
    }));
  }, [subjectList]);

  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = (index) => {
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const handleDelete = (index) => {
    const newClassList = classList.filter((obj, i) => i !== index - 1);
    setClassList(newClassList);
    setEditIndex(null);
  };

  const handleSubjectDelete = (index) => {
    const newSubjectList = subjectList.filter((obj, i) => i !== index - 1);
    setSubjectList(newSubjectList);
    setEditIndex(null);
  };

  const handleSubject = useCallback(
    _.debounce((subjectObject) => {
      setFormData((prevData) => ({
        ...prevData,
        subject_to_class: subjectObject,
      }));
    }, 200),
    [],
  );

  const [message, setMessagee] = useState("");

  const [sessionData, setSessionData] = useState({
    session: "",
    start_date: "",
    end_date: "",
    term_name: "",
    term_start_date: "",
    term_end_date: "",
  });

  const handleNext = () => {
    if (currentSetting < 4) {
      if (currentSetting === 1) {
        if (isFormValid(sessionData, setMessagee)) {
          setMessagee("");
          setFormData((prevData) => ({
            ...prevData,
            session: sessionData,
          }));
          setCurrentSetting(currentSetting + 1);
        }
      } else {
        setCurrentSetting(currentSetting + 1);
      }
    } else {
      setOnboardingForm((prevData) => ({
        ...prevData,
        academicProfile: formData,
      }));
      onNext();
    }
  };

  const handleSessionChange = (e) => {
    const { name, value, files } = e.target;
    setSessionData({
      ...sessionData,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <div className="preferences-container">
      <div className="onboarding-title">
        <h3>Configure Your Academic Profile</h3>
        <p>Streamline your school operations by setting up key preferences. </p>
      </div>
      <div className="preferences">
        <div className="aside">
          <div className="preference-item">
            <div style={{ width: "10%" }}>
              <UseProgressIcon currentStep={currentSetting} step={1} />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Create Your Session & Terms</h3>
            </div>
          </div>
          <div className="preference-item">
            <div style={{ width: "10%" }}>
              <UseProgressIcon currentStep={currentSetting} step={2} />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Create Your Classes</h3>
            </div>
          </div>
          <div className="preference-item">
            <div style={{ width: "10%" }}>
              <UseProgressIcon currentStep={currentSetting} step={3} />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Create Your Subjects</h3>
            </div>
          </div>
          <div className="preference-item">
            <div style={{ width: "10%", lineHeight: 1.4 }}>
              <UseProgressIcon currentStep={currentSetting} step={4} />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Assign Subjects to Classes</h3>
            </div>
          </div>

          {/* <div className="preference-item">
            <div style={{ width: "10%" }}>
              <UseProgressIcon currentStep={currentSetting} step={5} />
            </div>
            <div style={{ width: "90%", lineHeight: 1.3 }}>
              <h3>Result Format Preference</h3>
            </div>
          </div> */}
        </div>
        {currentSetting === 1 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Create Your Session and Terms</h3>
              <p style={{ textAlign: "center" }}>
                Easily create new classes by adding their names and assigning
                subjects.
              </p>
            </div>
            <div className="session-profile overflow">
              <CustomSelectionInput
                placeholder={"Session"}
                name={"session"}
                value={sessionData.session}
                handleChange={handleSessionChange}
                data={[
                  "2022/2023",
                  "2023/2024",
                  "2024/2025",
                  "2025/2026",
                  "2026/2027",
                  "2027/2028",
                  "2028/2029",
                  "2029/2030",
                ]}
                icon={<FiUserPlus className="icons" />}
              />
              <div style={{ width: "100%" }}>
                <label htmlFor="date">Session Start Date</label>
                <CustomTextInput
                  name={"start_date"}
                  placeholder={"Session Start Date"}
                  value={sessionData.start_date}
                  handleChange={handleSessionChange}
                  icon={<AiFillCalendar className="icons" />}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label htmlFor="date">Session End Date</label>
                <CustomTextInput
                  name={"end_date"}
                  placeholder={"Session End Date"}
                  value={sessionData.end_date}
                  handleChange={handleSessionChange}
                  icon={<AiFillCalendar className="icons" />}
                />
              </div>
              <h4>Term Details</h4>
              <CustomTextInput
                name={"term_name"}
                placeholder={"Name of term e.g First Term"}
                value={sessionData.term_name}
                handleChange={handleSessionChange}
                icon={<FiUser className="icons" />}
              />
              <div style={{ width: "100%" }}>
                <label htmlFor="date">Term Start Date</label>
                <CustomTextInput
                  name={"term_start_date"}
                  placeholder={"First Term Start Date"}
                  value={sessionData.term_start_date}
                  handleChange={handleSessionChange}
                  icon={<AiFillCalendar className="icons" />}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label htmlFor="date">Term End Date</label>
                <CustomTextInput
                  name={"term_end_date"}
                  placeholder={"First Term End Date"}
                  value={sessionData.term_end_date}
                  handleChange={handleSessionChange}
                  icon={<AiFillCalendar className="icons" />}
                />
              </div>
            </div>
            {message && <AlertBadge message={message} />}
          </div>
        )}
        {currentSetting === 2 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Create Your Classes</h3>
              <p style={{ textAlign: "center" }}>
                Easily create new classes by adding their names and assigning
                subjects. This helps organize your school’s curriculum and
                manage subject distribution efficiently.
              </p>
            </div>
            {formData.classes.length > 0 ? (
              <div className="list-parent">
                <div className="list-container">
                  {formData.classes.map((obj, index) => (
                    <ListItem
                      object={obj.className}
                      index={index + 1}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  ))}
                </div>
                <div className="preferences-footer">
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

            <AddClassModal
              isVisible={isModalVisible}
              onClose={handleCloseModal}
              classList={classList}
              setClassList={setClassList}
              isEdit={editIndex}
              setEditIndex={setEditIndex}
            />
          </div>
        )}
        {currentSetting === 3 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Create Your Subjects</h3>
              <p style={{ textAlign: "center" }}>
                Easily create new classes by adding their names and assigning
                subjects. This helps organize your school’s curriculum and
                manage subject distribution efficiently.
              </p>
            </div>
            {formData.subjects.length > 0 ? (
              <div className="list-parent">
                <div className="list-container">
                  {formData.subjects.map((obj, index) => (
                    <ListItem
                      object={obj}
                      index={index + 1}
                      handleEdit={handleEdit}
                      handleDelete={handleSubjectDelete}
                    />
                  ))}
                </div>
                <div className="preferences-footer">
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

            <AddSubjectModal
              isVisible={isModalVisible}
              onClose={handleCloseModal}
              subjectList={subjectList}
              setSubjectList={setSubjectList}
              isEdit={editIndex}
              setEditIndex={setEditIndex}
            />
          </div>
        )}
        {currentSetting === 4 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Assign Subjects to Classes</h3>
              <p style={{ textAlign: "center" }}>
                Allocate subjects to the appropriate classes based on the
                curriculum.
              </p>
            </div>
            <div>
              <SubjectDropdown
                classList={classList}
                subjectsList={subjectList}
                handleSubject={handleSubject}
              />
            </div>
            <p style={{ fontSize: "12px" }}>
              Note: Once you select subjects for a class, the same subjects will
              automatically be filled in the next class to save you time. Please
              continue selecting subjects in a row-wise manner for consistency.
            </p>
          </div>
        )}

        {/* {currentSetting === 5 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Result Format Preference</h3>
              <p>Choose a result design that suits your taste format.</p>
            </div>
            <div>
              <div className="image-selector overflow">
                {result_images.map((image, index) => (
                  <label key={index} className="image-option">
                    <input
                      type="radio"
                      name="image"
                      value={image.image}
                      checked={selectedImage === image.image}
                      onChange={() => handleSelectResult(image)}
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
        )} */}
      </div>
      <div className="btn-container">
        <button onClick={handleNext} className="btn">
          Next
        </button>
      </div>
    </div>
  );
};

const ConfirmationPage = ({ onboardingForm }) => {
  useEffect(() => {
    console.log(onboardingForm);
  }, [onboardingForm]);

  function getImageById(id) {
    const result = result_images.find((item) => item.id === id);
    return result ? result.image : null;
  }

  const handleOnboarding = async () => {
    console.log("result", onboardingForm);
    try {
      const url = "http://127.0.0.1:8000/api/onboarding/";
      const request = await fetch(url, {
        method: "POST",
        body: JSON.stringify(onboardingForm),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let response = await request.json();
      if (request.status === 201) {
        console.log("okayyy", response);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="confirmation-container">
      <div className="onboarding-title">
        <h3>Confirmation & Completion</h3>
        <p>Please confirm all your entries before submiting.</p>
      </div>
      <div className="confirmation-grid overflow">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="confirmation-item">
            <h3>School Profile</h3>
            <div className="confirmation-details">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="display-image">
                  <img
                    src={onboardingForm.schoolProfile.school_logo}
                    alt=""
                    srcset=""
                  />
                </div>
              </div>
              <div className="profile-detail-list">
                <h4>School Name: </h4>
                <p>{onboardingForm.schoolProfile.school_name} </p>
              </div>
              <div className="profile-detail-list">
                <h4>Address: </h4>
                <p>{onboardingForm.schoolProfile.address} </p>
              </div>
              <div className="profile-detail-list">
                <h4>Motto: </h4>
                <p>{onboardingForm.schoolProfile.motto} </p>
              </div>
              <div className="profile-detail-list">
                <h4>State: </h4>
                <p>{onboardingForm.schoolProfile.state} </p>
              </div>
              <div className="profile-detail-list">
                <h4>LGA: </h4>
                <p>{onboardingForm.schoolProfile.lga} </p>
              </div>
              <div className="profile-detail-list">
                <h4>Email: </h4>
                <p>{onboardingForm.schoolProfile.contact_email} </p>
              </div>
              <div className="profile-detail-list">
                <h4>Phone: </h4>
                <p>{onboardingForm.schoolProfile.contact_phone} </p>
              </div>
            </div>
          </div>
          <div className="confirmation-item">
            <h3>Admin Profile</h3>
            <div className="confirmation-details">
              <div className="profile-detail-list">
                <h4>Full Name: </h4>
                <p>{onboardingForm.adminProfile.full_name} </p>
              </div>
              <div className="profile-detail-list">
                <h4>Email: </h4>
                <p>{onboardingForm.adminProfile.email} </p>
              </div>
              <div className="profile-detail-list">
                <h4>Phone: </h4>
                <p>{onboardingForm.adminProfile.phone} </p>
              </div>
            </div>
          </div>
          <div className="confirmation-item">
            <h3>Plan Profile</h3>
            <div className="confirmation-details">
              <div className="profile-detail-list">
                <h4>Plan: </h4>
                <p>{onboardingForm.planProfile.plan} Plan</p>
              </div>
            </div>
          </div>
        </div>
        <div className="confirmation-item">
          <h3>Academic Profile</h3>
          <h4>Session/Term</h4>
          {Object.entries(onboardingForm.academicProfile.session).map(
            ([key, value], index) => (
              <div key={index} className="profile-detail-list">
                <h4>{key.replaceAll("_", " ").toLocaleLowerCase()}: </h4>
                <p>{value} </p>
              </div>
            ),
          )}
          <div className="confirmation-details">
            <table
              border="1"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr className="odd-table">
                  <th>S/N</th>
                  <th>Classes</th>
                  <th>Subjects</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  onboardingForm.academicProfile.subject_to_class,
                ).map(([key, value], index) => (
                  <tr
                    key={key}
                    className={index % 2 === 1 ? "odd-table" : "even-table"}
                  >
                    <td>{index + 1}</td>
                    <td>{key}</td>
                    <td>
                      <ul>
                        {value.map((subject, index) => (
                          <li key={index}>{subject}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Classes</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <table
                border="1"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr className="odd-table">
                    <th>S/N</th>
                    <th>Classes</th>
                    <th>School Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {onboardingForm.academicProfile.classes.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "odd-table" : "even-table"}
                    >
                      <td>{index + 1}</td>
                      <td>{item.className}</td>
                      <td>
                        <ul>
                          {item.bills.map((bill, index) => (
                            <li key={index}>
                              {bill.billName} - ₦{bill.billAmount}
                            </li>
                          ))}
                          <li key={index} style={{ fontWeight: "600" }}>
                            Total - ₦
                            {item.bills.reduce(
                              (total, bill) =>
                                total + (parseFloat(bill.billAmount) || 0),
                              0,
                            )}
                          </li>
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="btn-container">
        <button onClick={handleOnboarding} className="btn">
          Submit
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

  const [onboardingForm, setOnboardingForm] = useState({
    schoolProfile: {},
    adminProfile: {},
    planProfile: {},
    academicProfile: {},
  });

  return (
    <div className="onboarding-container">
      <div className="animation-container">
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
              <Preferences
                setOnboardingForm={setOnboardingForm}
                onNext={() => setCurrentForm(5)}
              />
            </motion.div>
          )}

          {currentForm === 5 && (
            <motion.div
              key="confirmation"
              custom="next"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <ConfirmationPage onboardingForm={onboardingForm} />
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
