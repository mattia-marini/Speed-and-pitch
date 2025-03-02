import * as Tone from "tone";

console.log("Popup script loaded");
setupListeners();
// import * as Tone from "tone";
let video = document.getElementById("myVideo");

// let pitchShift = audioCtx.createBiquadFilter();

// pitchShift.type = "peaking";
// pitchShift.frequency.value = 1000;
// pitchShift.Q.value = 1;
//
// source.connect(pitchShift);
// pitchShift.connect(audioCtx.destination);

let audioCtx;
let sourceNode;
let gainNode;
let distortionNode;
let pitchShiftNode;
let autoWahNode;

let initialized = false;

async function initAudioContext() {
  // audioCtx = new AudioContext();
  await Tone.start();
  audioCtx = Tone.context;

  // console.log(audioCtx);
  sourceNode = audioCtx.createMediaElementSource(video);
  pitchShiftNode = new Tone.PitchShift(10);
  distortionNode = new Tone.Distortion(0.4);
  autoWahNode = new Tone.AutoWah(50, 6, -30);

  Tone.connect(sourceNode, pitchShiftNode);
  pitchShiftNode.toDestination();

  initialized = true;
}

// the awkward pause is needed to avoid little lag before playing, the first time the video is pressed
let videoPlaying = false;
video.onplay = function () {
  if (videoPlaying) return;

  video.pause();
  if (!initialized)
    initAudioContext().then(() => {
      video.play();
      videoPlaying = true;
    });
  else {
    video.play();
    videoPlaying = true;
  }
};

function changePitchRelative(increment) {
  pitchShiftNode.pitch += increment;
}

function setPitch(semitones) {
  pitchShiftNode.pitch = semitones;
}

function changeSpeedRelative(increment) {
  video.playbackRate += increment;
}

function setSpeed(speed) {
  video.playbackRate = speed;
}

function setupListeners() {
  document
    .getElementById("incrementSpeed")
    .addEventListener("click", () => changeSpeedRelative(1));

  document
    .getElementById("decrementSpeed")
    .addEventListener("click", () => changeSpeedRelative(-1));

  document
    .getElementById("normalSpeed")
    .addEventListener("click", () => setSpeed(1));

  document
    .getElementById("incrementPitch")
    .addEventListener("click", () => changePitchRelative(1));

  document
    .getElementById("decrementPitch")
    .addEventListener("click", () => changePitchRelative(-1));

  document
    .getElementById("normalPitch")
    .addEventListener("click", () => setPitch(0));
}

// Create HTML element
const div = document.createElement("div");
div.innerHTML = `<div
  style="
    position: fixed;
    top: 10px;
    right: 10px;
    background: white;
    padding: 10px;
    border: 1px solid black;
    z-index: 9999;
    id: injected-html;
  "
>
  Hello from Extension!
</div>`;

console.log(document.body);
// Append to the page
document.body.appendChild(div);
