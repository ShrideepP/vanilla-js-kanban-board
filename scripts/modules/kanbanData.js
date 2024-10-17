const columnItems = getColumnItemsFromLS();

const columnNames = ["to-do", "in-progress", "done"];

function getColumnItemsFromLS() {
  const columnItemsFromLS = localStorage.getItem("columnItems");
  return JSON.parse(columnItemsFromLS) ?? [];
}

function setColumnItemsInLS(id, value, group) {
  columnItems.push({ id, value, group });
  localStorage.setItem("columnItems", JSON.stringify(columnItems));
}

function removeColumnItemsInLS() {}

export { columnItems, columnNames, setColumnItemsInLS, removeColumnItemsInLS };
