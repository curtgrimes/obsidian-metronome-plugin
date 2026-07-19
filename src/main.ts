import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";
import Metronome from "@/components/Metronome.vue";
import { Frequency } from "tone/build/esm/core/type/Units";
import { MetronomeBPM } from "@/models/MetronomeBPM";
import { App, createApp } from "vue";
import { Meter } from "@/models/Meter";
import { MetronomeSize, isMetronomeSize } from "@/models/MetronomeSize";
import {
	MetronomeInstrument,
	isMetronomeInstrument,
} from "./models/MetronomeInstrument";
import { MetronomeStyle, isMetronomeStyle } from "@/models/MetronomeStyle";
import {
	MetronomeSettings,
	DEFAULT_SETTINGS,
} from "@/models/MetronomeSettings";
import { MetronomeSettingTab } from "@/SettingTab";
import "@/settings.css";

export interface MetronomeCodeBlockParameters {
	bpm: MetronomeBPM;
	muted: boolean;
	meter?: Meter;
	size: MetronomeSize;
	style: MetronomeStyle;
	autoStart: boolean;
	stopAfter: string;
	countdown: string;
	instrument: MetronomeInstrument;
	tickNotes: Frequency[];
	tockNotes: Frequency[];
}

export default class MetronomePlugin extends Plugin {
	processors: MarkdownPostProcessor[];
	metronomeAppInstances: App<Element>[] = [];
	settings: MetronomeSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new MetronomeSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			`metronome`,
			(src, el, context) => {
				const parameters = this.getCodeBlockParameters(src);

				const div = document.createElement("div");
				const child = new MarkdownRenderChild(div);

				const app = createApp(Metronome, {
					...parameters,
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

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	getCodeBlockParameters(src: string): MetronomeCodeBlockParameters {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			muted: values.muted
				? values.muted === "yes"
				: this.settings.muted,
			meter: values.meter
				? Meter.fromString(values.meter)
				: this.settings.meter
				? Meter.fromString(this.settings.meter)
				: null,
			size: isMetronomeSize(values.size)
				? values.size
				: this.settings.size,
			style: isMetronomeStyle(values.style)
				? values.style
				: this.settings.style,
			autoStart: values.autostart
				? values.autostart === "yes"
				: this.settings.autoStart,
			stopAfter: values.stopafter
				? values.stopafter
				: this.settings.stopAfter || null,
			countdown: values.countdown
				? values.countdown
				: this.settings.countdownMode === "always"
				? "always"
				: this.settings.countdownDuration,
			instrument: isMetronomeInstrument(values.instrument)
				? values.instrument
				: this.settings.instrument,
			tickNotes: parseMaybeCommaSeparatedToArray(values.ticknotes) ||
				parseMaybeCommaSeparatedToArray(this.settings.tickNotes) || [
					"C6",
				],
			tockNotes: parseMaybeCommaSeparatedToArray(values.tocknotes) ||
				parseMaybeCommaSeparatedToArray(this.settings.tockNotes) || [
					"C5",
				],
		};
	}
}
