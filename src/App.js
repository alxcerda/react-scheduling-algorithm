import React, { useState } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState({
    module: "",
    student: "",
    modules: new Map(),
    students: new Map(),
    examMap: new Map(),
    adjMap: new Map(),
  });

  function addPair(module, student) {
    var moduleId;
    var studentId;

    // get moduleId
    if (!state.modules.has(module) && state.modules.size === 0) {
      moduleId = 0;
      state.modules.set(module, moduleId);
    } else if (!state.modules.has(module)) {
      moduleId = state.modules.size;
      state.modules.set(module, moduleId);
    } else {
      moduleId = state.modules.get(module);
    }

    // get studentId
    if (!state.students.has(student) && state.students.size === 0) {
      studentId = 0;
      state.students.set(student, studentId);
    } else if (!state.students.has(student)) {
      studentId = state.students.size;
      state.students.set(student, studentId);
    } else {
      studentId = state.students.get(student);
    }

    // add to examMap
    if (!state.examMap.has(moduleId)) {
      var set = new Set();
      state.examMap.set(moduleId, set.add(studentId));
    } else {
      state.examMap.get(moduleId).add(studentId);
    }

    // add to adjacency list
    if (!state.adjMap.has(moduleId)) {
      state.adjMap.set(moduleId, new Set());
    }

    // loop to check exams student is already sitting
    for (var i = 0; i < state.examMap.size && i !== moduleId; i++) {
      if (state.examMap.get(i).has(studentId)) {
        state.adjMap.get(i).add(moduleId);
        state.adjMap.get(moduleId).add(i);
      }
    }

    console.log("ADJ", state.adjMap);
    console.log("EXAM", state.examMap);
    console.log("STUDENT", state.students);
    console.log("MOD", state.modules);
  }

  // modules.set(module, new Set(student));
  // timetable.set(module, timetable.get(module).add(student));
  //

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
      </div>
    </div>
  );
}

export default App;
