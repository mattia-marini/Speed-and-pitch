console.log("Content script loaded");

class DraggableElement {
  constructor(element) {
    this.element = element;
    this.dragging = false;
    this.initialXInElement = null;
    this.initialYInElement = null;

    this.element.addEventListener("mousedown", this.mouseDown.bind(this));
    document.addEventListener("mousemove", this.mouseMove.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));
  }

  mouseDown = (e) => {
    e.preventDefault();
    this.dragging = true;

    const rect = this.element.getBoundingClientRect();
    this.initialXInElement = e.clientX - rect.left;
    this.initialYInElement = e.clientY - rect.top;

    console.log("Mouse DOWN");
    console.log(this.initialXInElement, this.initialYInElement);
  };

  mouseMove = (e) => {
    console.log("Mouse MOVE");
    if (this.dragging) {
      const offsetX = e.clientX - this.initialXInElement;
      const offsetY = e.clientY - this.initialYInElement;

      console.log(offsetX, offsetY);

      this.element.style.left = offsetX + "px";
      this.element.style.top = offsetY + "px";
    }
  };

  mouseUp = () => {
    console.log("Mouse UP");
    this.dragging = false;
    this.initialXInElement = null;
    this.initialYInElement = null;
  };
}

function makeElementDraggable(draggableElement, parentElement) {}

function createDiv(parentElement) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.background = "rgba(255, 255, 255, 0.8)";
  div.style.padding = "10px";
  div.style.border = "1px solid black";
  div.style.zIndex = "9999";
  div.style.cursor = "move";
  div.innerText = "Draggable element";

  return div;
}

function init() {
  const mediaElements = document.querySelectorAll("video, audio");
  mediaElements.forEach((element) => {
    console.log(element);
    let div = createDiv();
    let boundingRect = element.getBoundingClientRect();

    div.style.top = boundingRect.top + "px";
    div.style.left = boundingRect.left + "px";

    console.log("Bounding rect:");
    console.log(boundingRect);

    setInterval(() => {
      // console.log(`Bounding rect: `);
      // console.log(element.getBoundingClientRect());
    }, 100);

    document.body.appendChild(new DraggableElement(div).element);
  });
}

window.addEventListener("load", () => {
  console.log("DIO cane");
  init();
});

if (document) {
  if (document.readyState === "complete") {
    init();
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === "complete") {
        init();
      }
    };
  }
}
