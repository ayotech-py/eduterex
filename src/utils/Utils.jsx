import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import imageCompression from "browser-image-compression";
import { pdf } from "@react-pdf/renderer";
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from "date-fns";
import sha256 from "crypto-js/sha256";
import {
  FaFileAlt,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import mammoth from "mammoth";
import pdfToText from "react-pdftotext";

import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export const getMonthsBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];

  // Validate that the end date is after the start date
  if (end < start) {
    return "End date must be after start date";
  }

  // Loop through the months between the start and end dates
  while (start <= end) {
    // Get the month name and push it to the array
    months.push(start.toLocaleString("default", { month: "long" }));
    // Move to the next month
    start.setMonth(start.getMonth() + 1);
  }

  return months;
};

export const getMonthsWeeksDays = (start_date, end_date) => {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (isNaN(startDate) || isNaN(endDate) || endDate < startDate) {
    console.error("Invalid date range");
    return [];
  }

  const result = [];

  // Helper to format dates as "DD/MM"
  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Get the current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString("default", { month: "long" });

    const month = {
      name: `${monthName} ${currentYear}`,
      weeks: [],
    };

    while (currentDate.getMonth() === currentMonth && currentDate <= endDate) {
      const week = [];

      // Fill Monday to Friday of the current week
      for (
        let i = 0;
        i < 7 &&
        currentDate.getMonth() === currentMonth &&
        currentDate <= endDate;
        i++
      ) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          week.push(formatDate(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      if (week.length > 0) {
        month.weeks.push(week);
      }
    }

    result.push(month);

    // Move to the first day of the next month if necessary
    if (currentDate.getMonth() !== currentMonth) {
      currentDate = new Date(currentYear, currentMonth + 1, 1);
    }
  }

  return result;
};

export const formatDate = (datetimeStr) => {
  // Parse the datetime string into a Date object
  const date = new Date(datetimeStr);

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the day, month, and year
  const day = date.getUTCDate();
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  // Format the date as '11 Feb 2022'
  return `${day} ${month} ${year}`;
};

export const generatePDF = (printId, saveAs) => {
  const element = document.getElementById(printId);

  const images = element.querySelectorAll("img");

  Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete)
            resolve(); // If already loaded
          else img.onload = resolve; // Wait for image to load
        }),
    ),
  )
    .then(() => {
      return html2canvas(element, {
        scale: 3, // Higher scale for better resolution
        useCORS: true, // To handle cross-origin images
      });
    })
    .then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const margin = 10; // Margin in mm

      const contentWidth = canvas.width;
      const contentHeight = canvas.height;

      // Calculate scale factor to fit content into A4 size
      const scaleFactor = Math.min(
        (pdfWidth - margin * 2) / contentWidth,
        (pdfHeight - margin * 2) / contentHeight,
      );

      const scaledWidth = contentWidth * scaleFactor;
      const scaledHeight = contentHeight * scaleFactor;

      // Center the content in the PDF
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = (pdfHeight - scaledHeight) / 2;

      if (scaledHeight <= pdfHeight - margin * 2) {
        // If content fits within a single page
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          xOffset,
          yOffset,
          scaledWidth,
          scaledHeight,
        );
      } else {
        // For multi-page content
        const pageHeightInPixels = (pdfHeight - margin * 2) / scaleFactor; // Page height in pixels
        let remainingHeight = contentHeight;

        while (remainingHeight > 0) {
          const pdfCanvas = document.createElement("canvas");
          pdfCanvas.width = contentWidth;
          pdfCanvas.height = Math.min(pageHeightInPixels, remainingHeight);

          const ctx = pdfCanvas.getContext("2d");

          ctx.drawImage(
            canvas,
            0,
            contentHeight - remainingHeight,
            contentWidth,
            Math.min(pageHeightInPixels, remainingHeight),
            0,
            0,
            contentWidth,
            pdfCanvas.height,
          );

          const pageImgData = pdfCanvas.toDataURL("image/jpeg", 1.0);

          pdf.addImage(
            pageImgData,
            "JPEG",
            margin,
            margin,
            scaledWidth,
            (pdfCanvas.height * scaledWidth) / contentWidth,
          );

          remainingHeight -= pageHeightInPixels;

          if (remainingHeight > 0) pdf.addPage();
        }
      }

      pdf.save(saveAs);
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });
};

