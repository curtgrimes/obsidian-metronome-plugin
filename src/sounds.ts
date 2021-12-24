import * as Tone from "tone/build/esm";
import { Frequency } from "tone/build/esm/core/type/Units";

const beepSynth = new Tone.PolySynth().toDestination();

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
export const beep = (notes: Frequency[] = ["C4"]) => {
	try {
		beepSynth.triggerAttackRelease(notes, "16n");
	} catch (e) {
		// Probably invalid note value. Play no note instead.
		console.error(e);
		beepSynth.releaseAll();
	}
};
