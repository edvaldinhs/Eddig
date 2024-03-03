const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;

class InputListener {
  constructor(game) {
    this.game = game;
    this.keysPressed = new Set();
    this.keyReleased = new Set();

    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      this.keysPressed.add(e.key);
      if (e.key === "c" && !this.game.player.isCPressed) {
        this.game.player.isCPressed = true;
        this.game.player.frameX = 0;
      }
      this.game.atualizarTeclas(this.keysPressed);
    });

    window.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key);
      this.keyReleased.add(e.key);
      this.game.atualizarTeclas(this.keysPressed);
    });

    const upButton = document.querySelector("#up");
    const downButton = document.querySelector("#down");
    const leftButton = document.querySelector("#left");
    const rightButton = document.querySelector("#right");
    const cButton = document.querySelector("#c");

    upButton.addEventListener("mousedown", () =>
      this.simulateKeyPress("ArrowUp")
    );
    downButton.addEventListener("mousedown", () =>
      this.simulateKeyPress("ArrowDown")
    );
    leftButton.addEventListener("mousedown", () =>
      this.simulateKeyPress("ArrowLeft")
    );
    rightButton.addEventListener("mousedown", () =>
      this.simulateKeyPress("ArrowRight")
    );
    cButton.addEventListener("mousedown", () => this.simulateKeyPress("c"));

    upButton.addEventListener("touchstart", () =>
      this.simulateKeyPress("ArrowUp")
    );
    downButton.addEventListener("touchstart", () =>
      this.simulateKeyPress("ArrowDown")
    );
    leftButton.addEventListener("touchstart", () =>
      this.simulateKeyPress("ArrowLeft")
    );
    rightButton.addEventListener("touchstart", () =>
      this.simulateKeyPress("ArrowRight")
    );
    cButton.addEventListener("touchstart", () => this.simulateKeyPress("c"));

    upButton.addEventListener("mouseup", () =>
      this.simulateKeyRelease("ArrowUp")
    );
    downButton.addEventListener("mouseup", () =>
      this.simulateKeyRelease("ArrowDown")
    );
    leftButton.addEventListener("mouseup", () =>
      this.simulateKeyRelease("ArrowLeft")
    );
    rightButton.addEventListener("mouseup", () =>
      this.simulateKeyRelease("ArrowRight")
    );
    cButton.addEventListener("mouseup", () => this.simulateKeyRelease("c"));

    upButton.addEventListener("touchend", () =>
      this.simulateKeyRelease("ArrowUp")
    );
    downButton.addEventListener("touchend", () =>
      this.simulateKeyRelease("ArrowDown")
    );
    leftButton.addEventListener("touchend", () =>
      this.simulateKeyRelease("ArrowLeft")
    );
    rightButton.addEventListener("touchend", () =>
      this.simulateKeyRelease("ArrowRight")
    );
    cButton.addEventListener("touchend", () => this.simulateKeyRelease("c"));
  }

  simulateKeyPress(key) {
    const event = new KeyboardEvent("keydown", {
      key: key,
    });
    window.dispatchEvent(event);
  }

  simulateKeyRelease(key) {
    const event = new KeyboardEvent("keyup", {
      key: key,
    });
    window.dispatchEvent(event);
  }
}

class Player {
  constructor(game) {
    this.game = game;
    this.spriteWidth = 24;
    this.spriteHeight = 24;
    this.width = 95;
    this.height = 100;
    this.frameX = 0;
    this.frameY = 3;
    this.maxFrame = 9;
    this.frameDelay = 3.2;
    this.frameCount = 0;
    this.x = 200;
    this.y = 200;

    this.velX = 0;
    this.velY = 0;
    this.velMax = 10;

    this.sprite = document.getElementById("player");

    this.lastKey = 0;
    this.isCPressed = false;
    this.isIntersectingWithGrass = false;
  }

