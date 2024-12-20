import React from "react";
import "./ListItem.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListItem = () => {
  return (
    <div className="item-list">
      <div className="sn">
        <p>1</p>
      </div>
      <div className="list-item-name">
        <p>Gabriel Samuel</p>
      </div>
      <div className="list-item-class">
        <p>Nursery 1</p>
      </div>
      <div className="list-item-action">
        <FaEdit className="edit" />
        <FaTrash className="delete" />
      </div>
    </div>
  );
};

export default ListItem;
