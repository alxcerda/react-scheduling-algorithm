import React from "react";

function Node({ name, number, index, colors }) {
  const color = colors.some((item) => item.index === index)
    ? colors.find((item) => item.index === index).color
    : "";

  return (
    <div className="node" style={{ backgroundColor: `${color}` }}>
      <span className="name">{name}</span>
      <span className="number">{number} student/s </span>
    </div>
  );
}

export default Node;
