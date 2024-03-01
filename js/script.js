window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    class ManipularInput {
        constructor(game) {
            this.game = game;
            this.keysPressed = new Set();
            this.keyReleased = new Set();
            console.log("manipulador criado!");
            window.addEventListener('keydown', e => {
                this.keysPressed.add(e.key);
                if (e.key === 'c' && !this.game.eddy.isCPressed) {
                    this.game.eddy.isCPressed = true;
                    this.game.eddy.frameX = 0;
                }
                this.game.atualizarTeclas(this.keysPressed);
            });
            window.addEventListener('keyup', e => {
                this.keysPressed.delete(e.key);
                this.keyReleased.add(e.key); // Add to released keys
                this.game.atualizarTeclas(this.keysPressed);
            });
        }
    }

    class Eddy {
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
            this.image = document.getElementById('edd');
            this.ultimaTecla = 0;
            this.isCPressed = false;
            this.isInteractingWithMato = false;
        }
        draw(context) {
            context.imageSmoothingEnabled = false;
            context.drawImage(
                this.image,
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
        runInteractionAnimation() {
            this.velX = 0;
            this.velY = 0;
            this.frameY = 8;
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
        update() {
            if (this.isCPressed) {
                // Para o movimento do boneco e gira ele
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
                // Se não apertou C, anda livremente.
                if (this.game.teclasPressionadas.has('ArrowLeft')) {
                    this.velX = -this.velMax;
                    this.frameY = 5;
                    this.ultimaTecla = 1;
                } else if (this.game.teclasPressionadas.has('ArrowRight')) {
                    this.velX = this.velMax;
                    this.frameY = 6;
                    this.ultimaTecla = 2;
                } else {
                    this.velX = 0;
                }
                if (this.game.teclasPressionadas.has('ArrowUp')) {
                    this.velY = -this.velMax;
                    this.frameY = 7;
                    this.ultimaTecla = 3;
                } else if (this.game.teclasPressionadas.has('ArrowDown')) {
                    this.velY = this.velMax;
                    this.frameY = 4;
                    this.ultimaTecla = 0;
                } else {
                    this.velY = 0;
                }
                if (this.velX === 0 && this.velY === 0) {
                    if (this.frameY !== this.ultimaTecla) {
                        this.frameY = this.ultimaTecla;
                    }
                }
            }
            this.x += this.velX;
            this.y += this.velY;
            // limites horizontais
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x > this.game.width - this.width) {
                this.x = this.game.width - this.width;
            }
            // limites verticais
            if (this.y < this.game.topMargin) {
                this.y = this.game.topMargin;
            } else if (this.y > this.game.height - this.height) {
                this.y = this.game.height - this.height;
            }
            //Animação. Esse código se repete em algumas partes do game.
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
        constructor(game, x, y, imageId) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 50;
            this.height = 50;
            this.image = document.getElementById(imageId);
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
                this.image,
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
                            if (nextX >= mato.x && nextX <= mato.x + mato.width &&
                                nextY >= mato.y && nextY <= mato.y + mato.height) {
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
                        const distance = Math.sqrt((this.x - mato.x) ** 2 + (this.y - mato.y) ** 2);
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
                    this.frameY = 3; // Left
                } else if (this.directionX > 0) {
                    this.frameY = 1; // Right
                } else if (this.directionY < 0) {
                    this.frameY = 2; // Up
                } else if (this.directionY > 0) {
                    this.frameY = 0; // Down
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
    class Galinha extends Animal {
        constructor(game, x, y) {
            super(game, x, y, 'galinha');
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
                            if (nextX >= mato.x && nextX <= mato.x + mato.width &&
                                nextY >= mato.y && nextY <= mato.y + mato.height) {
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
                        const distance = Math.sqrt((this.x - mato.x) ** 2 + (this.y - mato.y) ** 2);
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
                    this.frameY = 3; // Left
                } else if (this.directionX > 0) {
                    this.frameY = 1; // Right
                } else if (this.directionY < 0) {
                    this.frameY = 2; // Up
                } else if (this.directionY > 0) {
                    this.frameY = 0; // Down
                }
            }
        }
    }

    class Gato extends Animal {
        constructor(game, x, y) {
            super(game, x, y, 'gato');
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
                            if (nextX >= mato.x && nextX <= mato.x + mato.width &&
                                nextY >= mato.y && nextY <= mato.y + mato.height) {
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
                        const distance = Math.sqrt((this.x - mato.x) ** 2 + (this.y - mato.y) ** 2);
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
                    this.frameY = 3; // Left
                } else if (this.directionX > 0) {
                    this.frameY = 1; // Right
                } else if (this.directionY < 0) {
                    this.frameY = 2; // Up
                } else if (this.directionY > 0) {
                    this.frameY = 0; // Down
                }
            }
        }
    }
    class Morcego extends Animal {
        constructor(game, x, y) {
            super(game, x, y, 'morcego');
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
                            if (nextX >= mato.x && nextX <= mato.x + mato.width &&
                                nextY >= mato.y && nextY <= mato.y + mato.height) {
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
                        const distance = Math.sqrt((this.x - mato.x) ** 2 + (this.y - mato.y) ** 2);
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
                    this.frameY = 0; // Left
                } else if (this.directionX > 0) {
                    this.frameY = 0; // Right
                } else if (this.directionY < 0) {
                    this.frameY = 0; // Up
                } else if (this.directionY > 0) {
                    this.frameY = 0; // Down
                }
            }
        }
    }

    class Vaca extends Animal {
        constructor(game, x, y) {
            super(game, x, y, 'vaca');
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
                            if (nextX >= mato.x && nextX <= mato.x + mato.width &&
                                nextY >= mato.y && nextY <= mato.y + mato.height) {
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
                        const distance = Math.sqrt((this.x - mato.x) ** 2 + (this.y - mato.y) ** 2);
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
                    this.frameY = 7; // Left
                } else if (this.directionX > 0) {
                    this.frameY = 1; // Right
                } else if (this.directionY < 0) {
                    this.frameY = 2; // Up
                } else if (this.directionY > 0) {
                    this.frameY = 0; // Down
                }
            }
        }
    }

    class Pato extends Animal {
        constructor(game, x, y) {
            super(game, x, y, 'pato');
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
                            if (nextX >= mato.x && nextX <= mato.x + mato.width &&
                                nextY >= mato.y && nextY <= mato.y + mato.height) {
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
                        const distance = Math.sqrt((this.x - mato.x) ** 2 + (this.y - mato.y) ** 2);
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
                    this.frameY = 5; // Left
                } else if (this.directionX > 0) {
                    this.frameY = 1; // Right
                } else if (this.directionY < 0) {
                    this.frameY = 2; // Up
                } else if (this.directionY > 0) {
                    this.frameY = 0; // Down
                }
            }
        }
    }

    class Fantasma extends Animal {
        constructor(game, x, y) {
            super(game, x, y, 'fantasma');
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
            context.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height);
        }
        update() {
        }
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
            const marginX = (this.game.width - maxCols * (gridSize + spacingX) + spacingX) / 2;
            const marginY = (this.game.height - (3 * gridSize)) / 2 + this.game.topMargin;
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
            this.pontos = 0;
            this.teclasPressionadas = new Set();
            this.input = new ManipularInput(this);
            this.eddy = new Eddy(this);
            this.numeroDeMatos = 12;
            this.matos = [];
            this.gameObjects = [];
            this.animais = [];
            this.matoSelecionado = null;
            this.pontosElement = document.getElementById('pontos');
            this.detections = 0;
            this.generatedAnimals = [];
            this.lastInteractedMatoNum = undefined;
            this.matoNeedingReset = undefined;
        }

        atualizarTeclas(teclas) {
            this.teclasPressionadas = teclas;
        }

        resetMatos() {
            for (let mato of this.matos) {
                mato.reset();
                this.interacted = false;
            }
            const lastInteractedMato = this.matos.find(mato => mato.interacted);
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
                6: Morcego
            };
        
            for (let mato of this.matos) {
                if (!mato.interacted && Math.abs(this.eddy.x - mato.x) <= this.eddy.width &&
                    Math.abs(this.eddy.y - mato.y) <= this.eddy.height && !this.waitingToDelete) {
        
                    console.log('Eddy está perto de um mato!');
                    
                    if (this.eddy.isCPressed) {
                        console.log(mato.numeroAleatorio);
                        const AnimalClass = animalClasses[mato.numeroAleatorio];
        
                        if (AnimalClass) {
                            console.log(`Spawning ${AnimalClass.name}.`);
                            const animal = new AnimalClass(this, mato.x, mato.y);
                            this.animais.push(animal);
                            console.log(`Generated ${AnimalClass.name} at (${mato.x}, ${mato.y}).`);
                            this.generatedAnimals.push({ animal, mato });
                            mato.interacted = true;
                        } else {
                            console.log('Invalid animal number.');
                        }
        
                        if (this.selectedMato && this.selectedMato.numeroAleatorio !== mato.numeroAleatorio) {
                            this.detections++;
                        }
                        if (this.detections >= 1) {
                            this.detections = 0;
                            this.waitingToDelete = true;
        
                            let generatedAnimalCount = this.generatedAnimals.length;
        
                            setTimeout(() => {
                                for (let i = 0; i < 2 && generatedAnimalCount > 0; i++) {
                                    const { animal, mato: associatedMato } = this.generatedAnimals.pop();
                                    const index = this.animais.indexOf(animal);
                                    if (index !== -1) {
                                        this.animais.splice(index, 1);
                                        console.log(`Deleted ${animal.constructor.name} at (${animal.x}, ${animal.y}).`);
                                        animal.x = associatedMato.x;
                                        animal.y = associatedMato.y;
                                    }
                                    generatedAnimalCount--;
                                }
                                this.waitingToDelete = false;
                                this.matos.forEach(mato => {
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
                            if (this.selectedMato.numeroAleatorio === this.lastInteractedMatoNum) {
                                this.pontos++;
                                this.pontosElement.innerText = "Pontos: "+this.pontos;
                                this.excludedMatos.push(this.selectedMato);
                                this.excludedMatos.push(mato);
                            }
                            this.selectedMato = null;
                        }
                        this.eddy.isCPressed = false;
                    }
                }
            }
        }
        renderizar(context) {
            this.gameObjects = [...this.matos, ...this.animais, this.eddy];
            this.gameObjects.sort((a, b) => {
                return (a.y + a.height) - (b.y + b.height);
            });
            this.gameObjects.forEach(objeto => {
                objeto.draw(context);
                if (objeto instanceof Eddy || objeto instanceof Animal) {
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