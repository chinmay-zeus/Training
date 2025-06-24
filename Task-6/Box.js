export class Box {
  constructor(background) {
    this.parent = background.getElement();
    this.getParentBounds = () => background.getBounds();
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;

    this.element = document.createElement("div");
    this.element.style.width = "50px";
    this.element.style.height = "50px";
    this.element.style.backgroundColor = "#1f7a54";
    this.element.style.position = "absolute";
    this.element.style.cursor = "grab"
    this.element.style.touchAction = "none";

    this.parent.appendChild(this.element);
    this.addListeners();
    window.addEventListener("resize", () => this.keepInBounds());
  }

  addListeners() {
    this.element.addEventListener("pointerdown", this.onPointerDown.bind(this));
    this.element.addEventListener("pointermove", this.onPointerMove.bind(this));
    this.element.addEventListener("pointerup", this.onPointerUp.bind(this));
    this.element.addEventListener("pointercancel", this.onPointerUp.bind(this));
  }

  onPointerDown(e) {
    this.isDragging = true;
    this.offsetX = e.clientX - this.element.offsetLeft;
    this.offsetY = e.clientY - this.element.offsetTop;
    this.element.setPointerCapture(e.pointerId);
  }

  onPointerMove(e) {
    if (!this.isDragging) return;

    const bounds = this.getParentBounds();
    let newX = e.clientX - this.offsetX;
    let newY = e.clientY - this.offsetY;

    newX = Math.max(0, Math.min(bounds.width - this.element.offsetWidth, newX));
    newY = Math.max(0, Math.min(bounds.height - this.element.offsetHeight, newY));

    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }

  onPointerUp(e) {
    this.isDragging = false;
    this.element.releasePointerCapture(e.pointerId);
  }

  keepInBounds() {
    const bounds = this.getParentBounds();

    let currentX = this.element.offsetLeft;
    let currentY = this.element.offsetTop;

    let maxX = bounds.width - this.element.offsetWidth;
    let maxY = bounds.height - this.element.offsetHeight;

    let clampedX = Math.max(0, Math.min(currentX, maxX));
    let clampedY = Math.max(0, Math.min(currentY, maxY));

    this.element.style.left = `${clampedX}px`;
    this.element.style.top = `${clampedY}px`;
  }
}
