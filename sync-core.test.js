"use strict";

const assert = require("node:assert/strict");
const { mergeStates } = require("./sync-core.js");
const { validateState } = require("./data-core.js");

const base = {
  schemaVersion: 2,
  active: "p",
  projects: [{
    id: "p", name: "Projekt", description: "", goal: "",
    columns: [{ id: "open", name: "Offen", done: false }],
    tasks: [{ id: "a", title: "A", description: "", columnId: "open", priority: "normal", due: "", label: "", order: 1000 }],
  }],
  trash: [],
};

const desktop = structuredClone(base);
desktop.projects[0].tasks[0].title = "A Desktop";
desktop.projects[0].tasks.push({ id: "d", title: "Desktop", columnId: "open", order: 2000 });

const iphone = structuredClone(base);
iphone.projects[0].name = "Projekt iPhone";
iphone.projects[0].tasks.push({ id: "i", title: "iPhone", columnId: "open", order: 2000 });

const merged = mergeStates(base, desktop, iphone);
assert.equal(merged.projects[0].name, "Projekt iPhone");
assert.equal(merged.projects[0].tasks.find((task) => task.id === "a").title, "A Desktop");
assert.deepEqual(new Set(merged.projects[0].tasks.map((task) => task.id)), new Set(["a", "d", "i"]));

const desktopDelete = structuredClone(base);
desktopDelete.projects[0].tasks = [];
const remoteUnchanged = structuredClone(base);
assert.equal(mergeStates(base, desktopDelete, remoteUnchanged).projects[0].tasks.length, 0);

const remoteChanged = structuredClone(base);
remoteChanged.projects[0].tasks[0].description = "Auf dem iPhone ergänzt";
assert.equal(mergeStates(base, desktopDelete, remoteChanged).projects[0].tasks[0].description, "Auf dem iPhone ergänzt");

const missingBaseMerge = mergeStates({}, desktop, iphone);
assert.deepEqual(new Set(missingBaseMerge.projects[0].tasks.map((task) => task.id)), new Set(["a", "d", "i"]));

const hierarchyBase = {
  schemaVersion: 2,
  active: "a",
  projects: [
    { id: "a", name: "A", parentId: "", columns: [{ id: "ca", name: "Offen" }], tasks: [{ id: "ta", title: "Task A", columnId: "ca", order: 1000 }] },
    { id: "b", name: "B", parentId: "", columns: [{ id: "cb", name: "Offen" }], tasks: [{ id: "tb", title: "Task B", columnId: "cb", order: 1000 }] },
  ],
  trash: [],
};
const hierarchyDesktop = structuredClone(hierarchyBase);
hierarchyDesktop.projects[0].parentId = "b";
const hierarchyIphone = structuredClone(hierarchyBase);
hierarchyIphone.projects[1].parentId = "a";
const hierarchyMerged = validateState(mergeStates(hierarchyBase, hierarchyDesktop, hierarchyIphone), hierarchyBase).state;
assert.deepEqual(new Set(hierarchyMerged.projects.flatMap((project) => project.tasks.map((task) => task.id))), new Set(["ta", "tb"]));
assert.ok(!hierarchyMerged.projects.every((project) => project.parentId));

console.log("sync-core tests passed");
