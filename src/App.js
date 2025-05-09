import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Signin from "./pages/Signin/Signin";
import Registration from "./pages/Registration/Registration";
import StaffManager from "./pages/StaffManager/StaffManager";
import AcademicSession from "./pages/AcademicSession/AcademicSession";
import { AuthProvider } from "./context/AuthContext";
import StudentManager from "./pages/StudentManager/StudentManager";
import Attendance from "./pages/Attendance/Attendance";
import { SchoolProvider } from "./context/SchoolContext";
import ResultManager from "./pages/ResultManager/ResultManager";
import TuitionFeeManager from "./pages/TuitionFeeManager/TuitionFeeManager";
import SchoolAccountManager from "./pages/SchoolAccountManager/SchoolAccountManager";
import ViewResult from "./pages/ResultManager/ViewResult";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Subscription from "./pages/Subscription/Subscription";
import { useAuth } from "./context/AuthContext";
import NotAuthorized from "./pages/NotAuthorized/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage/LandingPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import { getSchool } from "./services/schoolService";
import SchoolNotFound from "./pages/SchoolNotFound/SchoolNotFound";
import Onboarding from "./pages/Onboarding/Onboarding";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import SchoolBillPage from "./pages/SchoolBillPage/SchoolBillPage";
import StudentResultPage from "./pages/StudentResultPage/StudentResultPage";
import PaymentsPage from "./pages/PaymentsPage/PaymentsPage";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import AlertModal from "./components/modals/AlertModal/AlertModal";
import { fetchData } from "./services/authService";
import { getUser, setUser } from "./utils/userHelper";
import { useSchool } from "./context/SchoolContext";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./pages/PrivacyPolicy/TermsAndConditions";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VirtualClassroom from "./pages/VirtualClassroom/VirtualClassroom";
import StudentVirtualClassroom from "./pages/StudentVirtualClassroom/StudentVirtualClassroom";
import ExamQuestionManager from "./pages/ExamQuestionManager/ExamQuestionManager";

