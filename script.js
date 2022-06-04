class Snowflake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = 0;
    this.alpha = 0;

    this.reset();
  }

  reset() {
    this.x = this.randBetween(0, window.innerWidth);
    this.y = this.randBetween(0, -window.innerHeight);
    this.vx = this.randBetween(-3, 3);
    this.vy = this.randBetween(2, 5);
    this.radius = this.randBetween(1, 4);
    this.alpha = this.randBetween(0.1, 0.9);
  }

  randBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.radius > window.innerHeight) {
      this.reset();
    }
  }
}

class Snow {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);

    window.addEventListener("resize", () => this.onResize());
    this.onResize();
    this.updateBound = this.update.bind(this);
    requestAnimationFrame(this.updateBound);

    this.createSnowflakes();
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createSnowflakes() {
    const flakes = window.innerWidth / 4;

    this.snowflakes = [];

    for (let s = 0; s < flakes; s++) {
      this.snowflakes.push(new Snowflake());
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let flake of this.snowflakes) {
      flake.update();

      this.ctx.save();
      this.ctx.fillStyle = "#FFF";
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.globalAlpha = flake.alpha;
      this.ctx.fill();
      this.ctx.restore();
    }
    requestAnimationFrame(this.updateBound);
  }
}

////////////////////////////////////////////////////////////
// Simple CountDown Clock

const d = document.getElementById("d");
const h = document.getElementById("h");
const m = document.getElementById("m");
const s = document.getElementById("s");

function getTrueNumber(num) {
  return num < 0 ? num : num < 10 ? "0" + num : num;
}

function calculateRemainingTime() {
  const comingYear = new Date().getFullYear() + 1;
  const comingDate = new Date(`Jan 1, ${comingYear} 00:00:00`);

  const now = new Date();
  const remainingTime = comingDate.getTime() - now.getTime();
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((remainingTime % (1000 * 60)) / 1000);

  d.innerHTML = getTrueNumber(days);
  h.innerHTML = getTrueNumber(hours);
  m.innerHTML = getTrueNumber(mins);
  s.innerHTML = getTrueNumber(secs); 

  return {ms: remainingTime, countdown: {days,hours,mins,secs} };
}

function initCountdown() {
  let isSnowing = false;
  let snowCanvas = null;
  d.parentElement.style = "";
  h.parentElement.style = "";
  m.parentElement.style = "";
  s.parentElement.style = "";
  document.getElementById('middle').style = "";
  document.getElementById('countVideo').style = "display: none;";
  const interval = setInterval(() => {
    const {ms:timeMs, countdown} = calculateRemainingTime();
    if(countdown.days == 0) d.parentElement.style = "display: none;";
    if(countdown.hours == 0 && countdown.days == 0) h.parentElement.style = "display: none;";
    if(countdown.mins == 0 && countdown.hours == 0 && countdown.days == 0) m.parentElement.style = "display: none;";

    if(countdown.secs == 39 && countdown.mins == 0 && countdown.hours == 0 && countdown.days == 0) {
      document.getElementById('countVideo').style = "";
      document.getElementById('middle').style = "display: none;";
      document.getElementById('countVideo').play();
      
      setTimeout(() => {
        snowCanvas.canvas.remove();
        clearInterval(interval);
        initCountdown()
      }, 62*1000);
    }

    if(isSnowing === false && timeMs <= 120000) {
      isSnowing = true;
      snowCanvas = new Snow();
    }
    // if (timeMs <= 1000) {
    //   snowCanvas.canvas.remove();
    //   clearInterval(interval);
    //   initCountdown();
    // }
  }, 1000);
}

initCountdown();