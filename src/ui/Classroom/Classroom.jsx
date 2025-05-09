import React, { useEffect, useState } from "react";
import "./Classroom.css";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import {
  PiArrowCircleDownBold,
  PiArrowCircleLeft,
  PiArrowCircleUpBold,
  PiArrowDownBold,
  PiArrowUpBold,
  PiCheckCircleBold,
  PiPlusCircleBold,
} from "react-icons/pi";
import CreateSchemeModal from "../../components/modals/CreateSchemeModal";
import { formatDate, generateWeeklyDetails } from "../../utils/Utils";
import { useSchool } from "../../context/SchoolContext";
import NoRecord from "../../components/NoRecord";
import { BsTrash, BsTrash2Fill, BsTrash3 } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import {
  CreateScheme,
  DeleteLesson,
  DeleteScheme,
} from "../../services/schoolService";
import Loading from "../../utils/Loader";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import LessonNotesCard from "../../components/LessonNotesCard/LessonNotesCard";
import FileUploadModal from "../../components/modals/FileUploadModal/FileUploadModal";
import AlertOptionModal from "../../components/modals/AlertModal/AlertOptionModal";
import ViewFile from "../../components/modals/ViewFileModal";
import ImportNotesModal from "../../components/modals/ImportNotesModal/ImportNotesModal";
import { useAuth } from "../../context/AuthContext";

