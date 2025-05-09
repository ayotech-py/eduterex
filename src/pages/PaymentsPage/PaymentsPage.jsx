import React, { useState } from "react";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";
import { useSchool } from "../../context/SchoolContext";
import CustomSmallButton from "../../components/Buttons/CustomSmallButton";
import { FaCheckCircle } from "react-icons/fa";
import Loading from "../../utils/Loader";
import { PiCheckCircleBold } from "react-icons/pi";
import "../SchoolBillPage/SchoolBillPage.css";
import { getSchoolBill } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import { isFormValid } from "../../utils/OnboardingUtils/FormChecker";
import { downloadPDF } from "../../utils/Utils";
import ReceiptPDF from "../../components/Receipt/ReceiptPDF";

const PaymentsPage = () => {
  const { schoolState } = useSchool();
  const { schoolSession, student, studentClass } = schoolState;

  const [modalMessage, setModalMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);

  const sessionList = schoolSession.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const [formData, setFormData] = useState({
    session: "",
    term: "",
    type: "receipts",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const checkForm = isFormValid(formData, setModalMessage);
    if (!checkForm) {
      setSuccessStatus(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await getSchoolBill(formData);
      setIsLoading(false);

      if (response.success) {
        const data = response.studentTuition[0];
        const academic_session = schoolSession.find(
          (obj) => obj?.id === data?.academic_session,
        );
        const academic_term = academic_session?.terms.find(
          (obj) => obj.id === data?.academic_term,
        );
        await downloadPDF(
          <ReceiptPDF
            school={student?.school}
            student={student}
            tuition={data}
            session={academic_session}
            term={academic_term}
            studentClass={studentClass}
            id={data?.payments?.length - 1}
          />,
          `${student?.last_name}-${student?.first_name}-receipt-${data?.payments[data?.payments?.length - 1].ref_number}.pdf`,
        );
        setModalMessage(response.message);
        setSuccessStatus(true);
      } else {
        setModalMessage(response.message);
        setSuccessStatus(false);
      }
    } catch (error) {
      setIsLoading(false);
      setModalMessage(error);
      setSuccessStatus(false);
    }
  };

  return (
    <div className="sbp-container">
      <div className="sbp">
        <h3>Generate Payment Receipts</h3>
        <CustomSelectionInput
          placeholder={"Session"}
          name={"session"}
          value={formData.session}
          handleChange={handleChange}
          options={sessionList || []}
        />
        <CustomSelectionInput
          placeholder={"Term"}
          name={"term"}
          value={formData.term}
          handleChange={handleChange}
          options={
            schoolSession
              ?.filter((item) => item?.id === parseInt(formData?.session))[0]
              ?.terms?.map((item) => ({
                label: item?.name,
                value: item?.id,
              })) || []
          }
        />
        <CustomSmallButton
          text={isLoading ? <Loading /> : "Generate Payment Receipts"}
          runFunction={handleSubmit}
          disabled={isLoading}
          icon={!isLoading && <PiCheckCircleBold className="use-font-style" />}
        />
      </div>
      <AlertModal
        isVisible={modalMessage ? true : false}
        onClose={() => setModalMessage("")}
        message={modalMessage}
        success={successStatus}
      />
    </div>
  );
};

export default PaymentsPage;
