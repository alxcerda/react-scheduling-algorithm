import React from "react";

function Node({ name, number, color }) {
  return (
    <div className="node" style={{ backgroundColor: { color } }}>
      <span className="name">{name}</span>
      <span className="number">{number}</span>
    </div>
  );
}

export default Node;
