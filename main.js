"use strict";

const segmentItems = getItemsFromLS();

function getItemsFromLS() {
  const items = localStorage.getItem("segmentItems");
  return JSON.parse(items) ?? [];
}

function setItemsInLS(id = String(Math.random()), text, segment) {
  segmentItems.push({ id, text, segment });
  localStorage.setItem("segmentItems", JSON.stringify(segmentItems));
  renderSegmentItems();
}

function removeItemsFromLS(id) {
  const segmentItemIndex = segmentItems.findIndex(
    (segmentItem) => segmentItem?.id === id
  );

  segmentItemIndex !== -1
    ? segmentItems.splice(segmentItemIndex, 1)
    : alert(`Segment item with id ${id} not found`);

  localStorage.setItem("segmentItems", JSON.stringify(segmentItems));
  renderSegmentItems();
}

const segmentContents = document.querySelectorAll(
  ".main-container__segment-content"
);

function renderSegmentItems() {
  segmentContents.forEach(function (segmentContent) {
    const segmentContentDataset = segmentContent.dataset?.segment;
    segmentContent.replaceChildren();

    segmentItems.forEach(function (segmentItem) {
      const segmentItemDataset = segmentItem?.segment;
      const segmentContentItem = document
        .querySelector(".main-container__segment-content-item-template")
        .content.cloneNode(true);

      if (segmentContentDataset !== segmentItemDataset) return;

      segmentContentItem.firstElementChild.dataset.id = segmentItem?.id;

      segmentContentItem.firstElementChild.addEventListener(
        "dragstart",
        function (e) {
          e.currentTarget.classList.add("dragging");
        }
      );

      segmentContentItem.firstElementChild.addEventListener(
        "dragend",
        function (e) {
          e.currentTarget.classList.remove("dragging");
        }
      );

      segmentContentItem.querySelector(
        ".main-container__segment-content-item-text"
      ).innerText = segmentItem?.text;

      const removeBtn = segmentContentItem.querySelector(
        ".main-container__segment-content-item-button"
      );

      removeBtn.dataset.id = segmentItem?.id;

      removeBtn.addEventListener("click", function () {
        removeItemsFromLS(removeBtn.dataset?.id);
      });

      segmentContent.append(segmentContentItem);
    });
  });
}

renderSegmentItems();

const segments = document.querySelectorAll(".main-container__segment");

const addBtns = document.querySelectorAll(
  ".main-container__segment-header-button"
);

for (const addBtn of addBtns) {
  const addBtnDataset = addBtn.dataset?.segment;
  addBtn.addEventListener("click", function () {
    for (const segment of segments) {
      const segmentDataset = segment.dataset?.segment;
      if (addBtnDataset !== segmentDataset) continue;

      const segmentFooter = document
        .querySelector(".main-container__segment-footer-template")
        .content.cloneNode(true);
      const segmentFooterInput = segmentFooter.querySelector(
        ".main-container__segment-footer-input"
      );

      segment.append(segmentFooter);
      segmentFooterInput.focus();

      segmentFooterInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          const text = segmentFooterInput?.value;
          if (!text.length) return alert("Error: Input cannot be empty!");
          setItemsInLS(undefined, text, segmentDataset);
          segmentFooterInput.value = "";
          segment.removeChild(segment.lastElementChild);
        }
      });

      break;
    }
  });
}

segments.forEach(function (segment) {
  segment.addEventListener("dragover", function (e) {
    e.preventDefault();

    const segmentContent = segment.querySelector(
      ".main-container__segment-content"
    );

    const draggingElement = document.querySelector(".dragging");
    const draggingElementId = draggingElement.dataset?.id;

    const segmentItem = segmentItems.find(function (segmentItem) {
      return segmentItem?.id === draggingElementId;
    });
    segmentItem.segment = segmentContent.dataset?.segment;

    const afterElement = getDragAfterElement(segmentContent, e.clientY);

    localStorage.setItem("segmentItems", JSON.stringify(segmentItems));
    !afterElement
      ? segmentContent.append(draggingElement)
      : segmentContent.insertBefore(draggingElement, afterElement);
  });
});

function getDragAfterElement(container, y) {
  const segmentContentItems = [
    ...container.querySelectorAll(
      ".main-container__segment-content-item:not(.dragging)"
    ),
  ];

  return segmentContentItems.reduce(
    function (acc, curr) {
      const item = curr.getBoundingClientRect();
      const offset = y - item.top - item.height / 2;

      if (offset < 0 && offset > acc.offset) {
        return { offset, element: curr };
      } else {
        return acc;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}