export const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function generateWeeklyDetails(start_date, end_date, no_of_days = 5) {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const result = [];
  let currentWeek = [];
  let currentWeekNumber = 1;

  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const dayOfWeek = currentDate.getDay();

    // Add all days if no_of_days is 7, otherwise include Monday to specified day
    if (
      (no_of_days === 7 && dayOfWeek >= 0 && dayOfWeek <= 6) ||
      (no_of_days < 7 && dayOfWeek >= 1 && dayOfWeek <= no_of_days)
    ) {
      currentWeek.push(currentDate.toISOString().split("T")[0]);
    }

    // Check if it's the last day of the week or the end date
    if (
      (no_of_days === 7 && dayOfWeek === 6) ||
      (no_of_days < 7 && dayOfWeek === no_of_days) ||
      currentDate.getTime() === endDate.getTime()
    ) {
      if (currentWeek.length > 0) {
        result.push({
          name: `Week ${currentWeekNumber}`,
          days_in_weeks: currentWeek,
        });
        currentWeek = [];
        currentWeekNumber++;
      }
    }
  }

  return result;
}

export const generateMonthlyDetails = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];

  while (start <= end) {
    const startOfCurrentMonth = startOfMonth(start);
    const endOfCurrentMonth = endOfMonth(startOfCurrentMonth);

    months.push({
      name: format(startOfCurrentMonth, "MMMM yyyy"), // e.g., "January 2024"
      days_in_month: eachDayOfInterval({
        start: startOfCurrentMonth,
        end: endOfCurrentMonth,
      }).map((date) => format(date, "yyyy-MM-dd")), // Dates in 'yyyy-MM-dd' format
    });

    // Move to the next month
    start.setMonth(start.getMonth() + 1);
  }

  return months;
};

export const compressImage = async (image) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(image, options);
  return compressedFile;
};

export const downloadPDF = async (doc, filename) => {
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const compareOTP = (inputOTP, hashedOTP) => {
  return sha256(inputOTP).toString() === hashedOTP;
};

const waivers = ["Scholarship", "Discount", "Grants", "Others"];

export function transformTuitionData(allTuition) {
  let resultMap = new Map();
  let numColumns = allTuition.length + 2; // Extra column for total
  let grandTotal = new Array(numColumns).fill(0);
  grandTotal[0] = "Grand Total";

  // Process each tuition object
  allTuition.forEach((tuition, index) => {
    tuition.bills.forEach(({ billName, billAmount }) => {
      let formattedAmount = parseFloat(
        waivers.includes(billName) ? allTuition[index].waiver : billAmount,
      ); // Convert to decimal

      if (
        !resultMap.has(
          waivers.includes(billName) ? `${billName} ${billAmount}%` : billName,
        )
      ) {
        resultMap.set(billName, new Array(numColumns).fill(0));
        resultMap.get(billName)[0] = waivers.includes(billName)
          ? `${billName} ${billAmount}%`
          : billName;
      }

      resultMap.get(billName)[index + 1] = formattedAmount;
    });
  });

  // Compute total for each row
  resultMap.forEach((row) => {
    row[row.length - 1] = row.slice(1, -1).reduce((a, b) => {
      if (waivers.includes(row[0].split(" ")[0])) {
        const total_waiver = allTuition.reduce(
          (sum, tuition) => sum + parseInt(tuition?.waiver),
          0,
        );
        return total_waiver;
      } else {
        return a + b;
      }
    });
  });

  // Compute grand total for each column
  for (let i = 1; i < numColumns; i++) {
    grandTotal[i] = [...resultMap.values()].reduce(
      (sum, row) =>
        waivers.includes(row[0].split(" ")[0]) ? sum : sum + row[i],
      0,
    );
    grandTotal[i] =
      i > 1 && i < numColumns - 1
        ? grandTotal[i] - allTuition[i - 1]?.waiver
        : i === numColumns - 1
          ? grandTotal[i] -
            allTuition.reduce(
              (sum, tuition) => sum + parseInt(tuition.waiver),
              0,
            )
          : grandTotal[i];
  }

  return [...resultMap.values(), grandTotal];
}

export const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export function numberToOrdinalWord(num) {
  const ordinalWords = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth",
    5: "Fifth",
    6: "Sixth",
    7: "Seventh",
    8: "Eighth",
    9: "Ninth",
    10: "Tenth",
    11: "Eleventh",
    12: "Twelfth",
    13: "Thirteenth",
    14: "Fourteenth",
    15: "Fifteenth",
    16: "Sixteenth",
    17: "Seventeenth",
    18: "Eighteenth",
    19: "Nineteenth",
    20: "Twentieth",
    30: "Thirtieth",
    40: "Fortieth",
    50: "Fiftieth",
    60: "Sixtieth",
    70: "Seventieth",
    80: "Eightieth",
    90: "Ninetieth",
  };

  if (ordinalWords[num]) {
    return ordinalWords[num];
  }

  let tens = Math.floor(num / 10) * 10; // Extract the tens place (e.g., 42 → 40)
  let ones = num % 10; // Extract the ones place (e.g., 42 → 2)

  if (tens >= 20 && ones > 0) {
    return `${ordinalWords[tens].replace("y", "ie")}-${ordinalWords[ones].toLowerCase()}`;
  }

  return "Number out of range"; // Modify if you need higher numbers
}

