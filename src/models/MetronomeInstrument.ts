export type MetronomeInstrument =
	| "click"
	| "beep"
	| "AMSynth"
	| "DuoSynth"
	| "FMSynth"
	| "MembraneSynth"
	| "MetalSynth"
	| "MonoSynth"
	| "NoiseSynth"
	| "PluckSynth"
	| "Synth"
	| "WoodBlock";

export const defaultMetronomeInstrument = "beep";

export function isMetronomeInstrument(inputInstrument: string): boolean {
	return [
		"click",
		"beep",
		"AMSynth",
		"DuoSynth",
		"FMSynth",
		"MembraneSynth",
		"MetalSynth",
		"MonoSynth",
		"PluckSynth",
		"WoodBlock",
	].includes(inputInstrument);
}

export const normalizeInstrumentNameForToneJS = (
	instrument: MetronomeInstrument
) => {
	switch (instrument) {
		case "click":
			return "NoiseSynth";
		case "beep":
			return "Synth";
		default:
			return instrument;
	}
};
