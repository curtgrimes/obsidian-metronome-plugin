import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";
import Metronome from "./components/Metronome.vue";
import { App, createApp } from "vue";
import { Meter } from "./models/Meter";
import { MetronomeSize, isMetronomeSize } from "./models/MetronomeSize";
import {
	MetronomeInstrument,
	isMetronomeInstrument,
} from "./models/MetronomeInstrument";
import { MetronomeStyle, isMetronomeStyle } from "./models/MetronomeStyle";
import { Frequency } from "tone/build/esm/core/type/Units";
import { MetronomeBPM } from "./models/MetronomeBPM";

export interface MetronomeCodeBlockParameters {
	bpm: MetronomeBPM;
	muted: boolean;
	meter?: Meter;
	size: MetronomeSize;
	style: MetronomeStyle;
	autoStart: boolean;
	instrument: MetronomeInstrument;
	tickNotes: Frequency[];
	tockNotes: Frequency[];
}

export default class MetronomePlugin extends Plugin {
	processors: MarkdownPostProcessor[];
	metronomeAppInstances: App<Element>[] = [];

	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			`metronome`,
			(src, el, context) => {
				const parameters = this.getCodeBlockParameters(src);

				const div = document.createElement("div");
				const child = new MarkdownRenderChild(div);

				const app = createApp(Metronome, {
					...parameters,
					onDidCreateInterval(interval: number) {
						child.registerInterval(interval);
					},
				});
				this.metronomeAppInstances.push(app);

				app.mount(div);
				context.addChild(child);
				el.append(div);

				child.onunload = () => app.unmount();
			}
		);
	}

	onunload() {
		// Plugin was disabled
		this.metronomeAppInstances.forEach((app) => app.unmount());
	}

	getCodeBlockParameters(src: string): MetronomeCodeBlockParameters {
		const values: { [key: string]: any } = {};

		src.split("\n")
			.map((line: string) => line.split(":"))
			.forEach(
				([key, value]: [string, string]) =>
					// Make case-insensitive just for ease of use
					(values[key.toLowerCase()] = (value || "").trim())
			);

		const parseMaybeCommaSeparatedToArray = (
			maybeCommaSeparated: string
		): string[] | false =>
			typeof maybeCommaSeparated === "string" &&
			maybeCommaSeparated.split(",").length > 0
				? maybeCommaSeparated.split(",")
				: false;

		return {
			// Remember: use lowercase versions of values.* properties
			bpm: new MetronomeBPM(values.bpm),
			muted: values.muted ? values.muted === "yes" : true,
			meter: values.meter ? Meter.fromString(values.meter) : null,
			size: isMetronomeSize(values.size) ? values.size : "small",
			style: isMetronomeStyle(values.style) ? values.style : "pulse",
			autoStart: values.autostart ? values.autoStart === "yes" : null,
			instrument: isMetronomeInstrument(values.instrument)
				? values.instrument
				: "click",
			tickNotes: parseMaybeCommaSeparatedToArray(values.ticknotes) || [
				"C6",
			],
			tockNotes: parseMaybeCommaSeparatedToArray(values.tocknotes) || [
				"C5",
			],
		};
	}
}