export function isDueDateValid(due_date, time) {
  // Combine the date and time into a single string
  const dueDateTimeString = `${due_date}T${time}Z`;

  // Convert to Date object
  const dueDateTime = new Date(dueDateTimeString);

  dueDateTime.setHours(dueDateTime.getHours() - 1);

  // Get the current time
  const now = new Date();

  // Compare due date with the current time
  return dueDateTime > now;
}

export function convertToAMPM(time) {
  if (!time) return null;
  let [hour, minute, second] = time.split(":").map(Number);

  let period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export const getFileIcon = (file) => {
  if (!file) return null;
  const fileType = file.type || file.file_type;
  if (fileType.includes("pdf")) return <FaFilePdf className="file-icon pdf" />;
  if (fileType.includes("word"))
    return <FaFileWord className="file-icon word" />;
  if (fileType.includes("powerpoint"))
    return <FaFilePowerpoint className="file-icon ppt" />;
  return <FaFileAlt className="file-icon generic" />;
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export const allowedTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
];

export const allowedImageTypes = ["image/jpeg", "image/png"];

export const checkImageType = (e, setProfileImage, setMessage = null) => {
  const uploaded_file = e.target.files[0];
  if (!allowedImageTypes.includes(uploaded_file.type)) {
    setProfileImage(null);
    if (setMessage) {
      setMessage("Only PNG or JPEG images are allowed.");
    }
    return;
  }
};

// This function takes a URL to a PDF or DOCX file, downloads it, and extracts plain text
/* export async function extractTextFromFileUrl(fileUrl) {
  // Determine the file extension (PDF or DOCX)
  const fileExt = fileUrl.split("?")[0].split(".").pop().toLowerCase();

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Handle PDF files
    if (fileExt === "pdf") {
      return await extractTextFromPDF(blob);
    }
    // Handle DOCX files (you would need a different function to handle this)
    else if (fileExt === "docx") {
      return await extractTextFromDocx(blob);
    } else {
      throw new Error("Unsupported file format");
    }
  } catch (error) {
    throw error;
  }
} */

export async function extractTextFromFileUrl(fileUrl) {
  // Determine the file extension (PDF or DOCX)
  const fileExt = fileUrl.split("?")[0].split(".").pop().toLowerCase();

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    if (fileExt === "pdf") {
      const blob = await response.blob(); // ✅ only read once
      return await extractTextFromPDF(blob); // Your own PDF handler
    } else if (fileExt === "docx") {
      const arrayBuffer = await response.arrayBuffer(); // ✅ only read once
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else {
      throw new Error("Unsupported file format");
    }
  } catch (error) {
    throw error;
  }
}

// Function to extract text from PDF
async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      pdfToText(file)
        .then((text) => resolve(text)) // Successfully extracted text
        .catch((err) => reject("Error extracting text from PDF: " + err)); // If extraction fails
    };

    reader.onerror = function () {
      reject("Error reading file");
    };

    // Read the PDF file as an ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
}

async function extractTextFromDocx(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export const getPageCount = async (file) => {
  const name = file.name.toLowerCase();

  if (file.type === "application/pdf") {
    return await getPDFPageCount(file);
  } else if (name.endsWith(".docx")) {
    return await getDocxPageCount(file);
  } else if (name.endsWith(".pptx")) {
    return await getPptxSlideCount(file);
  } else {
    return null;
  }
};

async function getPDFPageCount(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function () {
      try {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        resolve(pdf.numPages);
      } catch (error) {
        reject("Error getting PDF page count: " + error);
      }
    };

    reader.onerror = function () {
      reject("Error reading file");
    };

    reader.readAsArrayBuffer(file);
  });
}

const getDocxPageCount = async (file) => {
  const zip = await JSZip.loadAsync(file);
  const appXml = await zip.file("docProps/app.xml")?.async("string");
  if (!appXml) return null;

  const match = appXml.match(/<Pages>(\d+)<\/Pages>/);
  return match ? parseInt(match[1], 10) : null;
};

const getPptxSlideCount = async (file) => {
  const zip = await JSZip.loadAsync(file);
  const slideFiles = Object.keys(zip.files).filter((name) =>
    name.match(/^ppt\/slides\/slide\d+\.xml$/),
  );
  return slideFiles.length;
};

export function formatDateWithOrdinal(date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const ordinal = getOrdinalSuffix(day);

  return `${weekday}, ${month} ${day}${ordinal}, ${year}`;
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
