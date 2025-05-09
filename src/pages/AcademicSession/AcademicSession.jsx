import React, { useEffect, useState } from "react";
import NoRecord from "../../components/NoRecord";
import "./AcademicSession.css";
import { BiPlusCircle, BiRightArrow } from "react-icons/bi";
import AddSessionModal from "../../components/modals/AddSessionModal/AddSessionModal";
import { useAuth } from "../../context/AuthContext";
import { useSchool } from "../../context/SchoolContext";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import {
  activateSession,
  createSession,
  createTerm,
  updateTerm,
} from "../../services/schoolService";
import AddTermModal from "../../components/modals/AddTermModal/AddTermModal";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import CustomButton from "../../components/Buttons/CustomButton";
import ActivateSessionModal from "../../components/modals/ActivateSessionModal/ActivateSessionModal";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { BsArrowLeftCircle } from "react-icons/bs";
import FeatureLockModal from "../../components/modals/FeatureLockModal/FeatureLockModal";
import Loading from "../../utils/Loader";
import AlertOptionModal from "../../components/modals/AlertModal/AlertOptionModal";

const AcademicSession = () => {
  //AlertOptionModal
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const handleOpenOptionModal = () => setIsOptionModalVisible(true);
  const handleCloseOptionModal = () => setIsOptionModalVisible(false);

  const [optionId, setOptionId] = useState(null);

  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
  const handleOpenSessionModal = () => setIsSessionModalVisible(true);
  const handleCloseSessionModal = () => setIsSessionModalVisible(false);

  const [isTermModalVisible, setIsTermModalVisible] = useState(false);
  const handleOpenTermModal = () => setIsTermModalVisible(true);
  const handleCloseTermModal = () => setIsTermModalVisible(false);

  const [isActivateModalVisible, setIsActivateModalVisible] = useState(false);
  const handleOpenActivateModal = () => setIsActivateModalVisible(true);
  const handleCloseActivateModal = () => setIsActivateModalVisible(false);

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const { authState, logout, hasAccess } = useAuth();
  const { schoolState, setSchoolDatas } = useSchool();

  const { user } = authState;
  const { classes, schoolSession } = schoolState;

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSession = async (formdata, setMessage) => {
    setIsLoading(true);

    try {
      const response = await createSession(formdata);
      setIsLoading(false);

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setIsSessionModalVisible(false);
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setIsLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  const handleCreateTerm = async (formdata, setMessage) => {
    setIsLoading(true);

    try {
      const response = await createTerm(formdata);
      setIsLoading(false);

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setIsTermModalVisible(false);
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setIsLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  const [endLoading, setEndLoading] = useState(false);

  const handleEndTerm = async (termId) => {
    setEndLoading(true);

    try {
      const response = await updateTerm(
        JSON.stringify({ termId: termId }),
        termId,
      );
      setEndLoading(false);

      if (response.success) {
        setSchoolDatas(response.schoolData);
        handleCloseOptionModal();
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        handleCloseOptionModal();
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      handleCloseOptionModal();
      setEndLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  const handleActivateSession = async (formdata, setMessage) => {
    setIsLoading(true);

    try {
      const response = await activateSession(formdata);
      setIsLoading(false);

      if (response.success) {
        setSchoolDatas(response.schoolData);
        setIsActivateModalVisible(false);
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setIsLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  const [sessionId, setSessionId] = useState(schoolSession[0]?.id);

  useEffect(() => {
    if (schoolSession.length > 0) {
      setSessionId(schoolSession?.find((obj) => obj?.is_active === true).id);
      setShowSession(false);
    }
  }, [schoolSession]);

  const getTerm = (id) => {
    return schoolSession.find((obj) => obj.id === id);
  };

  const [showSession, setShowSession] = useState(true);

  return !hasAccess(1) ? (
    <div className="academic-session-container">
      <div className="session-active-btn">
        <div
          className="btn-container-small home-btn"
          style={{ width: "min-content" }}
        >
          <button onClick={handleOpenActivateModal} className="btn">
            Change current session/term
          </button>
        </div>
      </div>
      <div className="academic-session">
        <div className={`aside ${showSession ? "show-view" : "hide-view"}`}>
          <div className="academic-heading">
            <h3>Sessions</h3>
            <CustomSmallButton
              text={"Create Session"}
              icon={<BiPlusCircle size={"18px"} />}
              runFunction={handleOpenSessionModal}
            />
          </div>

          {schoolSession?.length > 0 ? (
            <div className="session-body">
              {schoolSession
                ?.slice()
                .reverse()
                .map((obj, index) => (
                  <div
                    key={index}
                    className={
                      obj.id === sessionId
                        ? "session-list session-list-selected"
                        : "session-list"
                    }
                    onClick={() => {
                      setSessionId(obj.id);
                      setShowSession(false);
                    }}
                  >
                    <p>{obj?.name}</p>
                    <div className="session-right-aligned">
                      {obj?.is_active ? (
                        <div className="active_status">
                          <p>Active</p>
                        </div>
                      ) : (
                        <div className="inactive_status">
                          <p>Inactive</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <NoRecord />
          )}
        </div>
        <div className={`main ${showSession ? "hide-view" : "show-view"}`}>
          <div className="academic-heading">
            <div className="back-btn">
              <BsArrowLeftCircle
                className="mobile-back-icon"
                style={{ color: "#711a75", fontSize: "18px" }}
                onClick={() => setShowSession(true)}
              />
              <h3>Terms</h3>
            </div>
            <CustomSmallButton
              text={"Create Term"}
              icon={<BiPlusCircle size={"18px"} />}
              runFunction={handleOpenTermModal}
            />
          </div>
          {getTerm(sessionId)?.terms?.length > 0 ? (
            <div className="term-body">
              {getTerm(sessionId)?.terms?.map((obj, index) => (
                <div className="term-list">
                  <div className="term-list-details">
                    <div className="term-heading">
                      <h3>{obj?.name}</h3>
                    </div>
                    <p>Start Date: {obj?.start_date}</p>
                    <p>End Date: {obj?.end_date}</p>
                  </div>
                  <div className="term-list-action">
                    {obj?.is_active ? (
                      <div className="active_status">
                        <p>Active</p>
                      </div>
                    ) : (
                      <div className="inactive_status">
                        <p>Inactive</p>
                      </div>
                    )}
                    {obj?.is_open ? (
                      <div className="no-width">
                        <CustomSmallButton
                          text={"End Term"}
                          runFunction={() => {
                            setOptionId(obj?.id);
                            handleOpenOptionModal();
                          }}
                        />
                      </div>
                    ) : (
                      <div className="inactive_status">
                        <p>Closed</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoRecord />
          )}
        </div>
      </div>
      <AddSessionModal
        isVisible={isSessionModalVisible}
        onClose={handleCloseSessionModal}
        handleCreateSession={handleCreateSession}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <AddTermModal
        isVisible={isTermModalVisible}
        onClose={handleCloseTermModal}
        handleCreateTerm={handleCreateTerm}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <AlertModal
        isVisible={modalMessage ? true : false}
        onClose={() => setModalMessage("")}
        message={modalMessage}
        success={successStatus}
      />
      <AlertOptionModal
        isVisible={isOptionModalVisible}
        onClose={handleCloseOptionModal}
        message={
          "You won't be able to make any further changes to this academic term. Are you sure you want to continue?"
        }
        runFunction={() => handleEndTerm(optionId)}
        loading={endLoading}
      />
      <ActivateSessionModal
        isVisible={isActivateModalVisible}
        onClose={handleCloseActivateModal}
        isLoading={isLoading}
        handleActivateSession={handleActivateSession}
        setIsLoading={setIsLoading}
        data={schoolSession}
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

export default AcademicSession;
