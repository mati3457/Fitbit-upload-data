import document from "document";
import { HeartRateSensor } from "heart-rate";
import { Accelerometer } from "accelerometer";
import { outbox } from "file-transfer"
import * as fs from "fs";

const fileName = "/private/data/ascii.txt";
// data on screen

const appStatusText = document.getElementById("appStatusLabel");
appStatusText.text = "ON";

const timeLabel = document.getElementById("timeLabel");

const updateClock = (h, m, s) => {
  h = addTimeZone(h);
  s = Math.floor(s).toString();
  s = (s < 10) ? "0" + s : s;
  timeLabel.text = h + ":" + m + ":" + s;
}

// import { memory } from "system";

import { me } from "appbit";
import clock from "clock";

import { display } from "display";

// app doesnt time out after period of inactivity
me.appTimeoutEnabled = false;



const timeZone = 1; // set time zone value

// pokazywanie czasu
const round2decimals = (num) => {
  return Math.round(num * 100) / 100;
}



const addTimeZone = (hour) => {
  if(hour == "23") {
      return "00";
  }
  return (Number(hour) + timeZone).toString();
}

let timeString = "";
let accelString = "";

display.autoOff = false;
display.brightnessOverride = "dim";

if (fs.existsSync(fileName)) {
  console.log("file exists!");
  if(fs.readFileSync("ascii.txt", "ascii") == "") {
    console.log("File contains something -- removing file...");
    fs.unlinkSync(fileName);
    fs.writeFileSync(fileName, "", "ascii");
  }
} else {
  fs.writeFileSync(fileName, "", "ascii");
}

if(HeartRateSensor) {
  var hrm = new HeartRateSensor({ frequency: 1 });
  hrm.start();
}

if (Accelerometer) {
  // sampling at 1Hz (once per second)
  const accel = new Accelerometer({ frequency: 1 });
  accel.start();
}

clock.granularity = "seconds";
clock.ontick = (evt) => {
  let [hour, minute, second] = evt.date.toTimeString().split(':')
  accelString = round2decimals(accel.x) + "," + round2decimals(accel.y) + "," + round2decimals(accel.z);
  timeString += addTimeZone(hour) + ":" + minute + ":" + Math.floor(second) + "," + ((hrm.heartRate == null) ? "00" : hrm.heartRate) + "," + accelString + "\n";

  // console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
  updateClock(hour, minute, second);

  if(minute % 5 == 0 && second == 0) {
    fs.writeFileSync(fileName, timeString, "ascii");
    timeString = "";
    outbox
    .enqueueFile(fileName)
    .then(ft => {
      console.log(`Transfer of ${ft.name} successfully queued.`);
      fs.unlinkSync(fileName);
      // if(fs.existsSync("/private/data/ascii.txt")) {
      //   console.log("Plik istnieje")
      // }
    })
    .catch(err => {
      console.log(`Failed to schedule transfer: ${err}`);
    })
  }
}
