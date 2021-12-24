import * as Tone from "tone/build/esm";
import { PolySynth } from "tone/build/esm";
import { Frequency } from "tone/build/esm/core/type/Units";
import {
	Instrument,
	InstrumentOptions,
} from "tone/build/esm/instrument/Instrument";
import {
	MetronomeInstrument,
	normalizeInstrumentNameForToneJS,
} from "./models/MetronomeInstrument";

const synthCache: {
	[key: string]: Tone.PolySynth | Instrument<InstrumentOptions>;
} = {};
const getSynth = (instrument: MetronomeInstrument) => {
	if (!synthCache[instrument]) {
		let synth;
		switch (instrument) {
			case "AMSynth":
				synth = new Tone.PolySynth(Tone.AMSynth);
				break;
			case "DuoSynth":
				synth = new Tone.PolySynth(Tone.DuoSynth);
				break;
			case "FMSynth":
				synth = new Tone.PolySynth(Tone.FMSynth);
				break;
			case "MembraneSynth":
				synth = new Tone.PolySynth(Tone.MembraneSynth);
				break;
			case "MetalSynth":
				synth = new Tone.PolySynth(Tone.MetalSynth);
				break;
			case "MonoSynth":
				synth = new Tone.PolySynth(Tone.MonoSynth);
				break;
			case "NoiseSynth":
				synth = new Tone.NoiseSynth();
				break;
			case "PluckSynth":
				synth = new Tone.PluckSynth();
				break;
			case "Synth":
			default:
				synth = new Tone.PolySynth(Tone.Synth);
				break;
		}
		synthCache[instrument] = synth.toDestination();
	}

	return synthCache[instrument];
};

const whiteNoise = new Tone.NoiseSynth({
	noise: { type: "white" },
}).toDestination();

const brownNoise = new Tone.NoiseSynth({
	noise: { type: "brown" },
}).toDestination();

const pinkNoise = new Tone.NoiseSynth({
	noise: { type: "pink" },
}).toDestination();

export const playTick = () => whiteNoise.triggerAttackRelease("8n");
export const playTock = () => brownNoise.triggerAttackRelease("8n");
export const playTickUpbeat = () => pinkNoise.triggerAttackRelease("8n");
export const playSynth = (
	notes: Frequency[] = ["C4"],
	instrument: MetronomeInstrument = "click"
) => {
	const synth = getSynth(normalizeInstrumentNameForToneJS(instrument));

	try {
		if (synth instanceof PolySynth) {
			synth.triggerAttackRelease(notes, "16n");
		} else if (synth instanceof Instrument) {
			// Mono synth
			synth.triggerAttackRelease(notes[0], "16n");
		}
	} catch (e) {
		// Probably invalid note value. Play no note instead.
		if (synth instanceof PolySynth) {
			synth.releaseAll();
		} else if (synth instanceof Instrument) {
			synth.triggerRelease();
		}
	}
};
