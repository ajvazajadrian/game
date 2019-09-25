//select canvas
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// game variables
let frames = 0;
const degree = Math.PI / 180;

// load sprite image
const sprite = new Image();
sprite.src = "img/sprite.png";

const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
};

function fly(event) {
  if (event.keyCode === 32 || event.type == "click") {
    switch (state.current) {
      case state.getReady:
        state.current = state.game;
        break;
      case state.game:
        bird.flap();
        break;
      case state.over:
        // state.current = state.getReady;
        location.reload();
        break;
    }
  }
}
// control the game state
cvs.addEventListener("click", fly);

window.addEventListener("keydown", fly);
// Background
const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw: function() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  }
};

// foreground
const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,
  dx: 2,

  draw: function() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.h
    );
  },
  update: function() {
    if (state.current === state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  }
};

//bird
const bird = {

  sX: 276,
  sY: 112 ,
  x: 50,
  y: 190,
  w: 36,
  h: 55,

  frame: 0,
  

  gravity: 0.25,
  jump: 4.6,
  speed: 0,
 
  radius: 2,

  draw: function() {
    
    ctx.save();
    ctx.translate(this.x, this.y);
   
    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );
    
    ctx.restore();
  },

  flap: function() {
    this.speed = -this.jump;
  },
  update: function() {
    //if gamestate ready, bird flap slowly
    this.period = state.current === state.getReady ? 10 : 5;
    // incrementing frame +1
    this.frame += frames % this.period === 0 ? 1 : 0;
    // if frames goes to 4 we need start from 0
   

    if (state.current === state.getReady) {
      this.y = 150; // reset position of bird
   
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.y + this.h / 2 >= cvs.height - fg.h) {
        this.y = cvs.height - fg.h - this.h / 2;
        if (state.current === state.game) {
          state.current = state.over;
        }
      }
      // *******
      if (this.speed >= this.jump) {
        this.rotation = 90 * degree;
        this.frame = 1;
      } else {
        this.rotation = -25 * degree;
      }
    }
  }
};

// get ready
const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width / 2 - 173 / 2,
  y: 80,

  draw: function() {
    if (state.current === state.getReady) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  }
};
// Game over message
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width / 2 - 225 / 2,
  y: 90,

  draw: function() {
    if (state.current === state.over) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sY,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  }
};
// pipes
const pipes = {
  position: [],
  top: {
    sX: 553,
    sY: 0
  },
  bottom: {
    sX: 502,
    sY: 0
  },
  w: 53,
  h: 400,
  gap: 100,
  maxYPos: -150,
  dX: 2,

  draw: function() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;

      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },

  update: function() {
    if (state.current !== state.game) return;
    if (frames % 100 === 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1)
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let bottomPipeYPos = p.y + this.h + this.gap;

      // colision detection top pipe
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.h
      ) {
        state.current = state.over;
      }
      p.x -= this.dX;
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.w &&
        bird.y + bird.radius > bottomPipeYPos &&
        bird.y - bird.radius < bottomPipeYPos + this.h
      ) {
        state.current = state.over;
      }

      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;

        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  }
};

// score
const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,

  draw: function() {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "000";

    if (state.current === state.game) {
      ctx.lineWidth = 2;
      ctx.font = "35px Teko";
      ctx.fillText(this.value, cvs.width / 2, 50);
      ctx.strokeText(this.value, cvs.width / 2, 50);
    } else if (state.current === state.over) {
      //score value
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      // best score
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  }
};

//draw
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function update() {
  bird.update();
  fg.update();
  pipes.update();
}

function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop);
}

loop();
