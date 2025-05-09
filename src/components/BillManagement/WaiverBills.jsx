import React, { useState } from "react";
import "./BillManagement.css";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import { RiBillFill } from "react-icons/ri";
import { BsCash } from "react-icons/bs";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiMinusCircleBold, PiPlusCircleBold } from "react-icons/pi";
import { BiEdit, BiErrorCircle, BiFileBlank } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { formatAmount } from "../FormatAmount";
import Loading from "../../utils/Loader";
import CustomSelectionInput from "../CustomSelectionInput/CustomSelectionInput";
import ContentTitle from "../ContentTitle";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaRegFolderOpen } from "react-icons/fa";

const WaiverBills = ({ formData, setFormData }) => {
  const [bills, setBills] = useState([]);
  const [newBill, setNewBill] = useState({ billName: "", billAmount: 0 });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setNewBill({ ...newBill, [name]: value });
  };

  const handleAddBill = () => {
    if (!!formData.waivers.find((obj) => obj.billName === newBill.billName)) {
      alert("A waiver of this type has already been added.");
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
          waivers: updatedBills,
        });
      } else {
        setBills([...bills, newBill]);
        setFormData({
          ...formData,
          waivers: [...bills, newBill],
        });
      }
      setNewBill({ billName: "", billAmount: "" });
    } else {
      alert("Please fill in percent and select weaver type.");
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

  return (
    <div className="bill-management-container">
      <div className="card">
        <ContentTitle title={"Waivers"} />
        <p style={{ textAlign: "center" }}>
          Add waivers such as scholarships or discounts by specifying a name and
          the amount reduction applied to fees.
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
                <p>No waivers added yet.</p>
              </i>
            </div>
          ) : (
            <div>
              <div className="new-table-style">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Amount (₦)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((item, index) => (
                      <tr key={index}>
                        <td>{item.billName}</td>
                        <td>{formatAmount(item.billAmount)}</td>
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
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="form">
          <CustomSelectionInput
            name={"billName"}
            placeholder={"Waiver Type"}
            handleChange={handleInputChange}
            value={newBill.billName}
            icon={<RiBillFill className="icons" />}
            data={["Scholarship", "Discount", "Grants", "Others"]}
          />
          <CustomTextInput
            name={"billAmount"}
            placeholder={"Amount"}
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

export default WaiverBills;
