import React, { useEffect, useState } from "react";
import "./ImportNotesModal.css";
import "../AddStaffModal/AddStaffModal.css";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AlertBadge } from "../../AlertBadge";
import { MdClose } from "react-icons/md";
import Loading from "../../../utils/Loader";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { PiArrowCircleLeft, PiCheckCircleBold } from "react-icons/pi";
import NoRecord from "../../NoRecord";
import { GetLesson, importLessonNotes } from "../../../services/schoolService";
import { getFileIcon } from "../../../utils/Utils";
import { FiEye } from "react-icons/fi";
import { useSchool } from "../../../context/SchoolContext";
import { BiSearch } from "react-icons/bi";

const ImportNotesModal = ({
  isVisible,
  onClose,
  lesson_plan,
  syllabus,
  setSuccessStatus,
  setModalMessage,
}) => {
  const [tab, setTab] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState({
    importLoading: false,
    fetchLoading: false,
  });
  const { updateSchoolStateById } = useSchool();
  const [search, setSearch] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);
  const subjectList = [
    "Agricultural Science",
    "Basic Science",
    "Basic Technology",
    "Biology",
    "Business Studies",
    "C.C.A",
    "C.R.K",
    "Chemistry",
    "Civic Education",
    "Commerce",
    "Computer Science",
    "Creative Arts",
    "Economics",
    "English Language",
    "Financial Accounting",
    "Further Mathematics",
    "Geography",
    "Government",
    "Hand Writing",
    "Health Habit",
    "History",
    "Home Economics",
    "I.R.K",
    "Literacy",
    "Literature in English",
    "Mathematics",
    "Moral Instruction",
    "Numeracy",
    "Physical Health Education",
    "Physics",
    "Social Studies",
    "Yoruba",
  ];

  const classList = [
    "Nursery Section",
    "Primary Section",
    "Junior Secondary Section",
    "Senior Secondary Section",
  ];

  const [allLessonNotes, setAllLessonNotes] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [viewFile, setViewFile] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [fetchedLessonNotes, setFetchedLessonNotes] = useState([]);

  const getLesson = async () => {
    setLoading((prev) => ({ ...prev, fetchLoading: true }));

    try {
      const response = await GetLesson(selectedSubject, selectedSection);
      setLoading((prev) => ({ ...prev, fetchLoading: false }));
      setAllLessonNotes(response);
      setFetchedLessonNotes(response);
    } catch (error) {
      setLoading((prev) => ({ ...prev, fetchLoading: false }));
      setMessage(error);
    }
  };

  useEffect(() => {
    setSelectedSubject(subjectList[0]);
    setSelectedSection(classList[0]);
  }, []);

  useEffect(() => {
    const filteredLessonNotes = fetchedLessonNotes.filter((obj) =>
      obj.file_upload.name.toLowerCase().includes(search.toLowerCase()),
    );
    setAllLessonNotes([...filteredLessonNotes]);
  }, [search]);

  const WordViewer = ({ fileUrl }) => {
    const encodedUrl = encodeURIComponent(fileUrl);
    const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <iframe
          src={viewerUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Word Document Viewer"
          style={{
            border: "none",
            pointerEvents: "auto", // allow user to scroll
          }}
          onMouseDown={(e) => e.preventDefault()} // block drag to highlight
          onMouseMove={(e) => e.preventDefault()}
        />
        {/* This overlay blocks text selection and click, but scroll still works */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            height: "20px",
            width: "100px",
            zIndex: 10,
            backgroundColor: "transparent",
            cursor: "not-allowed",
            userSelect: "none",
          }}
          onMouseDown={(e) => e.preventDefault()} // block drag to highlight
          onMouseMove={(e) => e.preventDefault()}
        />
      </div>
    );
  };

  const importLessons = async () => {
    setLoading((prev) => ({ ...prev, importLoading: true }));
    const body = {
      selectedLessons: selectedLessons,
      lesson_plan_id: lesson_plan,
      syllabus_id: syllabus,
    };

    try {
      const response = await importLessonNotes(body);
      setLoading((prev) => ({ ...prev, importLoading: false }));

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        onClose();
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        onClose();
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setLoading((prev) => ({ ...prev, importLoading: false }));
      onClose();
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content import-questions"
        onClick={(e) => e.stopPropagation()}
      >
        <MdClose
          className="close-modal"
          onClick={() => {
            onClose();
            setMessage("");
            setTab(1);
          }}
        />
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Import Lesson Notes</h2>
        </div>
        <div className="modal-sub-container overflow">
          <div
            className={`import-lesson-type ${tab === 1 ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1px",
                width: "100%",
              }}
            >
              <p style={{ textAlign: "center", flex: 1, fontWeight: 600 }}>
                Start by selecting a subject and section to view available
                lesson notes..
              </p>
            </div>

            <CustomSelectionInput
              placeholder={"Select Subject"}
              name={"subject"}
              value={selectedSubject}
              handleChange={(e) => setSelectedSubject(e.target.value)}
              data={subjectList}
            />
            <CustomSelectionInput
              placeholder={"Select Class Category"}
              name={"class_section"}
              value={selectedSection}
              handleChange={(e) => setSelectedSection(e.target.value)}
              data={classList}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CustomSmallButton
                text={loading.fetchLoading ? <Loading /> : "Fetch Lesson Notes"}
                disabled={!selectedSubject || loading.fetchLoading}
                icon={
                  !loading.fetchLoading && (
                    <PiCheckCircleBold className="use-font-style" />
                  )
                }
                runFunction={getLesson}
              />
            </div>
            <div className="render-lessons">
              {fetchedLessonNotes.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <div className="search-container" style={{ width: "100%" }}>
                    <input
                      type="text"
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search lesson notes by topic or file type (e.g., Pollution, PDF)"
                    />
                    <BiSearch className="search-icon" />
                  </div>
                  {allLessonNotes.map((lesson, index) => (
                    <div className="file-preview" key={lesson.id}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          name={`file_selected`}
                          checked={selectedLessons.includes(lesson.id)}
                          onChange={(e) => {
                            if (selectedLessons.includes(lesson.id)) {
                              const updatedLessons = selectedLessons.filter(
                                (item) => item !== lesson.id,
                              );
                              setSelectedLessons([...updatedLessons]);
                            } else {
                              setSelectedLessons([
                                ...selectedLessons,
                                lesson.id,
                              ]);
                            }
                          }}
                        />
                        {getFileIcon(lesson.file_upload)}
                      </div>
                      <div
                        className="file-details"
                        style={{ width: "calc(100% - 110px)" }}
                      >
                        <h3>{lesson.file_upload.name}</h3>
                        <p>{(lesson.file_upload.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <FiEye
                        onClick={() => {
                          setViewFile(lesson.file_upload);
                          setTab(2);
                        }}
                        className="sc-action"
                        size={20}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <NoRecord message={"No record found"} />
              )}
            </div>
          </div>
          <div
            className={`lesson-note-preview ${tab === 2 ? "show-in-mobile" : "hide-in-mobile"}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <PiArrowCircleLeft
                className="mobile-ui-show"
                onClick={() => setTab(1)}
                style={{
                  fontSize: "25px",
                  padding: "5px 5px 5px 0px",
                  color: "#711a75",
                }}
              />
              <p style={{ textAlign: "center", flex: 1, fontWeight: 600 }}>
                Preview Lesson Notes
              </p>
            </div>
            <div className="view-lesson-div overflow">
              {viewFile ? (
                viewFile.file.includes(".doc") ||
                viewFile.file.includes(".ppt") ? (
                  <WordViewer fileUrl={viewFile.file} />
                ) : (
                  <iframe
                    src={viewFile.file}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="PDF Viewer"
                  ></iframe>
                )
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <NoRecord message={"Please select lesson note to preview"} />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* {message && <AlertBadge message={message} />} */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CustomSmallButton
            text={loading.importLoading ? <Loading /> : "import Lesson Notes"}
            disabled={loading.importLoading}
            icon={
              !loading.importLoading && (
                <PiCheckCircleBold className="use-font-style" />
              )
            }
            runFunction={() => importLessons()}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportNotesModal;
