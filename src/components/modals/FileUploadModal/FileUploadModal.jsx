import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileAlt,
  FaUpload,
  FaFileVideo,
} from "react-icons/fa";
import "./FileUploadModal.css";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import Loading from "../../../utils/Loader";
import { AlertBadge } from "../../AlertBadge";
import { CreateLesson } from "../../../services/schoolService";
import {
  allowedTypes,
  getPageCount,
  MAX_FILE_SIZE,
} from "../../../utils/Utils";
import { PiX } from "react-icons/pi";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import UploadFile from "../../UploadFile";

const FileUploadModal = ({
  isVisible,
  onClose,
  data,
  setSchoolDatas,
  updateSchoolStateById,
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [fileLink, setFileLink] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);

  let allowedLessons = [
    ...allowedTypes,
    "video/*",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const handleFileChange = (event) => {
    const uploaded_file = event.target.files[0];
    if (uploaded_file) {
      if (!allowedLessons.includes(uploaded_file.type)) {
        setFile(null);
        setMessage(
          "Only PDF, Word, Powerpoint, Video or image files are allowed.",
        );
        setSuccessStatus(false);
        return;
      }
      if (uploaded_file.size > MAX_FILE_SIZE) {
        setFile(null);
        setMessage("File size must be less than 10MB!");
        setSuccessStatus(false);
        return;
      }
      setFile(event.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async (id) => {
    if (uploadType === "file" && !file) {
      setMessage("Please select a file to upload.");
      setSuccessStatus(false);
      return;
    } else if (uploadType === "link" && !fileLink) {
      setMessage("Please insert a link to upload.");
      setSuccessStatus(false);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      if (uploadType === "file") {
        const file_type = file.type;
        const cloudinary_response = await UploadFile(file, setProgress);
        if (cloudinary_response.status !== 200) {
          setUploading(false);
          setMessage("Am error occured while uploading file.");
          return;
        }
        formData.append("file", cloudinary_response.data.secure_url);
        formData.append("file_name", file.name);
        formData.append("file_type", file_type);
        formData.append("file_size", file.size);
        formData.append("duration", cloudinary_response["duration"]);
        const page_count = await getPageCount(file);
        formData.append("page_count", page_count);
      } else if (uploadType === "link") {
        formData.append("fileLink", fileLink);
      } else {
        return;
      }
      formData.append("lesson_plan_id", data.lesson_plan_id);
      formData.append("syllabus_id", data?.syllabus_id);

      setMessage("");

      const response = await CreateLesson(formData);
      setProgress(0);
      setUploading(false);

      if (response.success) {
        updateSchoolStateById(response.schoolData);
        setMessage(response.message);
        setSuccessStatus(true);
        formData.set("file", "");
        setFile("");
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setUploading(false);
      setMessage("An error occurred while uploading file.");
      setSuccessStatus(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    const fileType = file.type;
    if (fileType.includes("pdf"))
      return <FaFilePdf className="file-icon pdf" />;
    if (fileType.includes("word"))
      return <FaFileWord className="file-icon word" />;
    if (fileType.includes("presentation"))
      return <FaFilePowerpoint className="file-icon ppt" />;
    if (fileType.includes("video") || /mp4|mov|avi|mkv|webm/i.test(fileType))
      return <FaFileVideo className="file-icon video" />;
    return <FaFileAlt className="file-icon generic" />;
  };

  const [uploadType, setUploadType] = useState("file");

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <MdClose
          className="close-modal"
          onClick={() => {
            setMessage("");
            setFile("");
            onClose();
          }}
        />
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Upload File</h2>
        </div>
        <div
          className="upload-container"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="upload-content-type">
            <p className="radio-item">
              <input
                type="radio"
                className="custom-radio"
                name="file"
                value={"file"}
                checked={uploadType === "file"}
                onChange={() => {
                  setFileLink(null);
                  setUploadType("file");
                }}
              />
              Upload from Device
            </p>
            <p className="radio-item">
              <input
                type="radio"
                className="custom-radio"
                name="link"
                value={"link"}
                checked={uploadType === "link"}
                onChange={() => {
                  setFile(null);
                  setUploadType("link");
                }}
              />
              Insert File Link
            </p>
          </div>
          {uploadType === "file" ? (
            file ? (
              <div className="file-preview">
                {getFileIcon()}
                <div className="file-details">
                  <h3>{file.name}</h3>
                  <p>{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <PiX
                  onClick={() => setFile(null)}
                  className="sc-action"
                  size={20}
                />
              </div>
            ) : (
              <div className="upload-container">
                <label className="file-input-label">
                  <FaUpload className="upload-icon" />
                  <span>Select File</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.pptx,image/*,video/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
                <p className="very-small-font-size">
                  <i>File must not exceed 10MB!</i>
                </p>
              </div>
            )
          ) : (
            <div style={{ width: "100%" }}>
              <CustomTextInput
                name={"link"}
                placeholder={"Insert File Link"}
                value={fileLink}
                handleChange={(e) => setFileLink(e.target.value)}
              />
            </div>
          )}
          <div>
            <CustomSmallButton
              text={
                uploading ? <span>Uploading... {progress}%</span> : "Upload"
              }
              runFunction={handleUpload}
              disabled={uploading}
            />
          </div>
          {message && <AlertBadge message={message} success={successStatus} />}
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
