import React, { useMemo, useState } from "react";
import "./BillManagement.css";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { RiBillFill } from "react-icons/ri";
import { BsCash } from "react-icons/bs";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiMinusCircleBold, PiPlusCircleBold } from "react-icons/pi";
import { BiEdit, BiFileBlank } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { formatAmount } from "../FormatAmount";
import Loading from "../../utils/Loader";
import ContentTitle from "../ContentTitle";

const BillManagement = ({ formData, setFormData }) => {
  const [bills, setBills] = useState([]);
  const [newBill, setNewBill] = useState({ billName: "", billAmount: 0 });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill({ ...newBill, [name]: value });
  };

  const handleAddBill = () => {
    if (
      !!formData.extra_bills.find((obj) => obj.billName === newBill.billName)
    ) {
      alert("A bill with this name already exists.");
      return;
    }
    if (newBill.billName && newBill.billAmount) {
      if (editingIndex !== null) {
        const updatedBills = [...bills];
        updatedBills[editingIndex] = newBill;
        setBills(updatedBills);
        setEditingIndex(null);
        setFormData({
          ...formData,
          extra_bills: updatedBills,
        });
      } else {
        setBills([...bills, newBill]);
        setFormData({
          ...formData,
          extra_bills: [...bills, newBill],
        });
      }
      setNewBill({ billName: "", billAmount: "" });
    } else {
      alert("Please fill in both the bill name and amount.");
    }
  };

  const handleEditBill = (index) => {
    setNewBill(bills[index]);
    setEditingIndex(index);
  };

  const handleDeleteBill = (index) => {
    const updatedBills = bills.filter((_, i) => i !== index);
    setBills(updatedBills);
  };

  const getTotalBills = useMemo(() => {
    return bills
      .reduce((total, bill) => {
        const amount = parseFloat(bill.billAmount);
        return total + (isNaN(amount) ? 0 : amount);
      }, 0)
      .toFixed(2);
  }, [bills]);

  return (
    <div className="bill-management-container">
      <div className="card">
        <ContentTitle title={"Optional Bills"} />
        <p style={{ textAlign: "center" }}>
          These are optional fees for services like hostel or school bus,
          specific to individual students. These info cannot be editted after
          submission.
        </p>
        <div className="bill-list">
          {bills.length === 0 ? (
            <div
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <BiFileBlank size={35} color="#711a75" />
              <i>
                <p>No bills added yet.</p>
              </i>
            </div>
          ) : (
            <div>
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
                    {bills.map((item, index) => (
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
                                handleEditBill(index);
                              }}
                            />
                            <PiMinusCircleBold
                              className="action-icon"
                              style={{
                                fontSize: "20px",
                                width: "17px",
                                height: "17px",
                              }}
                              onClick={() => handleDeleteBill(index)}
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
            </div>
          )}
        </div>
        <div className="form">
          <CustomTextInput
            name={"billName"}
            placeholder={"Bill Name"}
            handleChange={handleInputChange}
            value={newBill.billName}
            icon={<RiBillFill className="icons" />}
          />
          <CustomTextInput
            name={"billAmount"}
            placeholder={"Bill Amount"}
            handleChange={handleInputChange}
            value={newBill.billAmount}
            icon={<BsCash className="icons" />}
          />
          <CgAdd
            className="action-icon"
            style={{ fontSize: "60px", width: "60px", height: "60px" }}
            onClick={handleAddBill}
          />
        </div>
      </div>
    </div>
  );
};

export default BillManagement;
