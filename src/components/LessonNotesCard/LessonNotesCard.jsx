import React from "react";
import "./LessonNotesCard.css";
import {
  PiArrowCircleDownBold,
  PiEyeBold,
  PiMicrosoftWordLogoBold,
} from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";
import PDFIcon from "../../images/icons/pdf-icon.png";
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileAlt,
  FaUpload,
  FaYoutube,
} from "react-icons/fa";
import { formatDate, formatFileSize } from "../../utils/Utils";

const LessonNotesCard = ({
  data,
  setLessonId,
  openDeleteModal,
  role,
  handleOpenViewFileModal,
  setFileUrl,
}) => {
  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf"))
      return <FaFilePdf className="file-icon pdf" size={60} />;
    if (fileType.includes("word"))
      return <FaFileWord className="file-icon word" size={60} />;
    if (fileType.includes("presentation"))
      return <FaFilePowerpoint className="file-icon ppt" size={60} />;
    if (fileType.includes("video") || /mp4|mov|avi|mkv|webm/i.test(fileType))
      return <FaFileVideo className="file-icon video" size={60} />;
    if (fileType.includes("youtube") || fileType.includes("youtu.be"))
      return <FaYoutube className="file-icon youtube" size={60} />;
    return <FaFileAlt className="file-icon generic" size={60} />;
  };

  const getFileType = (fileType) => {
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("word")) return "DOCX";
    if (fileType.includes("presentation")) return "PPTX";
    if (fileType.includes("video") || /mp4|mov|avi|mkv|webm/i.test(fileType))
      return "VIDEO";
    if (fileType.includes("youtube")) return "YOUTUBE";
    return "FILE";
  };

  const getFileTypeBg = (fileType) => {
    if (fileType.includes("pdf")) return "pdf-banner-color";
    if (fileType.includes("word")) return "docx-banner-color";
    if (fileType.includes("presentation")) return "pptx-banner-color";
    if (fileType.includes("video") || /mp4|mov|avi|mkv|webm/i.test(fileType))
      return "video-banner-color";
    if (fileType.includes("youtube")) return "youtube-banner-color";

    return "file-banner-color";
  };

  const handleDelete = () => {
    setLessonId(data?.id);
    openDeleteModal();
  };

  const tag = () => {
    if (data.file_upload.file_type.includes("presentation")) return "slides";
    if (data.file_upload.file_type.includes("video")) return "";
    return "pages";
  };

  return (
    <div className="lsc-container">
      <div
        className={`lsc-banner ${getFileTypeBg(data.file_upload?.file_type)}`}
      >
        {getFileIcon(data.file_upload.file_type)}
      </div>
      <div className="lsc-content">
        <div className="lsc-title-heading">
          <p
            style={{
              fontWeight: 600,
              fontSize: "13px !important",
              textOverflow: "ellipsis",
              maxWidth: "240px",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {data.file_upload.name}{" "}
          </p>
          {data.file_upload?.file_type.includes("youtube") ? (
            <span>{getFileType(data.file_upload?.file_type)}</span>
          ) : (
            <span>
              {data.file_upload.page_count} {tag()} •{" "}
              {formatFileSize(data.file_upload.size)} •{" "}
              {getFileType(data.file_upload?.file_type)}
            </span>
          )}
        </div>
        <div className="actions">
          <a
            href={`${data.file_upload.file}`}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="action-icon">
              <PiArrowCircleDownBold /> Download
            </span>
          </a>

          {/* <a
            href={`${data.file_upload.file}`}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="action-icon">
              <PiEyeBold /> View
            </span>
          </a> */}

          <span
            className="action-icon"
            onClick={() => {
              setFileUrl(data.file_upload);
            }}
          >
            <PiEyeBold /> View
          </span>

          {role !== "Student" && (
            <span className="action-icon" onClick={handleDelete}>
              <BsTrash3 /> Delete
            </span>
          )}
        </div>
        <div className="lsc-helper-info">
          <p>{formatDate(data.created_at)}</p>
          <div className="lsc-staff-profile">
            <img src={`${data?.created_by?.passport}`} alt="staff" />
            <p>{data?.created_by?.full_name.split(" ")[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonNotesCard;
