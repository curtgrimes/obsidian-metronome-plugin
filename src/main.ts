import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";
import Metronome from "./components/Metronome.vue";
import { createApp } from "vue";
import { Meter } from "./models/Meter";
import { MetronomeSize, isMetronomeSize } from "./models/MetronomeSize";
import VTooltipPlugin from "v-tooltip";

interface MetronomePluginSettings {
	mySetting: string;
}

export interface MetronomeCodeBlockParameters {
	bpm: number;
	sound: boolean;
	meter?: Meter;
	size: MetronomeSize;
	autoStart: boolean;
}

const DEFAULT_SETTINGS: MetronomePluginSettings = {
	mySetting: "default",
};

export default class MetronomePlugin extends Plugin {
	settings: MetronomePluginSettings;
	processors: MarkdownPostProcessor[];

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor(
			`metronome`,
			(src, el, context) => {
				const parameters = this.getCodeBlockParameters(src);

				const div = document.createElement("div");
				const app = createApp(Metronome, {
					...parameters,
				});
				app.use(VTooltipPlugin, {
					offset: [0, 10],
					themes: {
						tooltip: {
							hideTriggers: () => ["hover"],
						},
					},
				});
				app.mount(div);

				const child = new MarkdownRenderChild(div);
				context.addChild(child);
				el.append(div);
			}
		);

		// console.log("processor", processor);

		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: "add-metronome",
		// 	name: "Add metronome",
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		editor.replaceSelection("\n```metronome\nasdf```");
		// 	},
		// });

		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );
	}

	onunload() {}

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
		const values: { [key: string]: any } = {};

		src.split("\n")
			.map((line: string) => line.split(":"))
			.forEach(([key, value]: [string, string]) => {
				values[key] = (value || "").trim();
			});

		return {
			bpm: parseFloat(values.bpm) || null,
			sound: values.sound === "yes",
			meter: values.meter ? Meter.fromString(values.meter) : null,
			size: isMetronomeSize(values.size) ? values.size : null,
			autoStart: values.autoStart ? values.autoStart === "yes" : null,
		};
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText("Woah!");
// 	}

// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MetronomePlugin;

// 	constructor(app: App, plugin: MetronomePlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const { containerEl } = this;

// 		containerEl.empty();

// 		containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

// 		new Setting(containerEl)
// 			.setName("Setting #1")
// 			.setDesc("It's a secret")
// 			.addText((text) =>
// 				text
// 					.setPlaceholder("Enter your secret")
// 					.setValue(this.plugin.settings.mySetting)
// 					.onChange(async (value) => {
// 						console.log("Secret: " + value);
// 						this.plugin.settings.mySetting = value;
// 						await this.plugin.saveSettings();
// 					})
// 			);
// 	}
// }
