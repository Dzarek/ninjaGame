export class Enemy {
  constructor(container, intervalTime, enemyClass, explosionClass, lives = 1) {
    this.container = container;
    this.element = document.createElement("div");
    this.enemyClass = enemyClass;
    this.explosionClass = explosionClass;
    this.interval = null;
    this.intervalTime = intervalTime;
    this.lives = lives;
  }
  init() {
    this.setEnemy();
    this.updatePosition();
  }
  setEnemy() {
    this.element.classList.add(this.enemyClass);
    this.container.appendChild(this.element);
    this.element.style.bottom = `${this.randomPosition()}px`; //!!! od dołu liczy
    this.element.style.right = "20px";
  }

  randomPosition() {
    return Math.floor(
      Math.random() * (window.innerHeight * 0.9 - this.element.offsetHeight)
    );
  }
  updatePosition() {
    this.interval = setInterval(() => this.setNewPosition(), this.intervalTime);
  }
  setNewPosition() {
    this.element.style.left = `${this.element.offsetLeft - 1}px`;
  }
  hit() {
    this.lives--;
    if (!this.lives) {
      this.explode();
    }
  }
  explode() {
    this.element.classList.remove(this.enemyClass);
    this.element.classList.add(this.explosionClass);
    clearInterval(this.interval);
    const animationTime = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--explosion-animation-time"
      ),
      10
    );
    setTimeout(() => this.element.remove(), animationTime);
  }
}
