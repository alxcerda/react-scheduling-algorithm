import React, { useState } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState({
    module: "",
    student: "",
    timetable: new Map(),
  });

  function addPair(module, student, timetable) {

    if (!timetable.has(module)) {
      timetable.set(module, new Set(student));
    } else {
      timetable.set(module, timetable.get(module).add(student));
    }
    console.log(timetable);
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
      <div class="add">
        <div class="inputs">
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
            addPair(state.module, state.student, state.timetable)
          }
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default App;
