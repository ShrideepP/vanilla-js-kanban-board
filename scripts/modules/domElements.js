import { columnItems, columnNames, setColumnItemsInLS } from "./kanbanData.js";

function renderColumnItems() {
  columnNames.forEach(function (columnName) {
    const column = document.querySelector(
      `#kanban__column-${columnName} .kanban__column-items`
    );

    column.replaceChildren();

    columnItems.forEach(function ({ value, group }) {
      const columnItem = document
        .getElementById("column-item-template")
        .content.cloneNode(true);

      if (columnName !== group) return;

      columnItem.querySelector("p").innerText = value;
      column.append(columnItem);
    });
  });
}

columnNames.forEach(function (columnName) {
  const columnFooter = document.querySelector(
    `#kanban__column-${columnName} .kanban__column-footer`
  );

  const addBtn = columnFooter.querySelector(".kanban__add-button");

  addBtn.addEventListener("click", function ({ target }) {
    const btn = target.closest("button");

    if (columnName !== btn.dataset.column || !btn) return;

    const columnInput = document
      .getElementById("column-input-template")
      .content.cloneNode(true);

    columnFooter.replaceChildren();
    columnFooter.appendChild(columnInput);

    columnFooter
      .querySelector("input")
      .addEventListener("change", function ({ target }) {
        columnFooter
          .querySelector(".kanban__check-button")
          .addEventListener("click", function () {
            setColumnItemsInLS(Math.random(), target.value, columnName);
            renderColumnItems();

            columnFooter.replaceChildren();
            columnFooter.appendChild(btn);
          });
      });
  });
});

export { renderColumnItems };
