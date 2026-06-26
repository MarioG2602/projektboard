(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ProjectboardData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = 2;
  const priorities = new Set(["low", "normal", "high"]);

  function id() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  }

  function text(value, max, fallback = "") {
    return typeof value === "string" ? value.trim().slice(0, max) : fallback;
  }

  function requiredText(value, max, fallback) {
    return text(value, max) || fallback;
  }

  function uniqueId(value, used) {
    let result = text(value, 100) || id();
    while (used.has(result)) result = id();
    used.add(result);
    return result;
  }

  function validateState(input, fallback) {
    const report = [];
    const source = input && typeof input === "object" ? input : {};
    const fallbackSource = fallback && typeof fallback === "object" ? fallback : {};
    const used = new Set();
    const rawProjects = Array.isArray(source.projects) && source.projects.length
      ? source.projects
      : fallbackSource.projects || [];

    const projects = rawProjects.slice(0, 250).map((rawProject, projectIndex) => {
      const raw = rawProject && typeof rawProject === "object" ? rawProject : {};
      const projectId = uniqueId(raw.id, used);
      const rawColumns = Array.isArray(raw.columns) && raw.columns.length
        ? raw.columns
        : [{ name: "Aufgaben", done: false }];
      const columns = rawColumns.slice(0, 100).map((rawColumn, columnIndex) => {
        const column = rawColumn && typeof rawColumn === "object" ? rawColumn : {};
        return {
          id: uniqueId(column.id, used),
          name: requiredText(column.name, 40, `Spalte ${columnIndex + 1}`),
          done: column.done === true,
        };
      });
      const columnIds = new Set(columns.map((column) => column.id));
      const firstColumnId = columns[0].id;
      const rawTasks = Array.isArray(raw.tasks) ? raw.tasks : [];
      const tasks = rawTasks.slice(0, 10000).map((rawTask, taskIndex) => {
        const task = rawTask && typeof rawTask === "object" ? rawTask : {};
        const requestedColumn = text(task.columnId, 100);
        return {
          id: uniqueId(task.id, used),
          title: requiredText(task.title, 140, `Aufgabe ${taskIndex + 1}`),
          description: text(task.description, 5000),
          columnId: columnIds.has(requestedColumn) ? requestedColumn : firstColumnId,
          priority: priorities.has(task.priority) ? task.priority : "normal",
          due: /^\d{4}-\d{2}-\d{2}$/.test(task.due || "") ? task.due : "",
          label: text(task.label, 30),
          order: Number.isFinite(task.order) ? task.order : (taskIndex + 1) * 1000,
        };
      });
      for (const column of columns) {
        tasks
          .filter((task) => task.columnId === column.id)
          .sort((a, b) => a.order - b.order)
          .forEach((task, index) => { task.order = (index + 1) * 1000; });
      }
      return {
        id: projectId,
        parentId: text(raw.parentId, 100),
        name: requiredText(raw.name, 50, `Projekt ${projectIndex + 1}`),
        description: text(raw.description, 120),
        goal: text(raw.goal, 160),
        columns,
        tasks,
      };
    });

    if (!projects.length) {
      report.push("Keine gültigen Projekte gefunden; Standarddaten wurden verwendet.");
      if (Array.isArray(fallbackSource.projects) && fallbackSource.projects.length) {
        const recovered = validateState(fallbackSource, {});
        return { state: recovered.state, report: [...report, ...recovered.report] };
      }
      const projectId = id();
      const columnId = id();
      return {
        state: {
          schemaVersion: SCHEMA_VERSION,
          active: projectId,
          projects: [{
            id: projectId,
            name: "Mein Projekt",
            description: "",
            goal: "",
            columns: [{ id: columnId, name: "Aufgaben", done: false }],
            tasks: [],
          }],
          trash: [],
        },
        report,
      };
    }

    const projectIds = new Set(projects.map((project) => project.id));
    const wouldCreateProjectCycle = (projectId, parentId) => {
      const seen = new Set([projectId]);
      let cursor = parentId;
      while (cursor) {
        if (seen.has(cursor)) return true;
        seen.add(cursor);
        cursor = projects.find((project) => project.id === cursor)?.parentId || "";
      }
      return false;
    };
    for (const project of projects) {
      if (!projectIds.has(project.parentId) || project.parentId === project.id || wouldCreateProjectCycle(project.id, project.parentId)) {
        project.parentId = "";
      }
    }
    const active = projectIds.has(source.active) ? source.active : projects[0].id;
    const trash = Array.isArray(source.trash)
      ? source.trash.filter((item) => item && typeof item === "object").slice(0, 1000)
      : [];

    if (source.schemaVersion !== SCHEMA_VERSION) report.push(`Daten auf Schema ${SCHEMA_VERSION} migriert.`);
    if (rawProjects.length !== projects.length) report.push("Ungültige oder überzählige Projekte wurden entfernt.");

    return {
      state: { schemaVersion: SCHEMA_VERSION, active, projects, trash },
      report,
    };
  }

  return { SCHEMA_VERSION, validateState };
});
