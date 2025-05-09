import React, { useEffect, useState } from "react";
import "./AddClassModal/AddClassModal.css";
import { MdClose } from "react-icons/md";
import CustomSmallButton from "../Buttons/CustomSmallButton";
import { PiCheckCircleBold } from "react-icons/pi";

const FilterModal = ({ isVisible, onClose, setFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState("none");

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: "300px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{ textAlign: "center" }}
          className="modal-heading-container"
        >
          {" "}
          <h2>Filter</h2>
        </div>
        <MdClose
          className="close-modal"
          onClick={() => {
            onClose();
          }}
        />
        <div className="radio-container">
          <label>
            <input
              type="radio"
              value="outstanding"
              checked={selectedFilter === "outstanding"}
              onChange={() => setSelectedFilter("outstanding")}
            />
            Outstanding
          </label>
        </div>

        <div className="radio-container">
          <label>
            <input
              type="radio"
              value="cleared"
              checked={selectedFilter === "cleared"}
              onChange={() => setSelectedFilter("cleared")}
            />
            Cleared
          </label>
        </div>
        <div className="radio-container">
          <label>
            <input
              type="radio"
              value="none"
              checked={selectedFilter === "none"}
              onChange={() => setSelectedFilter("none")}
            />
            None
          </label>
        </div>
        <CustomSmallButton
          text={"Apply"}
          runFunction={() => {
            setFilter(selectedFilter);
            onClose();
          }}
          icon={<PiCheckCircleBold className="use-font-style" />}
        />
      </div>
    </div>
  );
};

export default FilterModal;
