import { Spaceship } from "./Spaceship.js";
import { Enemy } from "./Enemy.js";

class Game {
  #htmlELements = {
    spaceship: document.querySelector("[data-spaceship]"),
    container: document.querySelector("[data-container]"),
    score: document.querySelector("[data-score]"),
    lives: document.querySelector("[data-lives]"),
    modal: document.querySelector("[data-modal]"),
    scoreInfo: document.querySelector("[data-score-info]"),
    button: document.querySelector("[data-button]"),
  };
  #ship = new Spaceship(
    this.#htmlELements.spaceship,
    this.#htmlELements.container
  );
  #enemies = [];
  #lives = null;
  #score = null;
  #enemiesInterval = null;
  #checkPositionInterval = null;
  #createEnemyInterval = null;

  init() {
    this.#ship.init();
    this.#newGame();
    // this.#htmlELements.button.addEventListener(
    //   "click",
    //   () => (window.location = "index.html")
    // );
  }

  #newGame() {
    this.#htmlELements.modal.classList.add("hide");
    this.#enemiesInterval = 20;
    this.#lives = 3;
    this.#score = 0;
    this.#updateLivesText();
    this.#updateScoreText();
    this.#ship.element.style.left = "0px";
    this.#ship.setPosition();
    this.#createEnemyInterval = setInterval(() => this.#randomNewEnemy(), 1400);
    this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
    snd.play();
  }

  #endGame() {
    // this.#htmlELements.modal.classList.remove("hide");
    // this.#htmlELements.scoreInfo.textContent = `Zombie Cię zeżarły...  Twój wynik to: ${
    //   this.#score
    // } punktów`;
    // this.#enemies.forEach((enemy) => enemy.explode());
    // this.#enemies.length = 0;
    // clearInterval(this.#createEnemyInterval);
    // clearInterval(this.#checkPositionInterval);
    // snd.pause();
    // this.#htmlELements.container.classList.remove("earthquake");
    localStorage.setItem("mostRecentScore", this.#score);
    return window.location.assign("end.html");
  }

  #winGame() {
    // this.#enemies.forEach((enemy) => enemy.explode());
    // this.#enemies.length = 0;
    // clearInterval(this.#createEnemyInterval);
    // clearInterval(this.#checkPositionInterval);
    // this.#htmlELements.modal.classList.remove("hide");
    // this.#htmlELements.modal.style.opacity = ".9";
    // this.#htmlELements.scoreInfo.textContent = `Pokonałeś króla zombiaków! Jesteś prawdziwym ninja! :)`;
    // snd.pause();
    // this.#htmlELements.container.classList.remove("earthquake");
    localStorage.setItem("mostRecentScore", this.#score);
    return window.location.assign("end.html");
  }

  #randomNewEnemy() {
    if (this.#score < 100 || (this.#score >= 150 && this.#score < 250)) {
      this.#htmlELements.container.style.backgroundImage =
        "url(./images/city.png)";

      const randomNumber2 = Math.floor(Math.random() * 10) + 1;
      const randomNumber = Math.floor(Math.random() * 3) + 1;

      randomNumber2 % 10
        ? randomNumber % 3
          ? this.#createNewEnemy(
              this.#htmlELements.container,
              this.#enemiesInterval,
              "enemy",
              "explosion"
            )
          : this.#createNewEnemy(
              this.#htmlELements.container,
              this.#enemiesInterval * 1.5,
              "enemy--big",
              "explosion--big",
              3
            )
        : this.#createNewEnemy(
            this.#htmlELements.container,
            this.#enemiesInterval * 2.5,
            "enemy--huge",
            "explosion--huge",
            10
          );
    }
    if (this.#score >= 150 && this.#score < 250) {
      this.#enemiesInterval = 10;
      this.#createNewEnemy(
        this.#htmlELements.container,
        this.#enemiesInterval * 0.5,
        "enemy-red",
        "explosion"
      );
    }
    if (this.#score >= 100 && this.#score < 150) {
      this.#htmlELements.container.style.backgroundImage = "none";
      this.#htmlELements.container.style.backgroundColor = "black";
      this.#createNewEnemy(
        this.#htmlELements.container,
        this.#enemiesInterval,
        "ghost",
        "explosion--bigBlue",
        3
      );
    }
    if (this.#score >= 250) {
      this.#htmlELements.container.style.animation = "none";
      // this.#htmlELements.container.classList.add("quake");
      snd.pause();
      sndu.play();
    }
  }
  #createNewEnemy(...params) {
    const enemy = new Enemy(...params);
    if (this.#enemies.length < 10) {
      enemy.init();
      this.#enemies.push(enemy);
    }
  }

  #checkPosition() {
    this.#enemies.forEach((enemy, enemyIndex, enemiesArr) => {
      const enemyPosition = {
        top: enemy.element.offsetTop,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        left: enemy.element.offsetLeft,
      };
      const shipPosition = {
        top: this.#ship.element.offsetTop,
        right: this.#ship.element.offsetLeft + this.#ship.element.offsetWidth,
        bottom: this.#ship.element.offsetTop + this.#ship.element.offsetHeight,
        left: this.#ship.element.offsetLeft,
      };
      if (
        enemyPosition.left < 0 ||
        (shipPosition.bottom >= enemyPosition.top &&
          shipPosition.top <= enemyPosition.bottom &&
          shipPosition.right >= enemyPosition.left &&
          shipPosition.left <= enemyPosition.right)
      ) {
        enemy.explode();
        enemiesArr.splice(enemyIndex, 1);
        this.#updateLives();
      }
      this.#ship.missiles.forEach((missile, missileIndex, missileArr) => {
        const missilePosition = {
          top: missile.element.offsetTop,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
        };
        if (
          missilePosition.bottom >= enemyPosition.top &&
          missilePosition.top <= enemyPosition.bottom &&
          missilePosition.right >= enemyPosition.left &&
          missilePosition.left <= enemyPosition.right
        ) {
          enemy.hit();
          if (!enemy.lives) {
            enemiesArr.splice(enemyIndex, 1);
          }
          missile.remove();
          missileArr.splice(missileIndex, 1);
          this.#updateScore();
        }
        if (missilePosition.left > window.innerWidth) {
          missile.remove();
          missileArr.splice(missileIndex, 1);
        }
      });
    });
  }

  #updateScore() {
    this.#score++;
    if (!(this.#score % 10)) {
      this.#enemiesInterval--;
    }

    this.#updateScoreText();
    if (!(this.#score % 100)) {
      this.#livesPlus();
    }
    this.#updateScoreText();

    if (this.#score == 250) {
      this.#bossEnemy();
    }

    if (this.#score > 250) {
      this.#enemyShot();
    }
    if (this.#score == 300) {
      // this.#htmlELements.container.classList.remove("earthquake");
      this.#enemies.forEach((enemy) => enemy.explode());
      this.#enemies.length = 0;
      clearInterval(this.#createEnemyInterval);
      clearInterval(this.#checkPositionInterval);
      this.#htmlELements.container.style.backgroundImage =
        "url(./images/explode.gif)";
      setTimeout(() => this.#winGame(), 2000);
    }
  }
  #bossEnemy() {
    this.#createNewEnemy(
      this.#htmlELements.container,
      (this.#enemiesInterval = 50),
      "enemy--boss",
      "explosion--boss",
      50
    );
  }

  #enemyShot() {
    if (this.#enemies.length < 4) {
      this.#createNewEnemy(
        this.#htmlELements.container,
        (this.#enemiesInterval = 10),
        "enemy--shot",
        "explosion"
      );
    }
  }

  #livesPlus() {
    this.#lives++;
    this.#updateLivesText();
  }

  #updateLives() {
    this.#lives--;
    this.#updateLivesText();
    this.#htmlELements.container.classList.add("hit");
    setTimeout(() => this.#htmlELements.container.classList.remove("hit"), 100);
    if (!this.#lives) {
      this.#endGame();
    }
  }
  #updateScoreText() {
    this.#htmlELements.score.textContent = `Score: ${this.#score}`;
  }
  #updateLivesText() {
    this.#htmlELements.lives.textContent = `Lives: ${this.#lives}`;
  }
}

window.onload = function () {
  const game = new Game();
  game.init();
};
const sndu = new Audio("./images/musicFight.mp3");
const snd = new Audio("./images/music.mp3");
snd.loop = true;
snd.autoplay = true;
document.getElementById("bstop").addEventListener("click", () => {
  snd.pause();
});
document.getElementById("bplay").addEventListener("click", () => {
  snd.play();
});
