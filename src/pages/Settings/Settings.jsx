import React, { useEffect, useMemo, useState } from "react";
import "./Settings.css";
import { useSchool } from "../../context/SchoolContext";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import { BsTrash, BsTrash2Fill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import {
  PiCameraBold,
  PiCheckCircleBold,
  PiMinusCircleBold,
  PiPlusCircleBold,
} from "react-icons/pi";
import { settingsHandler } from "../../services/schoolService";
import { isFormValid } from "../../utils/OnboardingUtils/FormChecker";
import Loading from "../../utils/Loader";
import { formatAmount } from "../../components/FormatAmount";
import CustomTextInput from "../../components/CustomTextInput/CustomTextInput";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { allowedImageTypes, compressImage } from "../../utils/Utils";
import { MdOutlineSchool } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiMail, FiMap, FiPhone } from "react-icons/fi";
import nigeriaStates from "../../utils/nigeria-state-and-lgas.json"; // Import JSON file
import { useAuth } from "../../context/AuthContext";
import { BiEdit } from "react-icons/bi";
import BillModal from "../../components/modals/BillModal";
import ColorPicker from "../../components/ColorPicker";
import { AlertBadge } from "../../components/AlertBadge";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import ContentTitle from "../../components/ContentTitle";

const Settings = () => {
  const { schoolState, setSchoolDatas, inLatestSession, termId, sessionId } =
    useSchool();
  const { authState, updateUser, hasAccess } = useAuth();
  const {
    classes,
    schoolStudents,
    schoolSession,
    subjects,
    schoolResult,
    schoolTuition,
  } = schoolState;
  const { user } = authState;

  const [featureName, setFeatureName] = useState(null);

  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [gradingList, setGradingList] = useState(null);
  const [classList, setClassList] = useState(null);
  const [subjectList, setSubjectList] = useState(null);
  const [loading, setLoading] = useState({
    grading: false,
    scores: false,
    class: false,
    subject: false,
    schoolProfile: false,
    signatories: false,
    schoolColor: false,
    result: false,
  });
  const [bill, setBill] = useState({
    billName: "",
    billAmount: "",
  });

  const [logoImage, setLogoImage] = useState(user?.school?.logo || null);
  const [signature, setSignature] = useState(user?.school?.signature || null);
  const [stamp, setStamp] = useState(user?.school?.stamp || null);

  const [caMaxScore, setCaMaxScore] = useState(0);
  const [testMaxScore, setTestMaxScore] = useState(0);
  const [examMaxScore, setExamMaxScore] = useState(0);
  const [cutOffPoint, setCutOffPoint] = useState(0);

  //Result type
  const [resultType, setResultType] = useState(null);

  useEffect(() => {
    const activeSession = schoolSession?.find((obj) => obj?.is_active);

    const activeTerm = activeSession?.terms?.find((term) => term?.is_active);

    setClassList(classes || []);
    setSubjectList(subjects || []);

    setGradingList(activeSession?.gradings || []);
    setCaMaxScore(activeTerm?.ca_max_score);
    setTestMaxScore(activeTerm?.test_max_score);
    setExamMaxScore(activeTerm?.exam_max_score);
    setCutOffPoint(activeTerm?.cut_off_point);
    setResultType(activeTerm?.cumm_result);

    setStamp(user?.school?.stamp);
    setSignature(user?.school?.signature);
  }, [schoolSession]);

  const handleSettings = async (data, label) => {
    if (label === "grading") {
      if (data?.grading.length <= 0) {
        setMessage("Your gradings metric table cannot be empty.");
        setSuccessStatus(false);
        return;
      }
      for (let obj in data?.grading) {
        const isValid = isFormValid(data?.grading[obj], setMessage);
        if (isValid !== true) {
          setSuccessStatus(false);
          return;
        }
      }
    } else if (label === "scores") {
      const isValid = isFormValid(data?.scores, setMessage);
      if (isValid !== true) {
        setSuccessStatus(false);
        return;
      }
    }

    setLoading({ ...loading, [label]: true });
    try {
      const response = await settingsHandler(JSON.stringify(data));
      setLoading({ ...loading, [label]: false });

      if (response.success) {
        updateUser(response.user);
        setSchoolDatas(response.schoolData);
        const current_subdomain = window.location.host.split(".")[0];
        if (current_subdomain !== response.user?.school?.slug) {
          window.location.replace(
            `https://${response.user?.school?.slug}.eduterex.com.ng`,
          );
        }
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading({ ...loading, [label]: false });
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  //School profile settings
  const [formData, setFormData] = useState({
    school_name: user?.school?.name || "",
    address: user?.school?.address || "",
    motto: user?.school?.motto || "",
    state: user?.school?.state || "",
    lga: user?.school?.lga || "",
    contact_email: user?.school?.email || "",
    contact_phone: user?.school?.phone_number || "",
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
    selectedState: user?.school?.state || "",
    selectedLGA: user?.school?.lga || "",
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

  useEffect(() => {
    const fileInput = document.getElementById("fileInputSign");

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
          setSignature(reader.result);
          /* setFormData((prevData) => ({
            ...prevData,
            school_logo: reader.result,
          })); */
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.addEventListener("change", handleFileChange);

    return () => {
      fileInput.removeEventListener("change", handleFileChange); // Cleanup event listener
    };
  }, []);

  useEffect(() => {
    const fileInput = document.getElementById("fileInputStamp");

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
          setStamp(reader.result);
          /* setFormData((prevData) => ({
            ...prevData,
            school_logo: reader.result,
          })); */
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.addEventListener("change", handleFileChange);

    return () => {
      fileInput.removeEventListener("change", handleFileChange); // Cleanup event listener
    };
  }, []);

  //Class Bill
  const [billIndex, setBillIndex] = useState(null);

  const getTotalBills = useMemo(() => {
    return (index) => {
      return classList[index]?.bills
        .reduce((total, bill) => {
          const amount = parseFloat(bill.billAmount);
          return total + (isNaN(amount) ? 0 : amount);
        }, 0)
        .toFixed(2);
    };
  }, [classList]);

  const [edit, setEdit] = useState(null);

  const handleUpdateBill = (inputBill, index) => {
    if (edit !== null) {
      setClassList((prev) => {
        prev[index].bills[edit] = inputBill;
        prev[index].edited = [
          ...(Array.isArray(prev[index]?.edited) ? prev[index].edited : []),
          "bills",
        ];

        return [...prev];
      });
      setEdit(null);
    } else {
      setClassList((prev) => {
        prev[index].bills.push(inputBill);
        prev[index].edited = [
          ...(Array.isArray(prev[index]?.edited) ? prev[index].edited : []),
          "bills",
        ];

        return [...prev];
      });
    }
    setMessage("");
  };

  const removeBill = (classIndex, objBillIndex, billName) => {
    setClassList((prev) => {
      prev[classIndex].edited = [
        ...(Array.isArray(prev[classIndex]?.edited)
          ? prev[classIndex].edited
          : []),
        "bills",
      ];
      return prev.map((cls, idx) => {
        if (idx === classIndex) {
          return {
            ...cls,
            bills: cls.bills.filter(
              (obj, index) =>
                !(index === objBillIndex && obj.billName === billName),
            ),
          };
        }
        return cls;
      });
    });
  };

  const [isBillModalVisible, setIsBillModalVisible] = useState(false);
  const handleOpenBillModal = () => setIsBillModalVisible(true);
  const handleCloseBillModal = () => setIsBillModalVisible(false);

  //School Colors
  const [schoolColor, setSchoolColor] = useState({
    lightColor: null,
    darkColor: null,
  });

  useEffect(() => {
    setSchoolColor({
      lightColor: user?.school?.light_color,
      darkColor: user?.school?.dark_color,
    });
  }, [user]);

  return !hasAccess(1) ? (
    <div className="settings-container">
      <div className="all-settings">
        <div className="setting-card signup-form">
          <ContentTitle title={"Update School Profile"} />
          <p>
            Changing these fields will affect other datas that depends on this
            data.
          </p>
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
                  <PiCameraBold
                    size={50}
                    color="#711a75"
                    className="camera-icon"
                  />
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
            <div className="input-form-container" style={{ width: "48%" }}>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="Contact Email"
                disabled
              />
              <div className="form-icons">
                <FiMail className="icons" />
              </div>
            </div>
            <div className="input-form-container" style={{ width: "48%" }}>
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
          <div className="form-flex">
            <div className="input-form-container" style={{ width: "48%" }}>
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
            <div className="input-form-container" style={{ width: "48%" }}>
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
          <CustomSmallButton
            text={loading.schoolProfile ? <Loading /> : `Update Profile`}
            disabled={loading.schoolProfile}
            runFunction={() => {
              if (!hasAccess(1)) {
                handleSettings(
                  { schoolProfile: formData, term_id: termId },
                  "schoolProfile",
                );
              } else {
                setFeatureName("school_profile");
              }
            }}
            icon={
              !loading.schoolProfile && (
                <PiCheckCircleBold className="use-font-style" />
              )
            }
          />
        </div>
        <div className="setting-card">
          <ContentTitle title={"Document Signatories"} />
          <p>
            Please provide a PNG image of the authorized signatories. These will
            be used to automatically sign and stamp student bills, receipts, and
            results, ensuring authenticity and credibility. Changing these
            fields will affect other datas that depends on this data for this
            current session.
          </p>
          <div className="signatory-container">
            <div
              className="image-upload"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "0%",
              }}
            >
              <input
                type="file"
                id="fileInputSign"
                className="hidden"
                accept="image/*"
              />
              <label htmlFor="fileInputSign" id="imageBox">
                <span className={signature ? "hid-image" : "show-image"}>
                  Click to upload signature image
                </span>
                {signature && (
                  <img
                    className="show-image"
                    id="uploadedImage"
                    src={signature}
                    alt="Uploaded"
                    style={{
                      borderRadius: "0%",
                    }}
                  />
                )}
              </label>
            </div>
            <div
              className="image-upload"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "0%",
              }}
            >
              <input
                type="file"
                id="fileInputStamp"
                className="hidden"
                accept="image/*"
              />
              <label htmlFor="fileInputStamp" id="imageBox">
                <span className={stamp ? "hid-image" : "show-image"}>
                  Click to upload stamp image
                </span>
                {stamp && (
                  <img
                    className="show-image"
                    id="uploadedImage"
                    src={stamp}
                    alt="Uploaded"
                    style={{
                      borderRadius: "0%",
                    }}
                  />
                )}
              </label>
            </div>
          </div>
          <CustomSmallButton
            text={loading.signatories ? <Loading /> : `Update Signatories`}
            disabled={loading.signatories}
            runFunction={() =>
              handleSettings(
                {
                  signatories: {
                    stamp: stamp,
                    signature: signature,
                  },
                  term_id: termId,
                },
                "signatories",
              )
            }
            icon={
              !loading.signatories && (
                <PiCheckCircleBold className="use-font-style" />
              )
            }
          />
        </div>
        <div className="setting-card">
          <ContentTitle title={"Grading Settings"} />
          <p>
            Adjust the grading table below to align with your school's grading
            system. Changing these fields will affect other datas that depends
            on this data for this current session.
          </p>
          <div className="settings-tables">
            <div className="new-table-style">
              <table>
                <thead>
                  <tr className="heading-style">
                    <th>Min. Score</th>
                    <th>Max. Score</th>
                    <th>Grade</th>
                    <th>Remark</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gradingList?.map((obj, index) => (
                    <tr key={index} className="content-style">
                      <td>
                        <input
                          className="number-input"
                          type="number"
                          name="minScore"
                          value={obj?.minScore}
                          onChange={(e) => {
                            setGradingList((prev) => {
                              prev[index].minScore = e.target.value;
                              return [...prev];
                            });
                          }}
                          id=""
                        />
                      </td>
                      <td>
                        <input
                          className="number-input"
                          type="number"
                          name="maxScore"
                          value={obj?.maxScore}
                          onChange={(e) => {
                            setGradingList((prev) => {
                              prev[index].maxScore = e.target.value;
                              return [...prev];
                            });
                          }}
                          id=""
                        />
                      </td>
                      <td>
                        <input
                          className="number-input"
                          type="text"
                          name="grade"
                          value={obj?.grade}
                          onChange={(e) => {
                            setGradingList((prev) => {
                              prev[index].grade = e.target.value;
                              return [...prev];
                            });
                          }}
                          maxLength={2}
                          id=""
                        />
                      </td>
                      <td>
                        <input
                          className="text-input"
                          type="text"
                          name="grade"
                          value={obj?.remark}
                          onChange={(e) => {
                            setGradingList((prev) => {
                              prev[index].remark = e.target.value;
                              return [...prev];
                            });
                          }}
                          maxLength={20}
                          id=""
                        />
                      </td>
                      <td>
                        <FaTrash
                          className="icon"
                          style={{ padding: "5px", cursor: "pointer" }}
                          onClick={() => {
                            const newGradingList = gradingList?.filter(
                              (_, objIndex) => objIndex !== index,
                            );
                            setGradingList(newGradingList);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="setting-action-buttons">
            <CustomSmallButton
              text={"Add"}
              icon={<PiPlusCircleBold className="use-font-style" />}
              runFunction={() =>
                setGradingList([
                  ...gradingList,
                  {
                    minScore: "",
                    maxScore: "",
                    grade: "",
                    remark: "",
                  },
                ])
              }
              disabled={!inLatestSession ? true : false}
            />
            <CustomSmallButton
              text={loading.grading ? <Loading /> : `Update Gradings`}
              disabled={!inLatestSession ? true : loading.grading}
              runFunction={() =>
                handleSettings(
                  { grading: gradingList, term_id: termId },
                  "grading",
                )
              }
              icon={
                !loading.grading && (
                  <PiCheckCircleBold className="use-font-style" />
                )
              }
            />
          </div>
        </div>
        <div className="setting-card">
          <ContentTitle title={"Assessment Max. Grading Settings"} />
          <p>
            Adjust the below table to fit in your school's assessment grading
            model, annd promotion pass mark, Changing these fields will affect
            other datas that depends on this data for this current term.
          </p>
          <AlertBadge
            message={
              "Only students who surpasses the promotion pass mark will be promoted to the next class."
            }
          />
          <div className="assesment-container">
            <div className="new-table-style">
              <table>
                <thead>
                  <tr className="heading-style">
                    <th>CA Max. Score</th>
                    <th>Test Max. Score</th>
                    <th>Exam Max. Score</th>
                    <th>Promotion Pass Mark (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="content-style">
                    <td>
                      <input
                        type="number"
                        name="ca_max_score"
                        value={caMaxScore}
                        onChange={(e) => {
                          setCaMaxScore(e.target.value);
                        }}
                        id=""
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="test_max_score"
                        value={testMaxScore}
                        onChange={(e) => setTestMaxScore(e.target.value)}
                        id=""
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="exam_max_score"
                        value={examMaxScore}
                        onChange={(e) => setExamMaxScore(e.target.value)}
                        id=""
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="cut_off_point"
                        value={cutOffPoint}
                        onChange={(e) => setCutOffPoint(e.target.value)}
                        id=""
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="setting-action-button-single">
            <CustomSmallButton
              text={loading.scores ? <Loading /> : `Update Scores`}
              disabled={!inLatestSession ? true : loading.scores}
              runFunction={() =>
                handleSettings(
                  {
                    scores: {
                      ca_score: caMaxScore,
                      test_score: testMaxScore,
                      exam_score: examMaxScore,
                      cut_off_point: cutOffPoint,
                    },
                    term_id: termId,
                  },
                  "scores",
                )
              }
              icon={
                !loading.scores && (
                  <PiCheckCircleBold className="use-font-style" />
                )
              }
            />
          </div>
        </div>
        <div className="setting-card">
          <ContentTitle title={"Classes Settings"} />
          <p>
            Changing these fields will affect other datas that depends on this
            data for this current session, and term.
          </p>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th>Classes</th>
                  <th style={{ minWidth: "250px" }}>Subjects</th>
                  <th style={{ minWidth: "450px" }}>Class Bills</th>
                </tr>
              </thead>
              <tbody>
                {classList?.map((obj, index) => (
                  <tr key={index} className="content-style">
                    <td>
                      <input
                        type="text"
                        className="text-input"
                        name="class_name"
                        value={obj?.name}
                        onChange={(e) => {
                          setClassList((prev) => {
                            prev[index].name = e.target.value;
                            prev[index].edited = [
                              ...(Array.isArray(prev[index]?.edited)
                                ? prev[index].edited
                                : []),
                              "name",
                            ];
                            return [...prev];
                          });
                        }}
                        id=""
                      />
                    </td>
                    <td>
                      {subjects?.map((sub, subIndex) => (
                        <label key={subIndex} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={obj?.subjects.some(
                              (subject) => subject.id === sub.id,
                            )}
                            onChange={(e) => {
                              setClassList((prev) =>
                                prev.map((item, idx) => {
                                  if (idx === index) {
                                    const isSelected = item.subjects.some(
                                      (subject) => subject.id === sub.id,
                                    );

                                    const updatedSubjects = isSelected
                                      ? item.subjects.filter(
                                          (subject) => subject.id !== sub.id,
                                        ) // Remove subject
                                      : [...item.subjects, sub]; // Add subject (entire object, not just ID)
                                    prev[index].edited = [
                                      ...(Array.isArray(prev[index]?.edited)
                                        ? prev[index].edited
                                        : []),
                                      "subjects",
                                    ];

                                    return {
                                      ...item,
                                      subjects: updatedSubjects,
                                    };
                                  }
                                  return item;
                                }),
                              );
                            }}
                          />
                          {sub.name}
                        </label>
                      ))}
                    </td>
                    <td>
                      <div>
                        {obj?.bills?.length > 0 ? (
                          <table
                            border="1"
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              textAlign: "center",
                            }}
                          >
                            <thead>
                              <tr>
                                <th>S/N</th>
                                <th>Bill Name</th>
                                <th>Bill Amount (₦)</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {obj?.bills?.map((item, objBillIndex) => (
                                <tr key={objBillIndex}>
                                  <td>{objBillIndex + 1}</td>
                                  <td>{item.billName}</td>
                                  <td>₦{formatAmount(item.billAmount)}</td>
                                  <td>
                                    <div
                                      style={{ display: "flex", gap: "5px" }}
                                    >
                                      <BiEdit
                                        className="action-icon"
                                        style={{
                                          fontSize: "20px",
                                          width: "20px",
                                          height: "20px",
                                        }}
                                        onClick={() => {
                                          setEdit(objBillIndex);
                                          setBillIndex(index);
                                          setBill(item);
                                          handleOpenBillModal();
                                        }}
                                      />
                                      <PiMinusCircleBold
                                        className="action-icon"
                                        style={{
                                          fontSize: "20px",
                                          width: "20px",
                                          height: "20px",
                                        }}
                                        onClick={() =>
                                          removeBill(
                                            index,
                                            objBillIndex,
                                            item.billName,
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={2}>Total:</td>
                                <td>₦{formatAmount(getTotalBills(index))}</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          <p>No bills added yet.</p>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "center",
                          marginTop: "10px",
                        }}
                      >
                        <CustomSmallButton
                          text={"Add Bill"}
                          runFunction={() => {
                            setBillIndex(index);
                            handleOpenBillModal();
                          }}
                          icon={<PiPlusCircleBold className="use-font-style" />}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="setting-action-buttons">
            <CustomSmallButton
              text={"Add Class"}
              icon={<PiPlusCircleBold className="use-font-style" />}
              runFunction={() =>
                setClassList([
                  ...classList,
                  {
                    id: "new",
                    name: "",
                    subjects: [],
                    bills: [],
                  },
                ])
              }
            />
            <CustomSmallButton
              text={loading.class ? <Loading /> : `Update Class`}
              disabled={!inLatestSession ? true : loading.class}
              runFunction={() =>
                handleSettings({ class: classList, term_id: termId }, "class")
              }
              icon={
                !loading.class && (
                  <PiCheckCircleBold className="use-font-style" />
                )
              }
            />
          </div>
        </div>
        <div className="setting-card">
          <ContentTitle title={"Subjects Settings"} />
          <p>
            Changing these fields will affect other datas that depends on this
            data for this current session.
          </p>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th>S/N</th>
                  <th>Subjects</th>
                </tr>
              </thead>
              <tbody>
                {subjectList?.map((obj, index) => (
                  <tr key={index} className="content-style">
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        name="subject_name"
                        value={obj?.name}
                        onChange={(e) => {
                          setSubjectList((prev) => {
                            prev[index].name = e.target.value;
                            return [...prev];
                          });
                        }}
                        id=""
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="setting-action-buttons">
            <CustomSmallButton
              text={"Add Subject"}
              icon={<PiPlusCircleBold className="use-font-style" />}
              disabled={!inLatestSession ? true : false}
              runFunction={() =>
                setSubjectList([
                  ...subjectList,
                  {
                    id: "new",
                    name: "",
                  },
                ])
              }
            />
            <CustomSmallButton
              text={loading.subject ? <Loading /> : `Update Subjects`}
              disabled={!inLatestSession ? true : loading.subject}
              runFunction={() =>
                handleSettings(
                  { subject: subjectList, term_id: termId },
                  "subject",
                )
              }
              icon={
                !loading.subject && (
                  <PiCheckCircleBold className="use-font-style" />
                )
              }
            />
          </div>
        </div>
        <div className="setting-card">
          <ContentTitle title={"Result Type"} />
          <p>
            Customize your result by adding a cumulative sore column. This
            column represents the average score per subject across all terms.{" "}
          </p>
          <div className="result-type">
            <CustomSelectionInput
              options={[
                { label: "Result with commulative score column", value: true },
                {
                  label: "Result without commulative score column",
                  value: false,
                },
              ]}
              value={resultType}
              handleChange={(e) => setResultType(e.target.value)}
              placeholder={"Result type"}
            />
            <CustomSmallButton
              text={loading.result ? <Loading /> : `Update`}
              disabled={!inLatestSession ? true : loading.result}
              runFunction={() => {
                handleSettings(
                  {
                    result: "result",
                    resultType:
                      resultType === "true"
                        ? true
                        : resultType === "false"
                          ? false
                          : resultType,
                    term_id: termId,
                  },
                  "result",
                );
              }}
              icon={
                !loading.result && (
                  <PiCheckCircleBold className="use-font-style" />
                )
              }
            />
          </div>
        </div>
        <div className="setting-card">
          <ContentTitle title={"Document Color Settings"} />
          <p>
            Customize the color themes for your school's report card, school
            bill, and receipt.
          </p>
          <ColorPicker
            setSchoolColor={setSchoolColor}
            schoolColor={schoolColor}
          />
          <CustomSmallButton
            text={loading.schoolColor ? <Loading /> : `Update Colors`}
            disabled={loading.schoolColor}
            runFunction={() => {
              handleSettings(
                { schoolColor: schoolColor, term_id: termId },
                "schoolColor",
              );
            }}
            icon={
              !loading.schoolColor && (
                <PiCheckCircleBold className="use-font-style" />
              )
            }
          />
        </div>
      </div>
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
      <BillModal
        isVisible={isBillModalVisible}
        onClose={handleCloseBillModal}
        index={billIndex}
        handleUpdateBill={handleUpdateBill}
        edit={edit}
        billIndex={billIndex}
        billObj={bill}
      />
      <FeatureLockModal
        isLocked={hasAccess(1)}
        message="You dont have an active subscription or your subscription have expired, please subscribe to a new plan."
      />
    </div>
  ) : (
    <FeatureLockModal
      isLocked={hasAccess(1)}
      message="You dont have an active subscription or your subscription have expired, please subscribe to a new plan."
    />
  );
};

export default Settings;
