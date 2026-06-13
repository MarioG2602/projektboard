(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ProjectboardSync = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const clone = (value) => value === undefined ? undefined : structuredClone(value);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const ids = (items) => (Array.isArray(items) ? items : []).map((item) => item?.id).filter(Boolean);

  function choose(base, local, remote) {
    if (same(local, base)) return clone(remote);
    if (same(remote, base)) return clone(local);
    return clone(local);
  }

  function mergeArray(baseItems, localItems, remoteItems, mergeItem) {
    const base = Array.isArray(baseItems) ? baseItems : [];
    const local = Array.isArray(localItems) ? localItems : [];
    const remote = Array.isArray(remoteItems) ? remoteItems : [];
    const baseMap = new Map(base.map((item) => [item.id, item]));
    const localMap = new Map(local.map((item) => [item.id, item]));
    const remoteMap = new Map(remote.map((item) => [item.id, item]));
    const allIds = new Set([...baseMap.keys(), ...localMap.keys(), ...remoteMap.keys()]);
    const merged = new Map();

    for (const id of allIds) {
      const b = baseMap.get(id), l = localMap.get(id), r = remoteMap.get(id);
      if (!l && !r) continue;
      if (!b) {
        merged.set(id, l && r ? mergeItem(undefined, l, r) : clone(l || r));
        continue;
      }
      if (!l) {
        if (!same(r, b)) merged.set(id, clone(r));
        continue;
      }
      if (!r) {
        if (!same(l, b)) merged.set(id, clone(l));
        continue;
      }
      merged.set(id, mergeItem(b, l, r));
    }

    const preferred = same(ids(local), ids(base)) ? ids(remote) : ids(local);
    return [...preferred, ...ids(remote), ...ids(local)]
      .filter((id, index, order) => order.indexOf(id) === index && merged.has(id))
      .map((id) => merged.get(id));
  }

  function mergeFields(base, local, remote, excluded = []) {
    const result = {};
    const keys = new Set([
      ...Object.keys(base || {}),
      ...Object.keys(local || {}),
      ...Object.keys(remote || {}),
    ]);
    for (const key of keys) {
      if (!excluded.includes(key)) result[key] = choose(base?.[key], local?.[key], remote?.[key]);
    }
    return result;
  }

  function mergeTask(base, local, remote) {
    return mergeFields(base, local, remote);
  }

  function mergeColumn(base, local, remote) {
    return mergeFields(base, local, remote);
  }

  function mergeProject(base, local, remote) {
    return {
      ...mergeFields(base, local, remote, ["columns", "tasks"]),
      columns: mergeArray(base?.columns, local?.columns, remote?.columns, mergeColumn),
      tasks: mergeArray(base?.tasks, local?.tasks, remote?.tasks, mergeTask),
    };
  }

  function mergeTrash(base, local, remote) {
    return mergeArray(base, local, remote, (b, l, r) => choose(b, l, r));
  }

  function mergeStates(base, local, remote) {
    const b = base && typeof base === "object" ? base : {};
    const l = local && typeof local === "object" ? local : {};
    const r = remote && typeof remote === "object" ? remote : {};
    return {
      ...mergeFields(b, l, r, ["projects", "trash"]),
      active: choose(b.active, l.active, r.active),
      projects: mergeArray(b.projects, l.projects, r.projects, mergeProject),
      trash: mergeTrash(b.trash, l.trash, r.trash),
    };
  }

  return { mergeStates };
});
