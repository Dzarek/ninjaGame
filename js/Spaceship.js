import { Missile } from "./Missile.js";

export class Spaceship {
  missiles = [];
  #modifier = 7;
  #leftArrow = false;
  #rightArrow = false;
  #upArrow = false;
  #downArrow = false;

  constructor(element, container) {
    this.element = element;
    this.container = container;
  }

  init() {
    this.setPosition();
    this.#eventListeners();
    this.#gameLoop();
  }
  setPosition() {
    this.element.style.bottom = `${
      window.innerHeight / 2 - this.#getPosition()
    }px`;
    this.element.style.left = "50px";
  }
  #getPosition() {
    return this.element.offsetLeft + this.element.offsetWidth / 2;
  }

  #eventListeners() {
    const btnS = document.createElement("button");
    this.container.appendChild(btnS);
    btnS.classList.add("shoot");
    btnS.style.backgroundImage = "url(images/star.png)";
    btnS.addEventListener("touchstart", (event) => {
      event.stopPropagation();
      event.preventDefault();
      btnS.style.opacity = 0.7;
      this.#shot();
    });
    btnS.addEventListener("touchend", () => {
      btnS.style.opacity = 1;
    });

    const leftMove = document.createElement("button");
    this.container.appendChild(leftMove);
    leftMove.classList.add("leftMove");
    leftMove.style.backgroundImage = "url(images/1.png)";
    leftMove.addEventListener("touchstart", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.#leftArrow = true;
      leftMove.style.opacity = 0.7;
    });
    leftMove.addEventListener("touchend", () => {
      this.#leftArrow = false;
      leftMove.style.opacity = 1;
    });

    const rightMove = document.createElement("button");
    this.container.appendChild(rightMove);
    rightMove.classList.add("rightMove");
    // rightMove.innerHTML = "R";
    rightMove.style.backgroundImage = "url(images/1.png)";
    rightMove.addEventListener("touchstart", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.#rightArrow = true;
      rightMove.style.opacity = 0.7;
    });
    rightMove.addEventListener("touchend", () => {
      this.#rightArrow = false;
      rightMove.style.opacity = 1;
    });

    const upMove = document.createElement("button");
    this.container.appendChild(upMove);
    upMove.classList.add("upMove");
    upMove.style.backgroundImage = "url(images/1.png)";
    upMove.addEventListener("touchstart", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.#upArrow = true;
      upMove.style.opacity = 0.7;
    });
    upMove.addEventListener("touchend", () => {
      this.#upArrow = false;
      upMove.style.opacity = 1;
    });

    const downMove = document.createElement("button");
    this.container.appendChild(downMove);
    downMove.classList.add("downMove");
    downMove.style.backgroundImage = "url(images/1.png)";
    downMove.addEventListener("touchstart", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.#downArrow = true;
      downMove.style.opacity = 0.7;
    });
    downMove.addEventListener("touchend", () => {
      this.#downArrow = false;
      downMove.style.opacity = 1;
    });

    window.addEventListener("keydown", ({ keyCode }) => {
      switch (keyCode) {
        case 37:
          this.#leftArrow = true;
          break;
        case 39:
          this.#rightArrow = true;
          break;
        case 38:
          this.#upArrow = true;
          break;
        case 40:
          this.#downArrow = true;
          break;
      }
    });
    window.addEventListener("keyup", ({ keyCode }) => {
      switch (keyCode) {
        case 32:
          this.#shot();
          break;
        case 37:
          this.#leftArrow = false;
          break;
        case 39:
          this.#rightArrow = false;
          break;
        case 38:
          this.#upArrow = false;
          break;
        case 40:
          this.#downArrow = false;
          break;
      }
    });
  }
  #gameLoop = () => {
    this.#whatKey();
    requestAnimationFrame(this.#gameLoop);
  };
  #whatKey() {
    if (this.#leftArrow && this.#getPosition() > 12) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) - this.#modifier
      }px`;
    }
    if (this.#rightArrow && this.#getPosition() + 100 < window.innerWidth) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) + this.#modifier
      }px`;
    }
    if (
      this.#upArrow &&
      this.element.offsetTop > window.innerHeight / window.innerHeight
    ) {
      this.element.style.bottom = `${
        parseInt(this.element.style.bottom, 10) + this.#modifier
      }px`;
    }
    if (this.#downArrow && this.element.style.bottom > "0px") {
      this.element.style.bottom = `${
        parseInt(this.element.style.bottom, 10) - this.#modifier
      }px`;
    }
  }

  #shot() {
    const missile = new Missile(
      this.#getPosition(),
      this.element.offsetTop,
      this.container
    );
    if (this.missiles.length < 10) {
      missile.init();
      this.missiles.push(missile);
    }
  }
}
