import React from "react";

function Module({ name, number, color }) {
  return (
    <div className="module" style={{ backgroundColor: `${color}` }}>
      <span className="name">{name}</span>
      <span className="number">
        {number} {number == 1 ? "student" : "students"}
      </span>
    </div>
  );
}

export default Module;
