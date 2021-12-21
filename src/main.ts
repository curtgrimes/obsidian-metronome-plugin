import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";
import Metronome from "./components/Metronome.vue";
import { createApp } from "vue";
import { Meter } from "./models/Meter";
import { MetronomeSize, isMetronomeSize } from "./models/MetronomeSize";
import { MetronomeSound, isMetronomeSound } from "./models/MetronomeSound";
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
	sound: MetronomeSound;
	beepTick: Frequency;
	beepTock: Frequency;
}

export default class MetronomePlugin extends Plugin {
	processors: MarkdownPostProcessor[];

	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			`metronome`,
			(src, el, context) => {
				const parameters = this.getCodeBlockParameters(src);

				const div = document.createElement("div");
				const app = createApp(Metronome, {
					...parameters,
				});
				app.mount(div);

				const child = new MarkdownRenderChild(div);
				context.addChild(child);
				el.append(div);
			}
		);
	}

	onunload() {}

	getCodeBlockParameters(src: string): MetronomeCodeBlockParameters {
		const values: { [key: string]: any } = {};

		src.split("\n")
			.map((line: string) => line.split(":"))
			.forEach(([key, value]: [string, string]) => {
				values[key] = (value || "").trim();
			});

		return {
			bpm: new MetronomeBPM(values.bpm),
			muted: values.muted ? values.muted === "yes" : true,
			meter: values.meter ? Meter.fromString(values.meter) : null,
			size: isMetronomeSize(values.size) ? values.size : "small",
			style: isMetronomeStyle(values.style) ? values.style : "pulse",
			autoStart: values.autoStart ? values.autoStart === "yes" : null,
			sound: isMetronomeSound(values.sound) ? values.sound : "click",
			beepTick: values.beepTick || "C6",
			beepTock: values.beepTock || "C5",
		};
	}
}
