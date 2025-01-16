import React, { useState, useEffect } from "react";
import "./AddClassModal.css"; // Import CSS styles
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

  useEffect(() => {
    console.log("isesidt", isEdit);
    if (isVisible === true && isEdit) {
      console.log("The classlist", classList);
      setFormData(classList[isEdit - 1]);
    }
  }, [isVisible, isEdit, classList]);

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [bill, setBill] = useState({
    billName: "",
    billAmount: "",
  });

  const [edit, setEdit] = useState(null);

  const handleAdd = () => {
    setMessage("");
    if (formData.className) {
      if (doesObjectExist(classList, formData)) {
        setMessage("A class with this name already exist.");
        setAlert(true);
        return;
      } else {
        if (isEdit) {
          classList[isEdit - 1] = formData;
          setClassList([...classList]);
          clearForm();
        } else {
          setClassList((prevData) => [...prevData, formData]);
          clearForm();
        }
      }
      onClose();
    } else {
      setMessage("Field cant be empty.");
      setAlert(true);
    }
    console.log("The list", classList);
  };

  const clearForm = () => {
    setFormData((prev) => ({
      ...prev,
      className: "",
    }));
    setEditIndex(null);
  };

  const addBill = () => {
    if (isFormValid(bill, setMessage)) {
      if (edit !== null) {
        formData.bills[edit] = bill;
        setFormData((prev) => ({
          ...prev,
          bills: [...formData.bills],
        }));
        setEdit(null);
        setBill({
          billName: "",
          billAmount: "",
        });
        console.log("run 1");
        return;
      }
      console.log("run 2");
      setFormData((prev) => ({
        ...prev,
        bills: [...formData.bills, bill],
      }));
      setBill({
        billName: "",
        billAmount: "",
      });
      setMessage("");
    }
  };

  const removeBill = (id) => {
    const updatedList = formData.bills.filter((_, index) => index !== id);
    setFormData((prev) => ({
      ...prev,
      bills: [...updatedList],
    }));
  };

  const getTotalBills = (bills) => {
    return bills
      ?.reduce((total, bill) => {
        const amount = parseFloat(Object.values(bill)[1]); // Convert string to float
        return total + (isNaN(amount) ? 0 : amount); // Add amount to total, skip invalid values
      }, 0)
      .toFixed(2); // Round to 2 decimal places
  };

  if (!isVisible) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        onClose();
        clearForm();
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div>
          <h2>Create Class</h2>
          <p>Please enter the name of the class.</p>
        </div>
        <MdClose className="close-modal" onClick={onClose} />
        <div className="teacher-profile">
          <CustomTextInput
            name={"class"}
            placeholder={"Class Name"}
            value={formData.className}
            handleChange={(e) =>
              setFormData((prev) => ({ ...prev, className: e.target.value }))
            }
            icon={<AiOutlineUsergroupAdd className="icons" />}
          />
          <p>School bills for this class</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {formData?.bills?.length > 0 ? (
              <table
                border="1"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <thead>
                  <tr className="odd-table">
                    <th style={{ width: "15px" }}>S/N</th>
                    <th>Bill Name</th>
                    <th>Bill Amount (₦)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.bills.map((item, index) => (
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
                              setBill({
                                billName: item.billName,
                                billAmount: item.billAmount,
                              });
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
                  <tr className={"even-table"}>
                    <td></td>
                    <td>Total:</td>
                    <td>₦{getTotalBills(formData.bills)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>
                <i>No bill recorded yet.</i>
              </p>
            )}
          </div>
          <div className="input-flex">
            <CustomTextInput
              name={"bill_name"}
              placeholder={"Bill name"}
              value={bill.billName}
              handleChange={(e) =>
                setBill((prev) => ({ ...prev, billName: e.target.value }))
              }
              icon={<RiBillFill className="icons" />}
            />
            <CustomTextInput
              name={"bill_amount"}
              placeholder={"Bill amount"}
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
        {message && <AlertBadge message={message} />}
        <button onClick={handleAdd}>{isEdit ? "Update" : "Add"}</button>
      </div>
    </div>
  );
};

export default AddTeachersModal;