const Classroom = ({ subject, class_id, role }) => {
  const {
    schoolState,
    setSchoolDatas,
    sessionId,
    termId,
    updateSchoolStateById,
  } = useSchool();
  const { schoolSession, schoolLessonPlan } = schoolState;
  const { authState } = useAuth();
  const { user } = authState;

  const [isSchemeModalVisible, setIsSchemeModalVisible] = useState(false);
  const handleOpenSchemeModal = () => setIsSchemeModalVisible(true);
  const handleCloseSchemeModal = () => setIsSchemeModalVisible(false);

  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const handleOpenLessonModal = () => setIsLessonModalVisible(true);
  const handleCloseLessonModal = () => setIsLessonModalVisible(false);

  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const handleOpenOptionModal = () => setIsOptionModalVisible(true);
  const handleCloseOptionModal = () => setIsOptionModalVisible(false);

  const [isLDeleteModalVisible, setIsLDeleteModalVisible] = useState(false);
  const handleOpenLDeleteModal = () => setIsLDeleteModalVisible(true);
  const handleCloseLDeleteModal = () => setIsLDeleteModalVisible(false);

  const [isViewFileModalVisible, setIsViewFileModalVisible] = useState(false);
  const handleOpenViewFileModal = () => setIsViewFileModalVisible(true);
  const handleCloseViewFileModal = () => setIsViewFileModalVisible(false);

  const [isImportlessonModalVisible, setIsImportlessonModalVisible] =
    useState(false);
  const handleOpenImportlessonModal = () => setIsImportlessonModalVisible(true);
  const handleCloseImportlessonModal = () =>
    setIsImportlessonModalVisible(false);

  const [weekArray, setWeekArray] = useState([]);
  const [lessonPlan, setLessonPlan] = useState([]);
  const [lessonPlanId, setLessonPlanId] = useState(null);

  const [selectedSyllabus, setSelectedSyllabus] = useState(0);
  const [schemeEdit, setSyllabusEdit] = useState(false);
  const [syllabusEditIndex, setSyllabusEditIndex] = useState(null);
  const [syllabusDeleteId, setSyllabusDeleteId] = useState(null);

  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const [lessonId, setLessonId] = useState(null);

  const [tab, setTab] = useState("scheme");

  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const session = schoolSession.find((obj) => obj.id === sessionId);
    const term = session?.terms.find((obj) => obj.id === termId);
    const week_array = generateWeeklyDetails(term?.start_date, term?.end_date);
    setWeekArray(week_array);
  }, [schoolSession, sessionId, termId]);

  const [loading, setLoading] = useState({
    schemeLoading: false,
    deleteSchemeLoading: false,
    deleteLessonLoading: false,
  });

  const handleDeleteSyllabus = (index) => {
    const updatedLessonPlan = lessonPlan.filter((_, i) => i !== index);
    setLessonPlan(updatedLessonPlan);
  };

  const handleSubmitScheme = async () => {
    const body = {
      session_id: sessionId,
      term_id: termId,
      subject_id: subject.id,
      class_id: class_id,
      content: lessonPlan,
    };

    setLoading((prev) => ({ ...prev, schemeLoading: true }));

    try {
      const response = await CreateScheme(body);
      setLoading((prev) => ({ ...prev, schemeLoading: false }));

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, schemeLoading: false }));
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  const deleteScheme = async (id) => {
    setLoading((prev) => ({ ...prev, deleteSchemeLoading: true }));

    try {
      const response = await DeleteScheme(id);
      setLoading((prev) => ({ ...prev, deleteSchemeLoading: false }));

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        handleCloseLDeleteModal();
        setSelectedSyllabus(0);
        setMessage(response.message);
        setSuccessStatus(true);
        setDeleteLessonID(null);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      console.error(error);
      setLoading((prev) => ({ ...prev, deleteSchemeLoading: false }));
      setMessage(error);
      handleCloseLDeleteModal();
      setSuccessStatus(false);
    }
  };

  const deleteLesson = async (id) => {
    setLoading((prev) => ({ ...prev, deleteLessonLoading: true }));

    try {
      const response = await DeleteLesson(
        id,
        lessonPlan[selectedSyllabus].id,
        lessonPlanId,
      );
      setLoading((prev) => ({ ...prev, deleteLessonLoading: false }));

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        handleCloseOptionModal();
        setLessonId(null);
        setMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        handleCloseOptionModal();
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, deleteLessonLoading: false }));
      handleCloseOptionModal();
      setMessage(error);
      setSuccessStatus(false);
    }
  };

  useEffect(() => {
    if (role === "Student") {
      const lesson_plan = schoolLessonPlan.find(
        (obj) => obj?.subject === subject?.id,
      );
      setLessonPlan(lesson_plan?.weekly_syllabus || []);
      setLessonPlanId(lesson_plan?.id);
    } else {
      const lesson_plan = schoolLessonPlan.find(
        (obj) =>
          obj?.term === termId &&
          obj?.classes === class_id &&
          obj?.subject === subject?.id,
      );
      setLessonPlan(lesson_plan?.weekly_syllabus || []);
      setLessonPlanId(lesson_plan?.id);
    }
  }, [termId, class_id, subject, schoolLessonPlan]);

  const getLessonDetails = (id) => {
    return lessonPlan[selectedSyllabus]?.lesson_notes?.find(
      (obj) => obj.id === id,
    );
  };

  const [deleteLessonID, setDeleteLessonID] = useState(null);

  useEffect(() => {
    if (deleteLessonID) {
      handleOpenLDeleteModal();
    }
  }, [deleteLessonID]);

  const getLessonToDeleteDetails = (id) => {
    return lessonPlan.find((obj) => obj.id === id);
  };

  useEffect(() => {
    if (fileUrl) {
      handleOpenViewFileModal();
    }
  }, [fileUrl]);

  const handleCloseViewFile = () => {
    setFileUrl(null);
    handleCloseViewFileModal();
  };

  return (
    <div className="ui-classroom">
      <div
        className={`classroom-div scheme-of-work ${tab === "scheme" ? "show-in-mobile" : "hide-in-mobile"}`}
      >
        <div className="ui-classroom-heading no-width">
          <h3>Lesson Plan</h3>
          {role !== "Student" && (
            <CustomSmallButton
              text={"Add"}
              icon={<PiPlusCircleBold className="use-font-style" />}
              runFunction={handleOpenSchemeModal}
            />
          )}
        </div>
        <div className="ui-classroom-content overflow">
          {lessonPlan?.length > 0 ? (
            lessonPlan?.map((obj, index) => (
              <div
                className={
                  selectedSyllabus === index
                    ? "scheme-list scheme-selected"
                    : "scheme-list"
                }
                key={index}
              >
                <div
                  onClick={() => {
                    setSelectedSyllabus(index);
                    setTab("lesson");
                  }}
                  className="ui-list-card-content"
                >
                  <p>
                    <span>{obj.week}</span>
                  </p>
                  <p style={{ fontSize: "13px", marginTop: "2px" }}>
                    <span>Title:</span> {obj.title}
                  </p>
                </div>
                {role !== "Student" && (
                  <div className="scheme-list-action">
                    <BiEdit
                      onClick={() => {
                        setSelectedSyllabus(index);
                        setSyllabusEdit(true);
                        setSyllabusEditIndex(index);
                        handleOpenSchemeModal();
                      }}
                      className="action-icon"
                    />

                    <BsTrash3
                      onClick={() => {
                        setSyllabusDeleteId(index);
                        if (obj.id) {
                          setDeleteLessonID(obj.id);
                        } else {
                          handleDeleteSyllabus(index);
                        }
                      }}
                      className="action-icon"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <NoRecord message={"No lesson plan has been created yet."} />
          )}
        </div>
        {role !== "Student" && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CustomSmallButton
              text={loading.schemeLoading ? <Loading /> : "Update"}
              icon={
                !loading.schemeLoading && (
                  <PiCheckCircleBold className="use-font-style" />
                )
              }
              runFunction={handleSubmitScheme}
              disabled={!lessonPlan.length > 0 || loading.schemeLoading}
            />
          </div>
        )}
      </div>
      {lessonPlan ? (
        <div
          className={`classroom-div lessons overflow ${tab === "lesson" ? "show-in-mobile" : "hide-in-mobile"}`}
        >
          <div className="ui-classroom-heading no-width">
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <PiArrowCircleLeft
                className="mobile-ui-show"
                onClick={() => setTab("scheme")}
                style={{
                  fontSize: "25px",
                  padding: "5px 5px 5px 0px",
                  color: "#711a75",
                }}
              />
              <h3>
                {lessonPlan[selectedSyllabus]?.week?.split(":")[0] ?? ""} Lesson
                Notes
              </h3>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {role !== "Student" &&
                user.school.subscription.features.includes(11) && (
                  <div>
                    <div className="hide-in-mobile">
                      <CustomSmallButton
                        text={"Import"}
                        icon={
                          <PiArrowCircleDownBold className="use-font-style" />
                        }
                        runFunction={handleOpenImportlessonModal}
                        disabled={
                          lessonPlan[selectedSyllabus]?.id ? false : true
                        }
                      />
                    </div>
                    <button
                      style={{ border: "none" }}
                      className="standalone-action-button mobile-ui-show"
                      onClick={handleOpenImportlessonModal}
                    >
                      <PiArrowDownBold className="use-font-style" />
                    </button>
                  </div>
                )}
              {role !== "Student" && (
                <div>
                  <div className="hide-in-mobile">
                    <CustomSmallButton
                      text={"Upload"}
                      icon={<PiArrowCircleUpBold className="use-font-style" />}
                      runFunction={handleOpenLessonModal}
                    />
                  </div>
                  <button
                    style={{ border: "none" }}
                    className="standalone-action-button mobile-ui-show"
                    onClick={handleOpenLessonModal}
                  >
                    <PiArrowUpBold className="use-font-style" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="ui-subheading">
            <p>
              <span>Title: </span>
              {lessonPlan[selectedSyllabus]?.title ?? ""}
            </p>
            <p>
              <span>Description: </span>
              {lessonPlan[selectedSyllabus]?.description ?? ""}
            </p>
          </div>
          {lessonPlan[selectedSyllabus]?.lesson_notes?.length > 0 ? (
            <div className="ui-classroom-content overflow">
              {lessonPlan[selectedSyllabus]?.lesson_notes?.map((obj) => (
                <LessonNotesCard
                  data={obj}
                  setLessonId={setLessonId}
                  openDeleteModal={handleOpenOptionModal}
                  role={role}
                  handleOpenViewFileModal={handleOpenViewFileModal}
                  setFileUrl={setFileUrl}
                />
              ))}
            </div>
          ) : (
            <NoRecord message={"No lesson note has been uploaded yet."} />
          )}
        </div>
      ) : (
        <div
          className={`classroom-div lessons ${tab === "lesson" ? "show-in-mobile" : "hide-in-mobile"}`}
        >
          <NoRecord message={"No lesson note has been uploaded yet."} />
        </div>
      )}
      <CreateSchemeModal
        isVisible={isSchemeModalVisible}
        onClose={handleCloseSchemeModal}
        weeks={weekArray?.map(
          (obj) =>
            `${obj?.name}: ${formatDate(obj?.days_in_weeks[0])} - ${formatDate(obj?.days_in_weeks.at(-1))}`,
        )}
        lessonPlan={lessonPlan}
        setLessonPlan={setLessonPlan}
        edit={schemeEdit}
        editIndex={syllabusEditIndex}
        data={schemeEdit ? lessonPlan[syllabusEditIndex] : {}}
        setSyllabusEditIndex={setSyllabusEditIndex}
        setSyllabusEdit={setSyllabusEdit}
      />
      <FileUploadModal
        isVisible={isLessonModalVisible}
        onClose={handleCloseLessonModal}
        data={{
          syllabus_id: lessonPlan ? lessonPlan[selectedSyllabus]?.id : null,
          lesson_plan_id: lessonPlanId,
        }}
        setSchoolDatas={setSchoolDatas}
        updateSchoolStateById={updateSchoolStateById}
      />
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
      {deleteLessonID && role !== "Student" && (
        <AlertOptionModal
          isVisible={isLDeleteModalVisible}
          onClose={() => {
            handleCloseLDeleteModal();
            setDeleteLessonID(null);
          }}
          message={`Are you sure you want to delete ${getLessonToDeleteDetails(deleteLessonID)?.title}? This can't be undone.`}
          runFunction={() =>
            deleteScheme(getLessonToDeleteDetails(deleteLessonID)?.id)
          }
          loading={loading.deleteSchemeLoading}
        />
      )}
      {lessonPlan && (
        <AlertOptionModal
          isVisible={isOptionModalVisible}
          onClose={handleCloseOptionModal}
          message={`Are you sure you want to delete ${getLessonDetails(lessonId)?.file_upload.name}? This can't be undone.`}
          runFunction={() => deleteLesson(getLessonDetails(lessonId)?.id)}
          loading={loading.deleteLessonLoading}
        />
      )}
      <ViewFile
        isVisible={isViewFileModalVisible}
        onClose={handleCloseViewFile}
        fileUrl={fileUrl}
      />
      <ImportNotesModal
        isVisible={isImportlessonModalVisible}
        onClose={handleCloseImportlessonModal}
        lesson_plan={lessonPlanId}
        syllabus={lessonPlan[selectedSyllabus]?.id}
        setSuccessStatus={setSuccessStatus}
        setModalMessage={setMessage}
      />
    </div>
  );
};

export default Classroom;
