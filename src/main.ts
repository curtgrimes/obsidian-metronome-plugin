import {
	MarkdownPostProcessor,
	MarkdownRenderChild,
	Plugin,
	TFile,
} from "obsidian";
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

interface MetronomeInstance {
	sourcePath: string;
	src: string;
	div: HTMLElement;
	app: App<Element>;
}

const SETTINGS_REFRESH_DEBOUNCE_MS = 500;

export default class MetronomePlugin extends Plugin {
	processors: MarkdownPostProcessor[];
	metronomeInstances: MetronomeInstance[] = [];
	settings: MetronomeSettings;
	settingsRefreshTimer: number | null = null;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new MetronomeSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			`metronome`,
			(src, el, context) => {
				const div = document.createElement("div");
				const child = new MarkdownRenderChild(div);

				const instance: MetronomeInstance = {
					sourcePath: context.sourcePath,
					src,
					div,
					app: this.mountMetronome(src, context.sourcePath, div),
				};
				this.metronomeInstances.push(instance);

				context.addChild(child);
				el.append(div);

				child.onunload = () => {
					instance.app.unmount();
					this.metronomeInstances.remove(instance);
				};
			}
		);

		// Frontmatter properties aren't part of a metronome code block's own
		// source, so editing them doesn't normally re-trigger the code block
		// processor above. Re-render affected metronomes whenever the note's
		// metadata (including frontmatter) changes.
		this.registerEvent(
			this.app.metadataCache.on("changed", (file) => {
				if (!this.settings.useFrontmatterProperties) return;

				this.refreshInstances(
					this.metronomeInstances.filter(
						(instance) => instance.sourcePath === file.path
					)
				);
			})
		);
	}

	mountMetronome(
		src: string,
		sourcePath: string,
		div: HTMLElement
	): App<Element> {
		const parameters = this.getCodeBlockParameters(src, sourcePath);
		const app = createApp(Metronome, { ...parameters });
		app.mount(div);
		return app;
	}

	refreshInstances(instances: MetronomeInstance[]) {
		instances.forEach((instance) => {
			instance.app.unmount();
			instance.div.empty();
			instance.app = this.mountMetronome(
				instance.src,
				instance.sourcePath,
				instance.div
			);
		});
	}

	onunload() {
		// Plugin was disabled
		if (this.settingsRefreshTimer !== null) {
			window.clearTimeout(this.settingsRefreshTimer);
		}
		this.metronomeInstances.forEach((instance) => instance.app.unmount());
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

		// Settings text fields save on every keystroke, so debounce the
		// refresh to avoid restarting open metronomes mid-edit.
		if (this.settingsRefreshTimer !== null) {
			window.clearTimeout(this.settingsRefreshTimer);
		}
		this.settingsRefreshTimer = window.setTimeout(() => {
			this.settingsRefreshTimer = null;
			this.refreshInstances(this.metronomeInstances);
		}, SETTINGS_REFRESH_DEBOUNCE_MS);
	}

	getFrontmatterProperties(sourcePath: string): {
		bpm?: string;
		meter?: string;
	} {
		if (!this.settings.useFrontmatterProperties || !sourcePath) {
			return {};
		}

		const file = this.app.vault.getAbstractFileByPath(sourcePath);
		if (!(file instanceof TFile)) {
			return {};
		}

		const frontmatter =
			this.app.metadataCache.getFileCache(file)?.frontmatter;
		if (!frontmatter) {
			return {};
		}

		const bpmValue = frontmatter[this.settings.tempoPropertyName];
		const meterValue = frontmatter[this.settings.meterPropertyName];

		return {
			bpm: bpmValue !== undefined ? String(bpmValue) : undefined,
			meter: meterValue !== undefined ? String(meterValue) : undefined,
		};
	}

	getCodeBlockParameters(
		src: string,
		sourcePath?: string
	): MetronomeCodeBlockParameters {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const values: { [key: string]: any } = {};

		src.split("\n")
			.map((line: string) => line.split(":"))
			.forEach(
				([key, value]: [string, string]) =>
					// Make case-insensitive just for ease of use
					(values[key.toLowerCase()] = (value || "").trim())
			);

		const frontmatterProperties =
			this.getFrontmatterProperties(sourcePath);

		const parseMaybeCommaSeparatedToArray = (
			maybeCommaSeparated: string
		): string[] | false =>
			typeof maybeCommaSeparated === "string" &&
			maybeCommaSeparated.split(",").length > 0
				? maybeCommaSeparated.split(",")
				: false;

		return {
			// Remember: use lowercase versions of values.* properties
			// Precedence: code block > frontmatter properties > configured defaults
			bpm: new MetronomeBPM(
				values.bpm || frontmatterProperties.bpm
			),
			muted: values.muted
				? values.muted === "yes"
				: this.settings.muted,
			meter: values.meter
				? Meter.fromString(values.meter)
				: frontmatterProperties.meter
				? Meter.fromString(frontmatterProperties.meter)
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
