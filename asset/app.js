const logHistory = [];
var alertCheck = false;

/**
 * afreecatv api checker
 * @param {*} success_callback 
 * @param {*} error_callback 
 */
function get_broadcast_state(success_callback, error_callback) {
  const url = "https://bjapi.afreecatv.com/api/17282486/station";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = () => {
    try {
      const data = JSON.parse(xhr.response);
      if (xhr.status != 200) {
        console.debug("[fuc] xhr.status ", xhr.status);
        if (error_callback) error_callback();
      };
      if (data['broad'] == undefined) {
        console.debug("[fuc] data.broad ", data.broad);
        if (error_callback) error_callback();
      };
      console.debug("[fuc] successful state loaded");
      if (success_callback) success_callback(data.broad);
    } catch (e) {
      console.debug("[fuc] e ", e);
      if (error_callback) error_callback();
    }
  };
  xhr.send();
}

/**
 * main
 */
var app = main();
function main() {
  let interval = 5000;
  let working = false;
  return {
    run: function () {
      console.debug("[app] run");
      setInterval(this.checker, interval);
    },
    checker: function () {
      if (working == true) return;
      working = true;

      console.debug("[app] checker");
      get_broadcast_state((state) => {
        logHistory.push(state);
        working = false;

        updateLog();

        console.log("???", alertCheck, state);
        if (alertCheck == false && state) {
          alertCheck = true;
          pAlert.start();
        }
        if (alertCheck == true && state == false)
          alertCheck = false;

      });
    },
  }
}

/**
 * alert
 */
pAlert = pAlertLib();
function pAlertLib() {
  return {
    start: function () {
      document.getElementById("audio").play();
      document.getElementById("alert").style.display = "block";
    },
    stop: function () {
      document.getElementById("audio").pause();
      document.getElementById("alert").style.display = "none";
      window.open ("https://play.afreecatv.com/17282486");
    }
  }
}

/**
 * write log by UI
 */
function updateLog() {
  const log = logHistory.pop();
  const now = getTime();
  if (log)
    document.getElementById("log").innerText = "마지막 확인 : " + now.string + " / 방송중임";
  else
    document.getElementById("log").innerText = "마지막 확인 : " + now.string + " / 방송중 아님";
}

/**
 * clock
 */
function getTime() {
  var date = new Date();
  const d = {
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };
  const session = "AM";

  if (d.h == 0) {
    d.h = 12;
  }

  if (d.h > 12) {
    d.h = d.h - 12;
    session = "PM";
  }

  d.h = (d.h < 10) ? "0" + d.h : d.h;
  d.m = (d.m < 10) ? "0" + d.m : d.m;
  d.s = (d.s < 10) ? "0" + d.s : d.s;

  d.string = time = d.h + ":" + d.m + ":" + d.s + " " + session;;
  return d;
}
function showTime() {
  const now = getTime();
  document.getElementById("MyClockDisplay").innerText = now.string;
  document.getElementById("MyClockDisplay").textContent = now.string;
  setTimeout(showTime, 1000);
}