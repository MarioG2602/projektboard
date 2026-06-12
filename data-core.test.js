"use strict";

const assert = require("node:assert/strict");
const { SCHEMA_VERSION, validateState } = require("./data-core.js");

const fallback = {
  active: "fallback",
  projects: [{ id: "fallback", name: "Fallback", columns: [{ id: "c", name: "Offen" }], tasks: [] }],
};

const repaired = validateState({
  projects: [{
    id: "p",
    name: " Test ",
    columns: [{ id: "c", name: "Offen" }, { id: "c", name: "Duplikat", done: true }],
    tasks: [{ id: "t", title: "Aufgabe", columnId: "fehlt", priority: "extrem", due: "kaputt" }],
  }],
}, fallback).state;

assert.equal(repaired.schemaVersion, SCHEMA_VERSION);
assert.equal(repaired.projects[0].name, "Test");
assert.equal(new Set(repaired.projects[0].columns.map((column) => column.id)).size, 2);
assert.equal(repaired.projects[0].tasks[0].columnId, repaired.projects[0].columns[0].id);
assert.equal(repaired.projects[0].tasks[0].priority, "normal");
assert.equal(repaired.projects[0].tasks[0].due, "");

const recovered = validateState(null, fallback).state;
assert.equal(recovered.projects[0].name, "Fallback");

const minimal = validateState({}, {}).state;
assert.equal(minimal.schemaVersion, SCHEMA_VERSION);
assert.equal(minimal.projects.length, 1);
assert.equal(minimal.projects[0].columns.length, 1);

const oversized = validateState({
  projects: Array.from({ length: 300 }, (_, index) => ({
    id: `p${index}`,
    name: `Projekt ${index}`,
    columns: [{ id: `c${index}`, name: "Offen" }],
    tasks: [],
  })),
}, fallback).state;
assert.equal(oversized.projects.length, 250);

const emptyTitles = validateState({
  projects: [{
    id: "empty",
    name: " ",
    columns: [{ id: "empty-column", name: "" }],
    tasks: [{ id: "empty-task", title: "", columnId: "empty-column" }],
  }],
}, fallback).state;
assert.equal(emptyTitles.projects[0].name, "Projekt 1");
assert.equal(emptyTitles.projects[0].columns[0].name, "Spalte 1");
assert.equal(emptyTitles.projects[0].tasks[0].title, "Aufgabe 1");

console.log("data-core tests passed");
