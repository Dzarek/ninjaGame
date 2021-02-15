export class EnemyMissile {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.container = container;
    this.element = document.createElement("div");
    this.interval = null;
  }

  init() {
    this.element.classList.add("enemy--shot");
    this.container.appendChild(this.element);
    this.element.style.right = "20px";
    this.element.style.top = `${this.randomPosition()}px`;
    this.interval = setInterval(
      () => (this.element.style.top = `${this.element.offsetTop - 1}px`),
      5
    );
  }

  randomPosition() {
    return Math.floor(
      Math.random() * (window.innerHeight - this.element.offsetHeight)
    );
  }

  remove() {
    clearInterval(this.interval);
    this.element.remove();
  }
}
