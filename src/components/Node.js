import React from "react";

function Node({ name, number, index }) {
  return (
    <div className="node">
      <span className="name">{name}</span>
      <span className="number">{number}</span>
    </div>
  );
}

export default Node;
