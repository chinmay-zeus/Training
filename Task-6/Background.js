export class Background {
  constructor() {
    this.element = document.createElement("div");
    this.element.style.position = "relative";
    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.element.style.backgroundColor = "#f0f0f0";
    document.body.appendChild(this.element);

    this.updateBounds();
    window.addEventListener("resize", () => this.updateBounds());
  }

  updateBounds() {
    this.bounds = this.element.getBoundingClientRect();
  }

  getElement() {
    return this.element;
  }

  getBounds() {
    return this.bounds = this.element.getBoundingClientRect();
  }
}
