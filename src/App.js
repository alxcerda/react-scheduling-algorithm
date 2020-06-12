import React, { useState } from "react";
import Node from "./components/Node";
import "./App.css";
import { uniq } from "lodash";

function App() {
  const [state, setState] = useState({
    module: "",
    student: "",
  });

  const [modules] = useState(new Map());
  const [students] = useState(new Map());
  const [examMap] = useState(new Map());
  const [adjMap] = useState(new Map());
  const [upperBound, setUpperBound] = useState("");

  function addPair(module, student) {
    setUpperBound("");

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
    console.log("ADJ", adjMap);
    console.log("EXAM", examMap);
    console.log("STUDENT", students);
    console.log("MOD", modules);
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
    // need to assign colours for all vertices
    let availableColours = new Set(Array(adjMap.size).keys());
    console.log("avcolours", availableColours);
    let assignedColours = new Array(adjMap.size).fill(-1);
    console.log("ascolours", assignedColours);
    // assign the first colour
    assignedColours[0] = 0;

    for (let i = 1; i < adjMap.size; i++) {
      let edges = adjMap.get(i);
      let test = edges.values();
      for (let j = 0; j < edges.size; j++) {
        let vertex = test.next().value;
        let colour = assignedColours[vertex];
        if (colour !== -1) {
          // const index = availableColours.indexOf(assignedColours[edges[j]]);
          availableColours.delete(colour);
        }
      }
      assignedColours[i] = Math.min(...Array.from(availableColours.values()));
      // reset the available colours
      availableColours = new Set(Array(adjMap.size).keys());
    }

    console.log(assignedColours);
    setUpperBound(uniq(assignedColours, false).length);
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
      <h1>Scheduling Algorithm Visualiser</h1>
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
        <button onClick={() => addPair(state.module, state.student)}>
          Add
        </button>
        <button onClick={() => applyGreedyAlgorithm()}>
          Apply the 'Greedy Algorithm'
        </button>
        {upperBound && <h3> The upper bound is {upperBound}</h3>}
        {modules.size > 0 &&
          Array.from(modules.keys()).map((node) => <Node name={node} />)}
      </div>
    </div>
  );
}

export default App;
