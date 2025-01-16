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

const AddTeachersModal = ({
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
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>{isEdit ? "Edit Class" : "Create Class"}</h2>
          <p>Please enter the name of the class.</p>
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            onClose();
            clearForm();
          }}
        />
        <div className="teacher-profile">
          <CustomTextInput
            name="class"
            placeholder="Class Name"
            value={formData?.className}
            handleChange={(e) =>
              setFormData((prev) => ({ ...prev, className: e.target.value }))
            }
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
          <p>School bills for this class</p>
          <div>
            {formData?.bills.length > 0 ? (
              <table
                border="1"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Bill Name</th>
                    <th>Bill Amount (₦)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.bills.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "odd-table" : "even-table"}
                    >
                      <td>{index + 1}</td>
                      <td>{item.billName}</td>
                      <td>{item.billAmount}</td>
                      <td>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <BiEdit
                            className="action-icon"
                            style={{
                              fontSize: "20px",
                              width: "20px",
                              height: "20px",
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
                              width: "20px",
                              height: "20px",
                            }}
                            onClick={() => removeBill(index)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2}>Total:</td>
                    <td>₦{getTotalBills}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No bills added yet.</p>
            )}
          </div>
          <div>
            <div className="input-flex">
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
        <button onClick={handleAdd}>{isEdit ? "Update" : "Add"}</button>
      </div>
    </div>
  );
};

export default AddTeachersModal;
