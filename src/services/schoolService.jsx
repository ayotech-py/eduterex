import { apiHelper } from "../utils/apiHelper";

export const fetchSchoolConfig = async () => {
  const response = await apiHelper.get("school-config/");
  return response.data;
};

export const createSession = async (body) => {
  try {
    const response = await apiHelper.post("academic-session/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw (
        error.message || "An error occurred while creating academic session."
      );
    }
  }
};

export const promoteStudents = async (body) => {
  try {
    const response = await apiHelper.post("student-promotion/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while promoting students.";
    }
  }
};

export const createTerm = async (body) => {
  try {
    const response = await apiHelper.post("academic-term/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while creating academic term.";
    }
  }
};

export const updateTerm = async (body, id) => {
  try {
    const response = await apiHelper.put(`academic-term/${id}/`, body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while ending the term.";
    }
  }
};

export const registerStaff = async (body) => {
  try {
    const response = await apiHelper.post("staff-controller/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while registering staffs.";
    }
  }
};

export const updateStaff = async (body, id) => {
  try {
    const response = await apiHelper.put(`staff-controller/${id}/`, body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while updating staff.";
    }
  }
};

export const registerStudent = async (body) => {
  try {
    const response = await apiHelper.post("student-controller/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while registering students.";
    }
  }
};

export const updateStudent = async (body, id) => {
  try {
    const response = await apiHelper.put(`student-controller/${id}/`, body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while updating student record.";
    }
  }
};

export const markAttendance = async (body) => {
  try {
    const response = await apiHelper.post("attendance/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while submitting attendance.";
    }
  }
};

export const submitResult = async (body) => {
  try {
    const response = await apiHelper.post("result/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while submitting result.";
    }
  }
};

export const addTuitionFee = async (body) => {
  try {
    const response = await apiHelper.post("tuition-fee-payment/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while submitting result.";
    }
  }
};

export const activateSession = async (body) => {
  try {
    const response = await apiHelper.post("activate-session/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while activating session.";
    }
  }
};

export const approveResult = async (body) => {
  try {
    const response = await apiHelper.post("approve-result/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while approving result.";
    }
  }
};

export const updatedBill = async (body) => {
  try {
    const response = await apiHelper.post("update-bills/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while updating bill.";
    }
  }
};

export const settingsHandler = async (body) => {
  try {
    const response = await apiHelper.post("settings-handler/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while updating settings.";
    }
  }
};

export const updateStaffData = async (body) => {
  try {
    const response = await apiHelper.post("update-profile/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while updating profile.";
    }
  }
};

export const updatePassword = async (body) => {
  try {
    const response = await apiHelper.post("update-password/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while updating profile.";
    }
  }
};

export const verifyPayments = async (body) => {
  try {
    const response = await apiHelper.post("verify-payment/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while verifying payment.";
    }
  }
};

export const getSchool = async (school_name) => {
  try {
    const response = await apiHelper.get(
      `get-school/?school_name=${school_name}`,
    );
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while getting school.";
    }
  }
};

export const getSchoolBill = async (body) => {
  try {
    const response = await apiHelper.post("get-school-bill/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while generating school bill.";
    }
  }
};

export const sendMail = async (body) => {
  try {
    const response = await apiHelper.post("send-mail/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while sending mail.";
    }
  }
};

export const ResetPassword = async (body) => {
  try {
    const response = await apiHelper.post("reset-password/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred while resetting password.";
    }
  }
};

export const CreateScheme = async (body) => {
  try {
    const response = await apiHelper.post("create-scheme/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const DeleteScheme = async (id) => {
  try {
    const response = await apiHelper.delete(`create-scheme/?syllabus_id=${id}`);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const GetLesson = async (subject, section) => {
  try {
    const response = await apiHelper.get(
      `lesson-handler/?subject=${subject}&section=${section}`,
    );
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const CreateLesson = async (body) => {
  try {
    const response = await apiHelper.post("lesson-handler/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const DeleteLesson = async (id, ws_id, lp_id) => {
  try {
    const response = await apiHelper.delete(
      `lesson-handler/?lesson_id=${id}&weekly_syllabus_id=${ws_id}&lesson_plan_id=${lp_id}`,
    );
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const postQuestions = async (body) => {
  try {
    const response = await apiHelper.post("questions-handler/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const deleteQuestions = async (id) => {
  try {
    const response = await apiHelper.delete(
      `questions-handler/?question_id=${id}`,
    );
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const postAssignment = async (body) => {
  try {
    const response = await apiHelper.post("assignment-handler/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const deleteAssignment = async (id) => {
  try {
    const response = await apiHelper.delete(
      `assignment-handler/?assignment_id=${id}`,
    );
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const postAssignmentSubmission = async (body) => {
  try {
    const response = await apiHelper.post(
      "assignment-submission-handler/",
      body,
    );
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const updateAssignmentSubmission = async (body, id) => {
  try {
    const response = await apiHelper.put(
      `assignment-submission-handler/${id}/`,
      body,
    );
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const generateAIQuestions = async (body, id) => {
  try {
    const response = await apiHelper.get(`generate-mcqs/${id}/?q_type=${body}`);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const generateAIQuestionsExt = async (body) => {
  try {
    const response = await apiHelper.post(`generate-mcqs/`, body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const importLessonNotes = async (body) => {
  try {
    const response = await apiHelper.post("import-lesson-note/", body);
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};

export const advancedStudentAction = async (student_id, action) => {
  try {
    const response = await apiHelper.get(
      `advanced-student-action/?student_id=${student_id}&action=${action}`,
    );
    return response.data;
  } catch (error) {
    if (error.detail) {
      throw error;
    } else {
      throw error.message || "An error occurred.";
    }
  }
};
