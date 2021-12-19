import * as Tone from "tone/build/esm";
import { Frequency } from "tone/build/esm/core/type/Units";

const beepSynth = new Tone.Synth().toDestination();

const whiteNoise = new Tone.NoiseSynth({
	noise: { type: "white" },
}).toDestination();

const brownNoise = new Tone.NoiseSynth({
	noise: { type: "brown" },
}).toDestination();

const pinkNoise = new Tone.NoiseSynth({
	noise: { type: "pink" },
}).toDestination();

export const tick = () => whiteNoise.triggerAttackRelease("8n");
export const tock = () => brownNoise.triggerAttackRelease("8n");
export const tickUpbeat = () => pinkNoise.triggerAttackRelease("8n");
export const beep = (note: Frequency = "C4") =>
	beepSynth.triggerAttackRelease(note, "32n");
