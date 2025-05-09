import React, { useState, useEffect, useCallback } from "react";
import "./AddStaffModal/AddStaffModal.css";
import { MdClose } from "react-icons/md";

const ViewFile = ({ isVisible, onClose, fileUrl }) => {
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

  if (!isVisible) return null;

  return (
    <div className="modal-overlay view-file-container">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>{fileUrl.name}</h2>
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            onClose();
          }}
        />
        {fileUrl.file.includes(".doc") || fileUrl.file.includes(".ppt") ? (
          <WordViewer fileUrl={fileUrl.file} />
        ) : (
          <iframe
            src={fileUrl.file}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="PDF Viewer"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default ViewFile;