  draw(context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(
      this.sprite,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  setarVel(velX, velY) {
    this.velX = velX;
    this.velY = velY;
  }

  update() {
    if (this.isCPressed) {
      this.velX = 0;
      this.velY = 0;
      this.frameY = 8;
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.isCPressed = false;
          this.frameX = 0;
        }
      }
    } else {
      if (this.game.pressedKeys.has("ArrowLeft")) {
        this.velX = -this.velMax;
        this.frameY = 5;
        this.lastKey = 1;
      } else if (this.game.pressedKeys.has("ArrowRight")) {
        this.velX = this.velMax;
        this.frameY = 6;
        this.lastKey = 2;
      } else {
        this.velX = 0;
      }
      if (this.game.pressedKeys.has("ArrowUp")) {
        this.velY = -this.velMax;
        this.frameY = 7;
        this.lastKey = 3;
      } else if (this.game.pressedKeys.has("ArrowDown")) {
        this.velY = this.velMax;
        this.frameY = 4;
        this.lastKey = 0;
      } else {
        this.velY = 0;
      }
      if (this.velX === 0 && this.velY === 0) {
        if (this.frameY !== this.lastKey) {
          this.frameY = this.lastKey;
        }
      }
    }
    this.x += this.velX;
    this.y += this.velY;

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }

    if (this.y < this.game.topMargin) {
      this.y = this.game.topMargin;
    } else if (this.y > this.game.height - this.height) {
      this.y = this.game.height - this.height;
    }

    if (!this.isCPressed) {
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }
    }
  }
}

class Animal {
  constructor(game, x, y, name) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.sprite = document.querySelector(`#${name}`);
    this.spriteWidth = 16;
    this.spriteHeight = 16;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 3;
    this.frameDelay = 3.2;
    this.frameCount = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.speed = 1;
    this.moveCount = 0;
    this.maxMoveCount = Math.floor(Math.random() * 100) + 50;
    this.stopDuration = 60;
    this.stopped = false;
    this.originalY = y;
    this.jumpSpeed = 10;
    this.gravity = 0.5;
    this.jumping = true;
    this.setDirecaoAleatoria();
  }
  draw(context) {
    context.drawImage(
      this.sprite,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    if (this.jumping) {
      this.y -= this.jumpSpeed;
      this.jumpSpeed -= this.gravity;
      if (this.y >= this.originalY) {
        this.y = this.originalY;
        this.jumping = false;
      }
    } else {
      if (!this.stopped) {
        if (this.moveCount < this.maxMoveCount) {
          const nextX = this.x + this.directionX * this.speed;
          const nextY = this.y + this.directionY * this.speed;

          let withinBounds = false;
          for (let mato of this.game.matos) {
            if (
              nextX >= mato.x &&
              nextX <= mato.x + mato.width &&
              nextY >= mato.y &&
              nextY <= mato.y + mato.height
            ) {
              withinBounds = true;
              break;
            }
          }
          if (withinBounds) {
            this.x = nextX;
            this.y = nextY;
            this.moveCount++;
          } else {
            this.frameY = 5;

            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.setDirecaoAleatoria();
            }, 3000);
          }
        } else {
          this.directionX = 0;
          this.directionY = 0;
          this.stopped = true;

          setTimeout(() => {
            this.setDirecaoAleatoria();
          }, 3000);
        }
      } else {
        for (let mato of this.game.matos) {
          const distance = Math.sqrt(
            (this.x - mato.x) ** 2 + (this.y - mato.y) ** 2
          );
          if (distance <= 50) {
            this.setDirecaoAleatoria();
            break;
          }
        }
      }
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }

      if (this.directionX < 0) {
        this.frameY = 3;
      } else if (this.directionX > 0) {
        this.frameY = 1;
      } else if (this.directionY < 0) {
        this.frameY = 2;
      } else if (this.directionY > 0) {
        this.frameY = 0;
      }
    }
  }

  setDirecaoAleatoria() {
    this.stopped = false;
    this.directionX = Math.random() * 2 - 1;
    this.directionY = Math.random() * 2 - 1;
    const magnitude = Math.sqrt(this.directionX ** 2 + this.directionY ** 2);
    this.directionX /= magnitude;
    this.directionY /= magnitude;
    this.moveCount = 0;
    this.maxMoveCount = Math.floor(Math.random() * 100) + 50;
  }
}

