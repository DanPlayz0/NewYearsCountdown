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

const getTrueNumber = (num) => num < 0 ? num : num < 10 ? "0" + num : num;

const calculateRemainingTime = (timezone="America/Los_Angeles") => {
  const comingYear = Number(moment.tz(timezone).format("YYYY"));
  const comingDate = moment.tz([comingYear,0,1,0,0,0], timezone);

  const remainingTime = new Date(comingDate.format()).getTime() - new Date().getTime();
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return {ms: remainingTime, s: Math.floor(remainingTime/1000), countdown: {days,hours,mins,secs} };
}

const editTime = (timeId, timezone) => {
  const time = calculateRemainingTime(timezone);
  const {days,hours,mins,secs} = time.countdown;
  if(time.s < 0) return time;

  if(time.s > 24*60*60 || time.s == 0) {
    document.querySelector(`#${timeId} #dd`).parentElement.style = "";
    document.querySelector(`#${timeId} #dd`).innerHTML = time.s == 0 ? "00" : days;
  }
  else document.querySelector(`#${timeId} #dd`).parentElement.style = "display:none";

  if(time.s > 60*60 || time.s == 0) {
    document.querySelector(`#${timeId} #hh`).parentElement.style = "";
    document.querySelector(`#${timeId} #hh`).innerHTML = getTrueNumber(hours);
  }
  else document.querySelector(`#${timeId} #hh`).parentElement.style = "display:none";

  if(time.s > 60 || time.s == 0) {
    document.querySelector(`#${timeId} #mm`).parentElement.style = "";
    document.querySelector(`#${timeId} #mm`).innerHTML = getTrueNumber(mins);
  }
  else document.querySelector(`#${timeId} #mm`).parentElement.style = "display:none";

  document.querySelector(`#${timeId} #ss`).innerHTML = time.s < 10 ? time.s == 0 ? "00" : secs : getTrueNumber(secs);

  return time;
}



function initCountdown() {
  let isSnowing = true;
  let snowCanvas = new Snow();
  
  document.querySelector('.middle').style = "";
  document.getElementById('countVideo').style = "display: none;";
  const interval = setInterval(() => {
    const time = editTime("losangeles", "America/Los_Angeles");
    editTime("ukraine", "EET");
    editTime("newyork", "EST");
    editTime("hawaii", "HST");
  
    if(time.s == 39) {
      document.getElementById('countVideo').style = "";
      document.querySelector('.middle').style = "display: none;";
      document.getElementById('countVideo').play();
      snowCanvas.canvas.remove();
      isSnowing = false;

      setTimeout(() => {
        clearInterval(interval);
        initCountdown()
      }, 62*1000);
    }
  
  }, 1000)
  
  
  // setInterval(() => {
  //   const {ms:timeMs, countdown} = calculateRemainingTime();
  //   if(countdown.days == 0) d.parentElement.style = "display: none;";
  //   if(countdown.hours == 0 && countdown.days == 0) h.parentElement.style = "display: none;";
  //   if(countdown.mins == 0 && countdown.hours == 0 && countdown.days == 0) m.parentElement.style = "display: none;";

  //   if(countdown.secs == 39 && countdown.mins == 0 && countdown.hours == 0 && countdown.days == 0) {
      
      
  //   }
  // }, 1000);
}

// initCountdown();