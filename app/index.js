/*
 * Entry point for the watch app
 */
import clock from 'clock';
import document from "document";
import { me as device } from "device";
import { today } from "user-activity";
import { battery, charger } from "power";

import { HeartRateSensor } from "heart-rate";

//const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");
const hrmColour = document.getElementById("hrm-colour");

if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    let hb = hrm.heartRate ? hrm.heartRate : 0;
    hrmData.text = Number(hb).toString();
    if (hb > 140 || hb < 50) {
      hrmColour.style.fill = "#ff0000";
    } else {
      hrmColour.style.fill = "#777777";
    }
  });
  hrm.start();
} else {
  //hrmLabel.style.display = "none";
  hrmData.style.display = "none";
}

document.getElementById("firmware").text = device.firmwareVersion;
document.getElementById("res").text = `${device.screen.width}x${device.screen.height}`;
document.getElementById("colour").text = device.bodyColor;
document.getElementById("steps").text = `${today.adjusted.steps}`;
document.getElementById("battery").text = `${battery.chargeLevel}% ${charger.connected ? `charging` : `discharging`}`;

clock.granularity = "minutes";

const wordclock = document.getElementById("wordclock");

clock.ontick = (evt) => {
  document.getElementById("battery").text = `${battery.chargeLevel}% ${charger.connected ? `charging` : `discharging`}`;
  let today = evt.date;
  let hour = today.getHours(),
      minute = today.getMinutes();

  //hour = 20, minute = 35;

  if (minute >= 33) {
    hour += 1;
  }
  
  let minute_label = "";
  let hour_label = ["TWELVE", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN"][hour % 12];
  if (hour == 0) {
    hour_label = "MIDNIGHT";
  } else if (hour == 12) {
    hour_label = "MIDDAY";
  } else if (hour < 12) {
    hour_label = hour_label + " AM";
  } else {
    hour_label = hour_label + " PM";
  }
  if (minute >= 58 || minute <= 2) { // xx:58 - xx:02
    wordclock.text = "IT IS " + hour_label;
  } else {
  
    if (minute >= 3 && minute <= 7) { // xx:03 - xx:07
      minute_label = "FIVE PAST";
    } else if (minute >= 8 && minute <= 12) { // xx:08 - xx:12
      minute_label = "TEN PAST";
    } else if (minute >= 13 && minute <= 17) { // xx:13 - xx:17
      minute_label = "A QUARTER PAST";
    } else if (minute >= 18 && minute <= 22) { // xx:18 - xx:22
      minute_label = "TWENTY PAST";
    } else if (minute >= 23 && minute <= 27) { // xx:23 - xx:27
      minute_label = "TWENTY FIVE PAST";
    } else if (minute >= 28 && minute <= 32) { // xx:28 - xx:32
      minute_label = "HALF PAST";
    } else if (minute >= 33 && minute <= 37) { // xx:33 - xx:37
      minute_label = "TWENTY FIVE TO";
    } else if (minute >= 38 && minute <= 42) { // xx:38 - xx:42
      minute_label = "TWENTY TO";
    } else if (minute >= 43 && minute <= 47) { // xx:43 - xx:47
      minute_label = "A QUARTER TO";
    } else if (minute >= 48 && minute <= 52) { // xx:48 - xx:52
      minute_label = "TEN TO";
    } else if (minute >= 53 && minute <= 57) { // xx:53 - xx:57
      minute_label = "FIVE TO";
    }
    wordclock.text = `IT IS ${minute_label} ${hour_label}`;

  }
}