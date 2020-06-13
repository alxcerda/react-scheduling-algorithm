import React, { useState } from "react";
import Node from "./components/Node";
import { uniq } from "lodash";
import randomColor from "randomcolor";
import "./App.scss";

function App() {
  const [state, setState] = useState({
    module: "",
    student: "",
  });

  const [modules] = useState(new Map());
  const [students] = useState(new Map());
  const [examMap] = useState(new Map());
  const [adjMap] = useState(new Map());
  const [upperBound, setUpperBound] = useState(null);
  const [colors] = useState([]);

  function addPair(module, student) {
    setUpperBound(null);

    // set IDs
    let moduleId = setId(module, modules);
    let studentId = setId(student, students);

    // add to examMap
    if (!examMap.has(moduleId)) {
      var set = new Set();
      examMap.set(moduleId, set.add(studentId));
    } else {
      examMap.get(moduleId).add(studentId);
    }

    // add to adjacency list
    if (!adjMap.has(moduleId)) {
      adjMap.set(moduleId, new Set());
    }

    // loop to check exams student is already sitting
    for (var i = 0; i < examMap.size && i !== moduleId; i++) {
      if (examMap.get(i).has(studentId)) {
        adjMap.get(i).add(moduleId);
        adjMap.get(moduleId).add(i);
      }
    }
    setState({ ...state, student: "" });
  }

  function setId(name, map) {
    if (!map.has(name) && map.size === 0) {
      map.set(name, 0);
      return 0;
    } else if (!map.has(name)) {
      map.set(name, map.size);
      return map.size - 1;
    } else {
      return map.get(name);
    }
  }

  function applyGreedyAlgorithm() {
    // need to assign colors for all vertices
    let availableColors = new Set(Array(adjMap.size).keys());
    let assignedColors = new Array(adjMap.size).fill(-1);

    // assign the first color
    assignedColors[0] = 0;
    if (colors.length == 0) colors.push({ index: 0, color: "#FFB6C1" });

    for (let i = 1; i < adjMap.size; i++) {
      let edges = adjMap.get(i);
      let test = edges.values();

      for (let j = 0; j < edges.size; j++) {
        let vertex = test.next().value;
        let color = assignedColors[vertex];
        if (color !== -1) {
          availableColors.delete(color);
        }
      }

      assignedColors[i] = Math.min(...Array.from(availableColors.values()));
      const exisitingColor = colors.find(
        (item) => item.index === assignedColors.indexOf(assignedColors[i])
      )?.color;
      const existingObj = colors.find((item) => item.index === i);

      if (
        assignedColors.slice(0, i).some((item) => item === assignedColors[i])
      ) {
        if (existingObj)
          colors[colors.indexOf(existingObj)].color = exisitingColor;
        else colors.push({ index: i, color: exisitingColor });
      } else {
        if (existingObj)
          colors[colors.indexOf(existingObj)].color = randomColor();
        else colors.push({ index: i, color: randomColor() });
      }

      // reset the available colours
      availableColors = new Set(Array(adjMap.size).keys());
    }

    if (modules.size === 0) setUpperBound(0);
    else setUpperBound(uniq(assignedColors, false).length);
  }

  function getNodeDetails() {
    // get module name and number of students sitting exam
    let details = [];
    let keys = Array.from(modules.keys());
    for (let i = 0; i < adjMap.size; i++) {
      details.push({ name: keys[i], number: examMap.get(i).size });
    }
    return details;
  }

  function handleChange(event) {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value,
    });
  }

  return (
    <div className="app">
      <h1>Greedy Algorithm Visualiser</h1>
      <div className="add">
        <div className="inputs">
          <input
            placeholder="Module Name"
            name="module"
            value={state.module}
            onChange={handleChange}
          />
          <input
            placeholder="Student Name"
            name="student"
            value={state.student}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={() =>
            state.module !== "" &&
            state.student !== "" &&
            addPair(state.module, state.student)
          }
        >
          Add
        </button>
        <button onClick={() => applyGreedyAlgorithm()}>
          Apply the 'Greedy Algorithm'
        </button>
      </div>
      {upperBound !== null && (
        <h3> The upper bound of exam slots is {upperBound}</h3>
      )}
      {modules.size > 0 &&
        getNodeDetails().map((node, index) => (
          <Node
            name={node.name}
            number={node.number}
            index={index}
            colors={colors}
          />
        ))}
    </div>
  );
}

export default App;