window.addEventListener("load", () => {
  class Galinha extends Animal {
    constructor(game, x, y) {
      super(game, x, y, "galinha");
      this.frameY = 0;
      this.frameDelay = 3.2;
    }
    update() {
      if (this.jumping) {
        this.y -= this.jumpSpeed;
        this.jumpSpeed -= this.gravity;
        if (this.y >= this.originalY) {
          this.y = this.originalY;
          this.jumping = false;
        }
      } else {
        if (!this.stopped) {
          if (this.moveCount < this.maxMoveCount) {
            const nextX = this.x + this.directionX * this.speed;
            const nextY = this.y + this.directionY * this.speed;
            let withinBounds = false;
            for (let mato of this.game.matos) {
              if (
                nextX >= mato.x &&
                nextX <= mato.x + mato.width &&
                nextY >= mato.y &&
                nextY <= mato.y + mato.height
              ) {
                withinBounds = true;
                break;
              }
            }
            if (withinBounds) {
              this.x = nextX;
              this.y = nextY;
              this.moveCount++;
            } else {
              this.frameY = 6;

              this.directionX = 0;
              this.directionY = 0;
              this.stopped = true;

              setTimeout(() => {
                this.setDirecaoAleatoria();
              }, 3000);
            }
          } else {
            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.setDirecaoAleatoria();
            }, 3000);
          }
        } else {
          for (let mato of this.game.matos) {
            const distance = Math.sqrt(
              (this.x - mato.x) ** 2 + (this.y - mato.y) ** 2
            );
            if (distance <= 50) {
              this.setDirecaoAleatoria();
              break;
            }
          }
        }
        this.frameCount++;
        if (this.frameCount >= this.frameDelay) {
          this.frameCount = 0;
          if (this.frameX < this.maxFrame - 1) {
            this.frameX++;
          } else {
            this.frameX = 0;
          }
        }
        if (this.directionX < 0) {
          this.frameY = 3;
        } else if (this.directionX > 0) {
          this.frameY = 1;
        } else if (this.directionY < 0) {
          this.frameY = 2;
        } else if (this.directionY > 0) {
          this.frameY = 0;
        }
      }
    }
  }

  class Gato extends Animal {
    constructor(game, x, y) {
      super(game, x, y, "gato");
      this.width = 80;
      this.height = 80;
      this.spriteWidth = 32;
      this.spriteHeight = 32;
      this.frameY = 0;
      this.frameDelay = 6;
    }
    update() {
      if (this.jumping) {
        this.y -= this.jumpSpeed;
        this.jumpSpeed -= this.gravity;
        if (this.y >= this.originalY) {
          this.y = this.originalY;
          this.jumping = false;
        }
      } else {
        if (!this.stopped) {
          if (this.moveCount < this.maxMoveCount) {
            const nextX = this.x + this.directionX * this.speed;
            const nextY = this.y + this.directionY * this.speed;

            let withinBounds = false;
            for (let mato of this.game.matos) {
              if (
                nextX >= mato.x &&
                nextX <= mato.x + mato.width &&
                nextY >= mato.y &&
                nextY <= mato.y + mato.height
              ) {
                withinBounds = true;
                break;
              }
            }
            if (withinBounds) {
              this.x = nextX;
              this.y = nextY;
              this.moveCount++;
            } else {
              this.frameY = 5;

              this.directionX = 0;
              this.directionY = 0;
              this.stopped = true;

              setTimeout(() => {
                this.setDirecaoAleatoria();
              }, 3000);
            }
          } else {
            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.setDirecaoAleatoria();
            }, 3000);
          }
        } else {
          for (let mato of this.game.matos) {
            const distance = Math.sqrt(
              (this.x - mato.x) ** 2 + (this.y - mato.y) ** 2
            );
            if (distance <= 50) {
              this.setDirecaoAleatoria();
              break;
            }
          }
        }
        this.frameCount++;
        if (this.frameCount >= this.frameDelay) {
          this.frameCount = 0;
          if (this.frameX < this.maxFrame - 1) {
            this.frameX++;
          } else {
            this.frameX = 0;
          }
        }
        if (this.directionX < 0) {
          this.frameY = 3;
        } else if (this.directionX > 0) {
          this.frameY = 1;
        } else if (this.directionY < 0) {
          this.frameY = 2;
        } else if (this.directionY > 0) {
          this.frameY = 0;
        }
      }
    }
  }

  class Morcego extends Animal {
    constructor(game, x, y) {
      super(game, x, y, "morcego");
      this.width = 60;
      this.height = 60;
      this.spriteWidth = 17;
      this.spriteHeight = 17;
      this.frameY = 0;
      this.frameDelay = 6;
    }
    update() {
      if (this.jumping) {
        this.y -= this.jumpSpeed;
        this.jumpSpeed -= this.gravity;
        if (this.y >= this.originalY) {
          this.y = this.originalY;
          this.jumping = false;
        }
      } else {
        if (!this.stopped) {
          if (this.moveCount < this.maxMoveCount) {
            const nextX = this.x + this.directionX * this.speed;
            const nextY = this.y + this.directionY * this.speed;
            let withinBounds = false;
            for (let mato of this.game.matos) {
              if (
                nextX >= mato.x &&
                nextX <= mato.x + mato.width &&
                nextY >= mato.y &&
                nextY <= mato.y + mato.height
              ) {
                withinBounds = true;
                break;
              }
            }
            if (withinBounds) {
              this.x = nextX;
              this.y = nextY;
              this.moveCount++;
            } else {
              this.frameY = 0;

              this.directionX = 0;
              this.directionY = 0;
              this.stopped = true;

              setTimeout(() => {
                this.setDirecaoAleatoria();
              }, 3000);
            }
          } else {
            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.setDirecaoAleatoria();
            }, 3000);
          }
        } else {
          for (let mato of this.game.matos) {
            const distance = Math.sqrt(
              (this.x - mato.x) ** 2 + (this.y - mato.y) ** 2
            );
            if (distance <= 50) {
              this.setDirecaoAleatoria();
              break;
            }
          }
        }
        this.frameCount++;
        if (this.frameCount >= this.frameDelay) {
          this.frameCount = 0;
          if (this.frameX < this.maxFrame - 1) {
            this.frameX++;
          } else {
            this.frameX = 0;
          }
        }
        if (this.directionX < 0) {
          this.frameY = 0;
        } else if (this.directionX > 0) {
          this.frameY = 0;
        } else if (this.directionY < 0) {
          this.frameY = 0;
        } else if (this.directionY > 0) {
          this.frameY = 0;
        }
      }
    }
  }

  class Vaca extends Animal {
    constructor(game, x, y) {
      super(game, x, y, "vaca");
      this.width = 100;
      this.height = 100;
      this.spriteWidth = 32;
      this.spriteHeight = 32;
      this.frameY = 0;
      this.frameDelay = 6;
    }
    update() {
      if (this.jumping) {
        this.y -= this.jumpSpeed;
        this.jumpSpeed -= this.gravity;
        if (this.y >= this.originalY) {
          this.y = this.originalY;
          this.jumping = false;
        }
      } else {
        if (!this.stopped) {
          if (this.moveCount < this.maxMoveCount) {
            const nextX = this.x + this.directionX * this.speed;
            const nextY = this.y + this.directionY * this.speed;
            let withinBounds = false;
            for (let mato of this.game.matos) {
              if (
                nextX >= mato.x &&
                nextX <= mato.x + mato.width &&
                nextY >= mato.y &&
                nextY <= mato.y + mato.height
              ) {
                withinBounds = true;
                break;
              }
            }
            if (withinBounds) {
              this.x = nextX;
              this.y = nextY;
              this.moveCount++;
            } else {
              this.frameY = 4;
              this.directionX = 0;
              this.directionY = 0;
              this.stopped = true;
              setTimeout(() => {
                this.setDirecaoAleatoria();
              }, 3000);
            }
          } else {
            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;
            setTimeout(() => {
              this.setDirecaoAleatoria();
            }, 3000);
          }
        } else {
          for (let mato of this.game.matos) {
            const distance = Math.sqrt(
              (this.x - mato.x) ** 2 + (this.y - mato.y) ** 2
            );
            if (distance <= 50) {
              this.setDirecaoAleatoria();
              break;
            }
          }
        }
        this.frameCount++;
        if (this.frameCount >= this.frameDelay) {
          this.frameCount = 0;
          if (this.frameX < this.maxFrame - 1) {
            this.frameX++;
          } else {
            this.frameX = 0;
          }
        }
        if (this.directionX < 0) {
          this.frameY = 7;
        } else if (this.directionX > 0) {
          this.frameY = 1;
        } else if (this.directionY < 0) {
          this.frameY = 2;
        } else if (this.directionY > 0) {
          this.frameY = 0;
        }
      }
    }
  }

  class Pato extends Animal {
    constructor(game, x, y) {
      super(game, x, y, "pato");
    }
    update() {
      if (this.jumping) {
        this.y -= this.jumpSpeed;
        this.jumpSpeed -= this.gravity;
        if (this.y >= this.originalY) {
          this.y = this.originalY;
          this.jumping = false;
        }
      } else {
        if (!this.stopped) {
          if (this.moveCount < this.maxMoveCount) {
            const nextX = this.x + this.directionX * this.speed;
            const nextY = this.y + this.directionY * this.speed;
            let withinBounds = false;
            for (let mato of this.game.matos) {
              if (
                nextX >= mato.x &&
                nextX <= mato.x + mato.width &&
                nextY >= mato.y &&
                nextY <= mato.y + mato.height
              ) {
                withinBounds = true;
                break;
              }
            }
            if (withinBounds) {
              this.x = nextX;
              this.y = nextY;
              this.moveCount++;
            } else {
              this.frameY = 6;

              this.directionX = 0;
              this.directionY = 0;
              this.stopped = true;

              setTimeout(() => {
                this.setDirecaoAleatoria();
              }, 3000);
            }
          } else {
            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.setDirecaoAleatoria();
            }, 3000);
          }
        } else {
          for (let mato of this.game.matos) {
            const distance = Math.sqrt(
              (this.x - mato.x) ** 2 + (this.y - mato.y) ** 2
            );
            if (distance <= 50) {
              this.setDirecaoAleatoria();
              break;
            }
          }
        }
        this.frameCount++;
        if (this.frameCount >= this.frameDelay) {
          this.frameCount = 0;
          if (this.frameX < this.maxFrame - 1) {
            this.frameX++;
          } else {
            this.frameX = 0;
          }
        }
        if (this.directionX < 0) {
          this.frameY = 5;
        } else if (this.directionX > 0) {
          this.frameY = 1;
        } else if (this.directionY < 0) {
          this.frameY = 2;
        } else if (this.directionY > 0) {
          this.frameY = 0;
        }
      }
    }
  }

  class Fantasma extends Animal {
    constructor(game, x, y) {
      super(game, x, y, "fantasma");
      this.width = 66;
      this.height = 100;
      this.spriteWidth = 16;
      this.spriteHeight = 24;
      this.frameY = 0;
    }
  }

  class Objeto {
    constructor(game) {
      this.game = game;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {}
  }

  class Mato extends Objeto {
    constructor(game, row, col) {
      super(game);
      this.game = game;
      this.image = document.getElementById("mato");
      this.imageWidth = 130;
      this.imageHeight = 78;
      this.width = this.imageWidth;
      this.height = this.imageHeight;
      this.row = row;
      this.col = col;
      this.numeroAleatorio = null;
      this.interacted = false;
      this.calculatePosition();
    }
    gerarNumeroAleatorio() {
      return Math.floor(Math.random() * 6) + 1;
    }

    calculatePosition(index) {
      const gridSize = 170;
      const spacingX = 50;
      const maxCols = 4;
      const marginX =
        (this.game.width - maxCols * (gridSize + spacingX) + spacingX) / 2;
      const marginY =
        (this.game.height - 3 * gridSize) / 2 + this.game.topMargin;
      const col = index % maxCols;
      const row = Math.floor(index / maxCols);
      this.x = col * (gridSize + spacingX) + marginX;
      this.y = row * gridSize + marginY;
    }

    setnumeroAleatorio(pair) {
      if (pair) {
        this.numeroAleatorio = pair.value;
      } else {
        this.numeroAleatorio = this.gerarNumeroAleatorio();
      }
    }
    reset() {
      this.interacted = false;
    }
  }

  class Jogo {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.topMargin = 100;
      this.flips = 0;
      this.pontos = 0;
      this.pressedKeys = new Set();
      this.input = new InputListener(this);
      this.player = new Player(this);
      this.numeroDeMatos = 12;
      this.matos = [];
      this.gameObjects = [];
      this.animais = [];
      this.matoSelecionado = null;
      this.flipsWrapper = document.querySelector(".flips span");
      this.detections = 0;
      this.generatedAnimals = [];
      this.lastInteractedMatoNum = undefined;
      this.matoNeedingReset = undefined;
    }

    atualizarTeclas(teclas) {
      this.pressedKeys = teclas;
    }

    resetMatos() {
      for (let mato of this.matos) {
        mato.reset();
        this.interacted = false;
      }
      const lastInteractedMato = this.matos.find((mato) => mato.interacted);
      if (lastInteractedMato) {
        lastInteractedMato.interacted = false;
      }

      this.generatedAnimals = [];
    }

    detectarInteracaoEddy() {
      if (!this.excludedMatos) {
        this.excludedMatos = [];
      }

      const animalClasses = {
        1: Galinha,
        2: Gato,
        3: Pato,
        4: Vaca,
        5: Fantasma,
        6: Morcego,
      };

      for (let mato of this.matos) {
        if (
          !mato.interacted &&
          Math.abs(this.player.x - mato.x) <= this.player.width &&
          Math.abs(this.player.y - mato.y) <= this.player.height &&
          !this.waitingToDelete
        ) {
          if (this.player.isCPressed) {
            const AnimalClass = animalClasses[mato.numeroAleatorio];

            if (AnimalClass) {
              const animal = new AnimalClass(this, mato.x, mato.y);
              this.animais.push(animal);

              this.generatedAnimals.push({ animal, mato });
              mato.interacted = true;
            } else {
            }

            if (
              this.selectedMato &&
              this.selectedMato.numeroAleatorio !== mato.numeroAleatorio
            ) {
              this.detections++;
            }

            if (this.detections >= 1) {
              this.detections = 0;
              this.waitingToDelete = true;
              this.flips++;
              this.flipsWrapper.textContent = this.flips
                .toString()
                .padStart(2, "0");

              let generatedAnimalCount = this.generatedAnimals.length;
              setTimeout(() => {
                for (let i = 0; i < 2 && generatedAnimalCount > 0; i++) {
                  const { animal, mato: associatedMato } =
                    this.generatedAnimals.pop();
                  const index = this.animais.indexOf(animal);
                  if (index !== -1) {
                    this.animais.splice(index, 1);

                    animal.x = associatedMato.x;
                    animal.y = associatedMato.y;
                  }
                  generatedAnimalCount--;
                }
                this.waitingToDelete = false;
                this.matos.forEach((mato) => {
                  if (!this.excludedMatos.includes(mato)) {
                    mato.interacted = false;
                  }
                });
              }, 2000);
            }
            if (!this.selectedMato) {
              this.selectedMato = mato;
            } else {
              this.lastInteractedMatoNum = mato.numeroAleatorio;

              if (
                this.selectedMato.numeroAleatorio === this.lastInteractedMatoNum
              ) {
                this.excludedMatos.push(this.selectedMato);
                this.excludedMatos.push(mato);
                this.flips++;
                this.flipsWrapper.textContent = this.flips
                  .toString()
                  .padStart(2, "0");
              }
              this.selectedMato = null;
            }
            this.player.isCPressed = false;
          }
        }
      }
    }
    renderizar(context) {
      this.gameObjects = [...this.matos, ...this.animais, this.player];
      this.gameObjects.sort((a, b) => {
        return a.y + a.height - (b.y + b.height);
      });
      this.gameObjects.forEach((objeto) => {
        objeto.draw(context);
        if (objeto instanceof Player || objeto instanceof Animal) {
          objeto.update();
        }
      });
    }
    iniciar() {
      const values = [1, 2, 3, 4, 5, 6];
      const matosPerValue = 2;
      const shuffledValues = values.sort(() => Math.random() - 0.5);
      let matos = [];
      for (const value of shuffledValues) {
        for (let i = 0; i < matosPerValue; i++) {
          const mato = new Mato(this, 0, 0);
          mato.setnumeroAleatorio({ value: value });
          matos.push(mato);
        }
      }
      matos.sort(() => Math.random() - 0.5);
      let index = 0;
      for (const mato of matos) {
        mato.calculatePosition(index++);
        this.matos.push(mato);
      }
    }
  }
  const jogo = new Jogo(canvas.width, canvas.height);
  jogo.resetMatos();
  jogo.iniciar();
  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    jogo.detectarInteracaoEddy();
    jogo.renderizar(ctx);
    requestAnimationFrame(animar);
  }
  animar();
});
