import React, { useEffect, useState } from "react";
import "./AddClassModal/AddClassModal.css";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { AlertBadge } from "../AlertBadge";
import { MdClose } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { RiBillFill } from "react-icons/ri";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiPlusCircleBold } from "react-icons/pi";

const BillModal = ({
  isVisible,
  onClose,
  index,
  handleUpdateBill,
  edit,
  billObj,
  billIndex,
}) => {
  const [message, setMessage] = useState("");
  const [bill, setBill] = useState({
    billName: edit ? billObj?.billName : "",
    billAmount: edit ? billObj?.billAmount : "",
  });

  useEffect(() => {
    if (edit !== null) {
      setBill({
        billName: billObj.billName,
        billAmount: billObj.billAmount,
      });
    }
  }, [edit, billIndex]);

  const handleSubmit = () => {
    setMessage("");
    if (!bill.billName.trim()) {
      setMessage("Bill name cannot be empty.");
      return;
    }
    if (!bill.billAmount.trim()) {
      setMessage("Bill amount cannot be empty.");
      return;
    }
    handleUpdateBill(bill, index);
    setBill({ billName: "", billAmount: "" });
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>Enter Bill Details</h2>
          <p>Please enter the name of the class.</p>
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            setBill({ billName: "", billAmount: "" });
            onClose();
          }}
        />
        <div className="modal-sub-container overflow">
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <CustomTextInput
                name="bill_name"
                placeholder="Bill Name"
                value={bill.billName}
                handleChange={(e) =>
                  setBill((prev) => ({ ...prev, billName: e.target.value }))
                }
                icon={<RiBillFill className="icons" />}
              />
              <CustomTextInput
                name="bill_amount"
                placeholder="Bill Amount"
                value={bill.billAmount}
                handleChange={(e) =>
                  setBill((prev) => ({ ...prev, billAmount: e.target.value }))
                }
                icon={<BsCash className="icons" />}
              />
            </div>
          </div>
        </div>
        {message && <AlertBadge message={message} />}
        <CustomSmallButton
          text={"Okay"}
          runFunction={() => handleSubmit()}
          icon={<PiPlusCircleBold className="use-font-style" />}
        />
      </div>
    </div>
  );
};

export default BillModal;
