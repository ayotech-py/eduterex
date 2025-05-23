import React from "react";
import "./ListItem.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListItemOnboarding = ({ object, index, handleEdit, handleDelete }) => {
  return (
    <div className="item-list">
      <div className="sn">
        <p>{index}.</p>
      </div>
      <div className="list-item-name">
        <p>{object}</p>
      </div>
      <div className="list-item-action">
        <FaEdit
          onClick={() => {
            handleEdit(index);
          }}
          className="edit"
        />
        <FaTrash
          onClick={() => {
            handleDelete(index);
          }}
          className="delete"
        />
      </div>
    </div>
  );
};

export default ListItemOnboarding;
