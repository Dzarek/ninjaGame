export class Missile {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.container = container;
    this.element = document.createElement("div");
    this.interval = null;
  }

  init() {
    this.element.classList.add("missile");
    this.container.appendChild(this.element);
    this.element.style.left = `${this.x - this.element.offsetWidth / 8}px`;
    this.element.style.top = `${this.y - this.element.offsetHeight + 80}px`;
    this.interval = setInterval(
      () => (this.element.style.left = `${this.element.offsetLeft + 2}px`),
      5
    );
  }

  remove() {
    clearInterval(this.interval);
    this.element.remove();
  }
}
