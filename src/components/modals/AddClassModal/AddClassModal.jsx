import React, { useState, useEffect, useMemo } from "react";
import "./AddClassModal.css";
import CustomTextInput from "../../CustomTextInput/CustomTextInput";
import { FiUser, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import CustomSelectionInput from "../../CustomSelectionInput/CustomSelectionInput";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AlertBadge } from "../../AlertBadge";
import { isFormValid } from "../../../utils/OnboardingUtils/FormChecker";
import { doesObjectExist } from "../../../utils/OnboardingUtils/ObjectChecker";
import { MdClose } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { PiMinusCircleBold, PiPlusCircleBold } from "react-icons/pi";
import { RiBillFill } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import CustomSmallButton from "../../Buttons/CustomSmallButton";
import { formatAmount } from "../../FormatAmount";
import ContentTitle from "../../ContentTitle";

const AddClassModal = ({
  isVisible,
  onClose,
  setClassList,
  classList,
  setEditIndex,
  isEdit,
}) => {
  const [formData, setFormData] = useState({
    className: "",
    bills: [],
  });

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [bill, setBill] = useState({
    billName: "",
    billAmount: "",
  });

  const [edit, setEdit] = useState(null);

  useEffect(() => {
    if (isVisible && typeof isEdit === "number") {
      setFormData(classList[isEdit - 1]);
    }
  }, [isVisible, isEdit, classList]);

  const clearForm = () => {
    setFormData((prev) => ({ ...prev, className: "" }));
    setEditIndex(null);
    setBill({ billName: "", billAmount: "" });
    setEdit(null);
  };

  const handleAdd = () => {
    setMessage("");
    if (!formData?.className.trim()) {
      setMessage("Class name cannot be empty.");
      setAlert(true);
      return;
    }

    if (doesObjectExist(classList, formData) && typeof isEdit !== "number") {
      setMessage("A class with this name already exists.");
      setAlert(true);
      return;
    }

    const updatedList = [...classList];
    if (typeof isEdit === "number") {
      updatedList[isEdit - 1] = formData; // Update class
    } else {
      updatedList.push(formData); // Add new class
    }

    setClassList(updatedList);
    clearForm();
    onClose();
  };

  const addBill = () => {
    if (
      !bill.billName.trim() ||
      isNaN(bill.billAmount) ||
      +bill.billAmount <= 0
    ) {
      setMessage("Please enter a valid bill name and amount.");
      setAlert(true);
      return;
    }

    const updatedBills = [...formData?.bills];
    if (edit !== null) {
      updatedBills[edit] = bill;
    } else {
      updatedBills.push(bill);
    }

    setFormData((prev) => ({ ...prev, bills: updatedBills }));
    setBill({ billName: "", billAmount: "" });
    setEdit(null);
    setMessage("");
  };

  const removeBill = (id) => {
    const updatedBills = formData?.bills.filter((_, index) => index !== id);
    setFormData((prev) => ({ ...prev, bills: updatedBills }));
  };

  const getTotalBills = useMemo(() => {
    return formData?.bills
      .reduce((total, bill) => {
        const amount = parseFloat(bill.billAmount);
        return total + (isNaN(amount) ? 0 : amount);
      }, 0)
      .toFixed(2);
  }, [formData?.bills]);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay add-class">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          <h2>{isEdit ? "Edit Class" : "Create Class"}</h2>
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            onClose();
            clearForm();
          }}
        />
        <div className="modal-sub-container overflow">
          <CustomTextInput
            name="class"
            placeholder="Class Name"
            value={formData?.className}
            handleChange={(e) =>
              setFormData((prev) => ({ ...prev, className: e.target.value }))
            }
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
          <div>
            <ContentTitle title={"Class Bill"} />
            <p style={{ fontSize: "12px" }}>
              <i>
                <span style={{ color: "red", fontSize: "12px" }}>Note:</span>{" "}
                Class bill should consist of the mandatory bills only for this
                particular class.
              </i>
            </p>
          </div>
          <div>
            {formData?.bills.length > 0 ? (
              <div className="new-table-style">
                <table>
                  <thead>
                    <tr>
                      <th>Bill Name</th>
                      <th>Bill Amount (₦)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData?.bills.map((item, index) => (
                      <tr key={index}>
                        <td>{item.billName}</td>
                        <td>₦{formatAmount(item.billAmount)}</td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              justifyContent: "center",
                            }}
                          >
                            <BiEdit
                              className="action-icon"
                              style={{
                                fontSize: "20px",
                                width: "17px",
                                height: "17px",
                              }}
                              onClick={() => {
                                setEdit(index);
                                setBill(item);
                              }}
                            />
                            <PiMinusCircleBold
                              className="action-icon"
                              style={{
                                fontSize: "20px",
                                width: "17px",
                                height: "17px",
                              }}
                              onClick={() => removeBill(index)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Total:</td>
                      <td>₦{formatAmount(getTotalBills)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No bills added yet.</p>
            )}
          </div>
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
              <div style={{ width: "50px" }}>
                <PiPlusCircleBold
                  className="action-icon"
                  style={{ fontSize: "25px", width: "25px", height: "25px" }}
                  onClick={addBill}
                />
              </div>
            </div>
          </div>
        </div>
        {message && <AlertBadge message={message} />}
        <CustomSmallButton
          text={isEdit ? "Update Class" : "Add Class"}
          runFunction={handleAdd}
          icon={<PiPlusCircleBold className="use-font-style" />}
        />
      </div>
    </div>
  );
};

export default AddClassModal;
