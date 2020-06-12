import React, { useState } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState({
    module: "",
    student: "",
  });

  const [modules] = useState(new Map());
  const [students] = useState(new Map());
  const [examMap] = useState(new Map());
  const [adjMap] = useState(new Map());

  function addPair(module, student) {
    var moduleId;
    var studentId;

    // get moduleId
    if (!modules.has(module) && modules.size === 0) {
      moduleId = 0;
      modules.set(module, moduleId);
    } else if (!modules.has(module)) {
      moduleId = modules.size;
      modules.set(module, moduleId);
    } else {
      moduleId = modules.get(module);
    }

    // get studentId
    if (!students.has(student) && students.size === 0) {
      studentId = 0;
      students.set(student, studentId);
    } else if (!students.has(student)) {
      studentId = students.size;
      students.set(student, studentId);
    } else {
      studentId = students.get(student);
    }

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

    console.log("ADJ", adjMap);
    console.log("EXAM", examMap);
    console.log("STUDENT", students);
    console.log("MOD", modules);
    setState({ ...state, student: "" });
  }

  // modules.set(module, new Set(student));
  // timetable.set(module, timetable.get(module).add(student));
  //

  function greedyAlgorithm() {
    // need to assign colours for all vertices
    let availableColours = [...Array(adjMap.size).keys()];
    let assignedColours = new Array(adjMap.size).fill(-1);
    // assign the first colour
    assignedColours[0] = 0;

    for (let i = 1; i < adjMap.size; i++) {
      let edges = adjMap.get(i);
      for (let j = 0; j < edges.size; j++) {
        if (assignedColours[edges[j]] !== -1) {
          const index = availableColours.indexOf(assignedColours[edges[j]]);
          availableColours.splice(index, 1);
        }
      }
      assignedColours[i] = Math.min(availableColours);
      // reset the available colours
      availableColours = [...Array(adjMap.size).keys()];
    }

    console.log(assignedColours);
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

        <button onClick={() => greedyAlgorithm()}>
          Apply the 'Greedy Algorithm'
        </button>
      </div>
    </div>
  );
}

export default App;
