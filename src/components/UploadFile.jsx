import React, { useState } from "react";
import axios from "axios";

const CLOUDINARY = process.env.REACT_APP_CLOUDINARY;

export const UploadFile = async (file, setProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY);
  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/eduterex/auto/upload",
    formData,
    {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      },
    },
  );
  return response;
};

export default UploadFile;
