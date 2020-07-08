import React, { useState } from "react";
import Module from "./components/Module";
import { uniq } from "lodash";
import randomColor from "randomcolor";
import "./App.scss";

function App() {
  const [values, setValues] = useState({
    module: "",
    student: "",
  });

  const [modules] = useState(new Map());
  const [students] = useState(new Map());
  const [examMap] = useState(new Map());
  const [adjMap] = useState(new Map());
  const [error, setError] = useState(false);
  const [upperBound, setUpperBound] = useState(null);
  const [colors, setColors] = useState([]);

  function addPair(module, student) {
    setUpperBound(null);

    // set IDs
    let moduleId = getId(module, modules);
    let studentId = getId(student, students);

    // examMap has all exams and all students taking them (modules : students)
    if (!examMap.has(moduleId)) {
      var set = new Set();
      examMap.set(moduleId, set.add(studentId));
    } else {
      examMap.get(moduleId).add(studentId);
    }

    // add module to adjacency list (modules : connected modules)
    if (!adjMap.has(moduleId)) {
      adjMap.set(moduleId, new Set());
    }

    // loop to check exams student is already sitting, skip self
    for (var i = 0; i < examMap.size; i++) {
      if (i === moduleId) continue;
      if (examMap.get(i).has(studentId)) {
        adjMap.get(i).add(moduleId);
        adjMap.get(moduleId).add(i);
      }
    }
    setValues({ ...values, student: "" });
  }

  function getId(name, map) {
    if (!map.has(name) && map.size === 0) {
      // set initial id
      map.set(name, 0);
      return 0;
    } else if (!map.has(name)) {
      // add next id
      map.set(name, map.size);
      return map.size - 1;
    } else {
      // return existing id
      return map.get(name);
    }
  }

  function applyGreedyAlgorithm() {
    // need to assign colors for all vertices
    // temp colors array
    const newColors = [];

    if (modules.size === 0) {
      setError(true);
      return;
    }
    // initialise possible colors (worst case all different)
    let availableColors = new Set(Array(adjMap.size).keys());
    // initialise all colors as unassigned
    let assignedColors = new Array(adjMap.size).fill(-1);

    // assign the first color
    assignedColors[0] = 0;
    newColors.push({ index: 0, color: "#FFB6C1" });

    // for each vertex, delete unavailable colors ie. ones assigned to neighbours
    for (let i = 1; i < adjMap.size; i++) {
      let connectedVertices = adjMap.get(i);
      let iterator = connectedVertices.values();

      for (let j = 0; j < connectedVertices.size; j++) {
        let vertex = iterator.next().value;
        let color = assignedColors[vertex];
        if (color !== -1) {
          availableColors.delete(color);
        }
      }

      // get minimum available color
      assignedColors[i] = Math.min(...Array.from(availableColors.values()));

      // check if color already exists, and get that hex code
      const exisitingColor = newColors.find(
        (item) => item.index === assignedColors.indexOf(assignedColors[i])
      )?.color;

      if (exisitingColor) {
        newColors.push({ index: i, color: exisitingColor });
      } else {
        newColors.push({ index: i, color: randomColor() });
      }

      // reset the available colours for next iteration
      availableColors = new Set(Array(adjMap.size).keys());
    }

    setColors(newColors);
    setUpperBound(uniq(assignedColors, false).length);
  }

  function getModuleDetails() {
    // get module name and number of students sitting exam
    let details = [];
    let keys = Array.from(modules.keys());
    for (let i = 0; i < adjMap.size; i++) {
      details.push({ name: keys[i], number: examMap.get(i).size });
    }
    return details;
  }

  function handleChange(event) {
    setError(false);
    const value = event.target.value;
    setValues({
      ...values,
      [event.target.name]: value,
    });
  }

  function getColor(index) {
    return colors.some((item) => item.index === index)
      ? colors.find((item) => item.index === index).color
      : "";
  }

  return (
    <div className="app">
      <h1>Greedy Algorithm Visualiser</h1>
      <div className="inputs">
        <input
          placeholder="Module Name"
          name="module"
          value={values.module}
          onChange={handleChange}
        />
        <input
          placeholder="Student Name"
          name="student"
          value={values.student}
          onChange={handleChange}
        />
      </div>
      <div className="inputs">
        <button
          onClick={() =>
            values.module !== "" &&
            values.student !== "" &&
            addPair(values.module, values.student)
          }
        >
          Add Module
        </button>
        <button onClick={() => applyGreedyAlgorithm()}>
          Apply the 'Greedy Algorithm'
        </button>
      </div>
      {error && <h3> No modules added :( </h3>}
      {upperBound && <h3> The upper bound of exam slots is {upperBound}</h3>}
      {modules.size > 0 &&
        getModuleDetails().map((node, index) => (
          <Module
            key={index}
            name={node.name}
            number={node.number}
            index={index}
            color={getColor(index)}
          />
        ))}
    </div>
  );
}

export default App;
