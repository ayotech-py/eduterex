import React from "react";
import "./ListItem.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListItem = ({ object, index, handleEdit, handleDelete }) => {
  return (
    <div className="item-list">
      <div className="sn">
        <p>{index}</p>
      </div>
      <div className="list-item-name">
        <p>
          {object.full_name
            ? object.full_name
            : object.first_name + " " + object.last_name}
        </p>
      </div>
      <div className="list-item-class">
        <p>{object.class}</p>
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

export default ListItem;
