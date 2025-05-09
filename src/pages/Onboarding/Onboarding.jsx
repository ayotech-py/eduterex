import React, { useState, useEffect, useCallback } from "react";
import "./Onboarding.css";
import _, { set } from "lodash";
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
import ListItemOnboarding from "../../components/ListItem/ListItemOnboarding";
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
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import Loading from "../../utils/Loader";
import {
  PiArrowRightBold,
  PiCameraBold,
  PiCameraPlusFill,
  PiCheckCircleBold,
  PiPlusCircleBold,
} from "react-icons/pi";
import { allowedImageTypes, compressImage } from "../../utils/Utils";
import { formatAmount } from "../../components/FormatAmount";
import VerifyEmailModal from "../../components/modals/VerifyEmailModal";
import { getOTP } from "../../services/authService";
import PoweredBy from "../../components/PoweredBy";
import priceCalculatorImg from "../../images/price-calculator.png";
import { BiCamera } from "react-icons/bi";

const apiUrl = process.env.REACT_APP_BASE_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const SchoolProfile = ({
  onNext,
  currentStep,
  setOnboardingForm,
  onboardingForm,
}) => {
  const [formData, setFormData] = useState({
    school_name: "",
    address: "",
    motto: "",
    state: "",
    lga: "",
    contact_email: "",
    contact_phone: "",
    school_logo: null,
    email_verified: false,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : name.includes("email") ? value.trim() : value,
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

    const handleFileChange = async (e) => {
      const uploaded_file = e.target.files[0];
      if (!allowedImageTypes.includes(uploaded_file?.type)) {
        setMessage("Only PNG or JPEG images are allowed.");
        return;
      }
      const file = await compressImage(e.target.files[0]);
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

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.email_verified) {
      setMessage("Please verify your email address.");
      return;
    }
    if (isFormValid(formData, setMessage)) {
      setMessage("");
      setOnboardingForm((prevData) => ({
        ...prevData,
        schoolProfile: formData,
      }));
      onNext();
    } else {
      setAlert(true);
    }
  };

  useEffect(() => {
    if (onboardingForm.schoolProfile) {
      setFormData((prevData) => ({
        ...prevData,
        ...onboardingForm.schoolProfile,
      }));
      setLogoImage(onboardingForm.schoolProfile.school_logo);
      setLocation({
        selectedState: onboardingForm.schoolProfile.state,
        selectedLGA: onboardingForm.schoolProfile.lga,
      });
    }
  }, [currentStep]);

  const [loading, setLoading] = useState(false);
  const [receivedOTP, setReceivedOTP] = useState("");

  const openEmailVerificationModal = async () => {
    setMessage("");
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const response = await getOTP({ email: formData.contact_email });
      setLoading(false);

      if (response.success) {
        setReceivedOTP(response.otp);
        handleOpenModal();
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage("An error occurred while sending otp.");
    }
  };

  const emailVerify = () => {
    setFormData((prev) => ({ ...prev, email_verified: true }));
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
      {message && <AlertBadge message={message} />}
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
              <PiCameraBold size={50} color="#711a75" className="camera-icon" />
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
        <div className="input-form-container" style={{ width: "47%" }}>
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
        <div className="input-form-container" style={{ width: "47%" }}>
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
        <div className="input-form-container" style={{ width: "47%" }}>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={(e) => {
              handleChange(e);
              setFormData((prev) => ({ ...prev, email_verified: false }));
            }}
            placeholder="Contact Email"
            style={{ paddingRight: "100px" }}
          />
          <div className="form-icons">
            <FiMail className="icons" />
          </div>
          <div className="form-verify no-width">
            <CustomSmallButton
              text={
                loading ? (
                  <Loading />
                ) : formData.email_verified ? (
                  "Email Verified"
                ) : (
                  "Verify Email"
                )
              }
              runFunction={openEmailVerificationModal}
              disabled={formData.email_verified || loading}
            />
          </div>
        </div>
        <div className="input-form-container" style={{ width: "47%" }}>
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
      <div className="next-btn">
        <CustomSmallButton
          text={"Next"}
          runFunction={handleNext}
          icon={<PiArrowRightBold className="use-font-style" />}
        />
      </div>
      <VerifyEmailModal
        isVisible={isModalVisible && receivedOTP}
        onClose={handleCloseModal}
        setEmailVerified={emailVerify}
        email={formData.contact_email}
        receivedOTP={receivedOTP}
      />
    </section>
  );
};

const AdminForm = ({
  onNext,
  currentStep,
  onboardingForm,
  setOnboardingForm,
}) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    profile_image: null,
    email_verified: false,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("email") ? value.trim() : value,
    });
  };

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const handleNext = () => {
    if (!formData.email_verified) {
      setMessage("Please verify your email address.");
      return;
    }
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

  useEffect(() => {
    if (onboardingForm.adminProfile) {
      setFormData((prevData) => ({
        ...prevData,
        ...onboardingForm.adminProfile,
      }));
    }
    setProfileImage(onboardingForm.adminProfile.profile_image);
  }, [currentStep]);

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fileInput = document.getElementById("fileInput");

    const handleFileChange = async (e) => {
      const uploaded_file = e.target.files[0];
      if (!allowedImageTypes.includes(uploaded_file?.type)) {
        setMessage("Only PNG or JPEG images are allowed.");
        return;
      }
      const file = await compressImage(e.target.files[0]);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
          setFormData((prevData) => ({
            ...prevData,
            profile_image: reader.result,
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

  const [loading, setLoading] = useState(false);
  const [receivedOTP, setReceivedOTP] = useState("");

  const openEmailVerificationModal = async () => {
    setMessage("");
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const response = await getOTP({ email: formData.email });
      setLoading(false);

      if (response.success) {
        setReceivedOTP(response.otp);
        handleOpenModal();
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
    }
  };

  const emailVerify = () => {
    setFormData((prev) => ({ ...prev, email_verified: true }));
  };

  return (
    <section className="signup-form">
      <div className="onboarding-title">
        <h3>Admin Profile</h3>
        <p>Provide the necessary details to create your admin profile.</p>
      </div>
      {message && <AlertBadge message={message} />}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="image-upload">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
          />
          <label htmlFor="fileInput" id="imageBox">
            <span className={profileImage ? "hid-image" : "show-image"}>
              <PiCameraBold size={50} color="#711a75" className="camera-icon" />
            </span>
            {profileImage && (
              <img
                className="show-image"
                id="uploadedImage"
                src={profileImage}
                alt="Uploaded"
              />
            )}
          </label>
        </div>
      </div>
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
          onChange={(e) => {
            handleChange(e);
            setFormData((prev) => ({ ...prev, email_verified: false }));
          }}
          placeholder="Email Address"
          style={{ paddingRight: "120px" }}
        />
        <div className="form-icons">
          <FiMail className="icons" />
        </div>
        <div className="form-verify no-width">
          <CustomSmallButton
            text={
              loading ? (
                <Loading />
              ) : formData.email_verified ? (
                "Email Verified"
              ) : (
                "Verify Email"
              )
            }
            runFunction={openEmailVerificationModal}
            disabled={formData.email_verified || loading}
          />
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
      <div className="next-btn">
        <CustomSmallButton
          text={"Next"}
          runFunction={handleNext}
          icon={<PiArrowRightBold className="use-font-style" />}
        />
      </div>
      <VerifyEmailModal
        isVisible={isModalVisible && receivedOTP}
        onClose={handleCloseModal}
        setEmailVerified={emailVerify}
        email={formData.email}
        receivedOTP={receivedOTP}
      />
    </section>
  );
};

const ProgressIndicator = ({ currentStep, setCurrentStep }) => {
  return (
    <div className="progress-container">
      <div className="progress-indicator">
        <UseProgressIcon
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          step={1}
        />
        <div className="x-line"></div>
        <UseProgressIcon
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          step={2}
        />
        <div className="x-line"></div>
        <UseProgressIcon
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          step={3}
        />
        <div className="x-line"></div>
        <UseProgressIcon
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          step={4}
        />
        <div className="x-line"></div>
        <UseProgressIcon
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          step={5}
        />
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
    "Select Features – Choose the modules that fit your school's needs.",
    "Enter Quantity – Specify the number of students or staff members.",
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

  const handleNext = (planName) => {
    setOnboardingForm((prevData) => ({
      ...prevData,
      planProfile: { plan: planName },
    }));
    onNext();
  };

  return (
    <div className="plan-container onboarding-plan">
      <div className="onboarding-title">
        <h3>Smart Pricing Calculator</h3>
        <p>Get an instant estimate for your subscription plan!</p>
      </div>
      <div className="plan-subcontainer">
        <div
          className="plan-card"
          style={{ backgroundColor: "#fff", padding: "20px" }}
        >
          <p style={{ lineHeight: 2 }}>
            Our pricing calculator allows you to customize your subscription
            based on the features your school needs. Simply select the features,
            specify the number of school members, and choose your subscription
            duration. The total cost updates instantly, helping you make an
            informed decision before checkout.
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
      <div className="btn-container">
        <button onClick={() => handleNext("Pro")} className="btn">
          Proceed
        </button>
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
const Preferences = ({
  setOnboardingForm,
  onboardingForm,
  currentStep,
  onNext,
}) => {
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

  const [message, setMessage] = useState("");

  const [sessionData, setSessionData] = useState({
    session: "",
    start_date: "",
    end_date: "",
    term_name: "",
    term_start_date: "",
    term_end_date: "",
  });

  const handleNext = () => {
    if (currentSetting < 3) {
      if (currentSetting === 1 && formData.classes.length === 0) {
        setMessage("Please add at least one class.");
        return;
      } else if (currentSetting === 2 && formData.subjects.length === 0) {
        setMessage("Please add at least one subject.");
        return;
      } else {
        setMessage("");
        setCurrentSetting(currentSetting + 1);
      }
    } else {
      if (isFormValid(formData, setMessage)) {
        setOnboardingForm((prevData) => ({
          ...prevData,
          academicProfile: formData,
        }));
        onNext();
      }
    }
  };

  const handleSessionChange = (e) => {
    const { name, value, files } = e.target;
    setSessionData({
      ...sessionData,
      [name]: files ? files[0] : value,
    });
  };

  useEffect(() => {
    if (isFormValid(onboardingForm.academicProfile, () => {})) {
      setFormData((prevData) => ({
        ...prevData,
        ...onboardingForm.academicProfile,
      }));
      setSubjectList(onboardingForm.academicProfile.subjects);
      setClassList(onboardingForm.academicProfile.classes);
    }
  }, [currentStep]);

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
              <UseProgressIcon
                currentStep={currentSetting}
                setCurrentStep={setCurrentSetting}
                step={1}
              />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Create Your Classes</h3>
            </div>
          </div>
          <div className="preference-item">
            <div style={{ width: "10%" }}>
              <UseProgressIcon
                currentStep={currentSetting}
                setCurrentStep={setCurrentSetting}
                step={2}
              />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Create Your Subjects</h3>
            </div>
          </div>
          <div className="preference-item">
            <div style={{ width: "10%", lineHeight: 1.4 }}>
              <UseProgressIcon
                currentStep={currentSetting}
                setCurrentStep={setCurrentSetting}
                step={3}
              />
            </div>
            <div style={{ width: "90%", lineHeight: 1.4 }}>
              <h3>Assign Subjects to Classes</h3>
            </div>
          </div>
        </div>

        {currentSetting === 1 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Create Your Classes</h3>
              <p style={{ textAlign: "center" }}>
                Create your classes by specifying a name and setting mandatory
                bills for each. These bills can be modified later in the
                dashboard settings.
              </p>
            </div>
            {formData.classes?.length > 0 ? (
              <div className="list-parent">
                <div className="list-container">
                  {formData.classes.map((obj, index) => (
                    <ListItemOnboarding
                      object={obj.className}
                      index={index + 1}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  ))}
                </div>
                <div className="preferences-footer">
                  <CustomSmallButton
                    text="Add class"
                    runFunction={handleOpenModal}
                    icon={<PiPlusCircleBold className="use-font-style" />}
                  />
                </div>
              </div>
            ) : (
              <div className="no-record-yet">
                <HiOutlineClipboardList
                  className="no-record-icon"
                  style={{ transform: "scale(1.2)" }}
                />
                <p>No records yet</p>
                <CustomSmallButton
                  text="Add record"
                  runFunction={handleOpenModal}
                  icon={<PiPlusCircleBold className="use-font-style" />}
                />
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
        {currentSetting === 2 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Create Your Subjects</h3>
              <p style={{ textAlign: "center" }}>
                Create your subjects by specifying their names. Subject names
                can be modified later in the dashboard settings.
              </p>
            </div>
            {formData.subjects?.length > 0 ? (
              <div className="list-parent">
                <div className="list-container">
                  {formData.subjects.map((obj, index) => (
                    <ListItemOnboarding
                      object={obj}
                      index={index + 1}
                      handleEdit={handleEdit}
                      handleDelete={handleSubjectDelete}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-record-yet">
                <HiOutlineClipboardList
                  className="no-record-icon"
                  style={{ transform: "scale(1.2)" }}
                />
                <p>No records yet</p>
                <CustomSmallButton
                  text="Add record"
                  runFunction={handleOpenModal}
                  icon={<PiPlusCircleBold className="use-font-style" />}
                />
              </div>
            )}
            {formData.subjects?.length > 0 && (
              <div className="preferences-footer">
                <CustomSmallButton
                  text="Add subject"
                  runFunction={handleOpenModal}
                  icon={<PiPlusCircleBold className="use-font-style" />}
                />
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
        {currentSetting === 3 && (
          <div className="main">
            <div className="main-preference-headidng">
              <h3>Assign Subjects to Classes</h3>
              <p style={{ textAlign: "center" }}>
                Assign subjects to their respective classes in alignment with
                your school's curriculum. This can be modified later in the
                dashboard settings.
              </p>
            </div>
            <div
              className="overflow"
              style={{ height: "auto", overflow: "auto" }}
            >
              <SubjectDropdown
                classList={classList}
                subjectsList={subjectList}
                handleSubject={handleSubject}
                subjectObject={formData?.subject_to_class || {}}
              />
            </div>
          </div>
        )}
      </div>
      {message && <AlertBadge message={message} />}
      <div className="next-btn">
        <CustomSmallButton
          text={"Next"}
          runFunction={handleNext}
          icon={<PiArrowRightBold className="use-font-style" />}
        />
      </div>
    </div>
  );
};

const ConfirmationPage = ({ onboardingForm }) => {
  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schoolUrl, setSchoolUrl] = useState("");

  const handleOnboarding = async () => {
    setLoading(true);
    try {
      const url = `${apiUrl}/onboarding/`;
      const request = await fetch(url, {
        method: "POST",
        body: JSON.stringify(onboardingForm),
        headers: {
          "Content-Type": "application/json",
          ApiAuthorization: apiKey,
        },
      });

      let response = await request.json();
      setLoading(false);
      if (request.status === 201) {
        setSchoolUrl(response.school_url);
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading(false);
      setModalMessage("An error occured, please try again");
      setSuccessStatus(false);
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="display-image">
                <img
                  src={onboardingForm?.adminProfile?.profile_image}
                  alt=""
                  srcset=""
                />
              </div>
            </div>
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
          {/* <div className="confirmation-item">
            <h3>Plan Profile</h3>
            <div className="confirmation-details">
              <div className="profile-detail-list">
                <h4>Plan: </h4>
                <p>{onboardingForm.planProfile.plan} Plan</p>
              </div>
            </div>
          </div> */}
        </div>
        <div className="confirmation-item">
          {/* <h3>Academic Profile</h3>
          <h4>Session/Term</h4>
          {Object.entries(onboardingForm.academicProfile.session).map(
            ([key, value], index) => (
              <div key={index} className="profile-detail-list">
                <h4>{key.replaceAll("_", " ").toLocaleLowerCase()}: </h4>
                <p>{value} </p>
              </div>
            ),
          )} */}
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
                  onboardingForm.academicProfile?.subject_to_class,
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
                  {onboardingForm?.academicProfile?.classes?.map(
                    (item, index) => (
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
                                {bill.billName} - ₦
                                {formatAmount(bill.billAmount)}
                              </li>
                            ))}
                            <li key={index} style={{ fontWeight: "600" }}>
                              Total - ₦
                              {formatAmount(
                                item.bills.reduce(
                                  (total, bill) =>
                                    total + (parseFloat(bill.billAmount) || 0),
                                  0,
                                ),
                              )}
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="next-btn">
        <CustomSmallButton
          text={loading ? <Loading /> : "Submit"}
          disabled={loading}
          runFunction={handleOnboarding}
          icon={!loading && <PiCheckCircleBold className="use-font-style" />}
        />
      </div>
      {/* <div className="btn-container">
        <button onClick={handleOnboarding} className="btn">
          Submit
        </button>
      </div> */}
      <AlertModal
        isVisible={successStatus && schoolUrl ? true : false || modalMessage}
        onClose={() => {
          setModalMessage("");
          if (schoolUrl) {
            window.location.replace(schoolUrl);
          }
        }}
        message={modalMessage}
        success={successStatus}
      />
    </div>
  );
};

const Onboarding = () => {
  const [currentForm, setCurrentForm] = useState(1);

  useEffect(() => {
    document.title = "Onboarding - Eduterex";
  }, []);

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
      <div className="poweredby-tag">
        <PoweredBy dark={true} />
      </div>
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
              style={{ width: "100%", height: "100%" }}
            >
              <SchoolProfile
                setOnboardingForm={setOnboardingForm}
                onboardingForm={onboardingForm}
                currentStep={currentForm}
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
              style={{ width: "100%", height: "100%" }}
            >
              <AdminForm
                setOnboardingForm={setOnboardingForm}
                onboardingForm={onboardingForm}
                currentStep={currentForm}
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
              style={{ width: "100%", height: "100%" }}
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
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Preferences
                setOnboardingForm={setOnboardingForm}
                onboardingForm={onboardingForm}
                currentStep={currentForm}
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
              style={{ width: "100%", height: "100%" }}
            >
              <ConfirmationPage onboardingForm={onboardingForm} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ marginTop: "1rem", width: "100%" }}>
        <ProgressIndicator
          currentStep={currentForm}
          setCurrentStep={setCurrentForm}
        />
      </div>
      <div className="poweredby-tag-mobile">
        <PoweredBy dark={true} center={true} />
      </div>
    </div>
  );
};

export default Onboarding;
