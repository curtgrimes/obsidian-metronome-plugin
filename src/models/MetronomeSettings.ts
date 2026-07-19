import { MetronomeSize } from "./MetronomeSize";
import { MetronomeStyle } from "./MetronomeStyle";
import { MetronomeInstrument } from "./MetronomeInstrument";

export interface MetronomeSettings {
	meter: string;
	muted: boolean;
	autoStart: boolean;
	stopAfter: string;
	countdownMode: "always" | "duration";
	countdownDuration: string;
	size: MetronomeSize;
	style: MetronomeStyle;
	instrument: MetronomeInstrument;
	tickNotes: string;
	tockNotes: string;
}

export const DEFAULT_SETTINGS: MetronomeSettings = {
	meter: "4/4",
	muted: true,
	autoStart: true,
	stopAfter: "",
	countdownMode: "duration",
	countdownDuration: "10s",
	size: "small",
	style: "pulse",
	instrument: "click",
	tickNotes: "C6",
	tockNotes: "C5",
};