function App() {
  const { authState, updateUser, logout } = useAuth();
  const { setSchoolDatas } = useSchool();
  const { user, loading } = authState;

  const routes = [
    {
      path: "/",
      element: user?.staff_id ? <AdminDashboard /> : <StudentDashboard />,
      roles: user?.staff_id
        ? ["Admin", "Principal", "Teacher", "Account Manager"]
        : ["Student"],
      tab: "Dashboard",
    },
    {
      path: "/academic-session",
      element: <AcademicSession />,
      roles: ["Admin", "Principal", "Account Manager"],
      tab: "Academic Session",
    },
    {
      path: "/registration",
      element: <Registration />,
      roles: ["Admin", "Principal"],
      tab: "Registration",
    },
    {
      path: "/staff-manager",
      element: <StaffManager />,
      roles: ["Admin", "Principal"],
      tab: "Staff Manager",
    },
    {
      path: "/student-manager",
      element: <StudentManager />,
      roles: ["Admin", "Principal", "Teacher"],
      tab: "Student Manager",
    },
    {
      path: "/attendance-manager",
      element: <Attendance />,
      roles: ["Admin", "Principal", "Teacher"],
      tab: "Attendance Manager",
    },
    {
      path: "/result-manager",
      element: <ResultManager />,
      roles: ["Admin", "Principal", "Teacher"],
      tab: "Result Manager",
    },
    {
      path: "/view-result",
      element: <ViewResult />,
      roles: ["Admin", "Principal", "Teacher"],
      tab: "Result Manager",
    },
    {
      path: "/tuition-fee-manager",
      element: <TuitionFeeManager />,
      roles: ["Admin", "Principal", "Account Manager"],
      tab: "Tuition Manager",
    },
    {
      path: "/account-manager",
      element: <SchoolAccountManager />,
      roles: ["Admin", "Principal", "Account Manager"],
      tab: "Account Manager",
    },
    {
      path: "/settings",
      element: <Settings />,
      roles: ["Admin", "Principal"],
      tab: "Settings",
    },
    {
      path: "/profile",
      element: <Profile />,
      roles: ["Admin", "Principal", "Teacher", "Student", "Account Manager"],
      tab: "Profile",
    },
    {
      path: "/dashboard",
      element: user?.staff_id ? <AdminDashboard /> : <StudentDashboard />,
      roles: user?.staff_id
        ? ["Admin", "Principal", "Teacher", "Account Manager"]
        : ["Student"],
      tab: "Dashboard",
    },
    {
      path: "/subscription",
      element: <Subscription />,
      roles: ["Admin", "Principal"],
      tab: "Subscription",
    },
    {
      path: "/school-bills",
      element: <SchoolBillPage />,
      roles: ["Student"],
      tab: "School Bill",
    },
    {
      path: "/results",
      element: <StudentResultPage />,
      roles: ["Student"],
      tab: "Result",
    },
    {
      path: "/payments",
      element: <PaymentsPage />,
      roles: ["Student"],
      tab: "Payment",
    },
    {
      path: "/cbt-quiz",
      element: <ComingSoon />,
      roles: ["Admin", "Principal", "Teacher", "Student"],
      tab: "CBT Quizzes",
    },
    {
      path: "/virtual-classroom",
      element: <VirtualClassroom />,
      roles: ["Admin", "Principal", "Teacher"],
      tab: "Virtual Classroom",
    },
    {
      path: "/virtual-class",
      element: <StudentVirtualClassroom />,
      roles: ["Student"],
      tab: "Virtual Classroom",
    },
    {
      path: "/exam-manager",
      element: <ExamQuestionManager />,
      roles: ["Admin", "Principal", "Teacher"],
      tab: "Exam Manager",
    },
  ];

  const [pageLoading, setPageLoading] = useState(true);
  //
  const hostname = window.location.hostname;
  const mainDomain = "localhost"; // e.g., eduterex.com.ng
  // Check if it's a subdomain

  const isSubdomain =
    hostname !== mainDomain &&
    hostname !== `www.${mainDomain}` &&
    hostname.endsWith(mainDomain);
  // Extract subdomain (handles multi-level subdomains too)
  const subdomain = isSubdomain
    ? hostname.replace(`.${mainDomain}`, "") // Removes ".eduterex.com.ng"
    : null;

  useEffect(() => {
    if (!isSubdomain) {
      setPageLoading(false);
    }
  }, [isSubdomain]);

  const [school, setSchool] = useState(null);

  const handleGetSchool = async () => {
    setPageLoading(true);

    try {
      const response = await getSchool(subdomain);

      if (response.name) {
        setSchool(response);
        const user = getUser();
        if (user) {
          handleFetchData();
        } else {
          setPageLoading(false);
        }
      }
    } catch (error) {
      setPageLoading(false);
      if (window.location.href.includes("school-not-found")) return;
      window.location.href = "/school-not-found";
    }
  };

  const handleFetchData = async () => {
    try {
      const response = await fetchData();
      setPageLoading(false);
      if (response.success) {
        updateUser(response.user);
        setSchoolDatas(response.schoolData);
      }
    } catch (error) {
      setPageLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
      logout();
    }
  };

  useEffect(() => {
    if (subdomain) {
      handleGetSchool();
    }
  }, [subdomain]);

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  /* useDisableDevTools();
  detectDevTools();
  disableConsoleLogs(); */

  if (pageLoading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      {!isSubdomain ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/school-not-found" element={<SchoolNotFound />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      ) : subdomain === "referral" ? (
        <Routes>
          <Route path="/auth/*">
            <Route path="signin" element={<Signin schoolData={school} />} />
            <Route
              path="forgot-password"
              element={<ForgotPassword schoolData={school} />}
            />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/auth/*">
            <Route path="signin" element={<Signin schoolData={school} />} />
            <Route
              path="forgot-password"
              element={<ForgotPassword schoolData={school} />}
            />
          </Route>
          {routes.map(({ path, element, roles, tab }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute roles={roles} userRole={user?.role}>
                  <Home children={element} activeTabName={tab ?? "Dashboard"} />
                </ProtectedRoute>
              }
            />
          ))}
          <Route
            path="/not-authorized"
            element={<Home children={<NotAuthorized />} />}
          />
          {/* <Route path="*" element={<PageNotFound />} /> */}
          <Route path="/school-not-found" element={<SchoolNotFound />} />
        </Routes>
      )}
      <AlertModal
        isVisible={modalMessage ? true : false}
        onClose={() => setModalMessage("")}
        message={modalMessage}
        success={successStatus}
      />
    </BrowserRouter>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <SchoolProvider>
        <App />
      </SchoolProvider>
    </AuthProvider>
  );
}
