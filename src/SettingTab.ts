import { App, DropdownComponent, PluginSettingTab, Setting, TextComponent } from "obsidian";
import MetronomePlugin from "./main";
import { MetronomeSize } from "@/models/MetronomeSize";
import { MetronomeStyle } from "@/models/MetronomeStyle";
import { MetronomeInstrument } from "@/models/MetronomeInstrument";

export class MetronomeSettingTab extends PluginSettingTab {
	plugin: MetronomePlugin;

	constructor(app: App, plugin: MetronomePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private setTextDisabled(text: TextComponent, disabled: boolean): void {
		text.setDisabled(disabled);
		text.inputEl.toggleClass("metronome-setting-field-disabled", disabled);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		if (
			this.plugin.settings.size === "small" &&
			this.plugin.settings.style !== "pulse"
		) {
			this.plugin.settings.style = "pulse";
			this.plugin.saveSettings();
		}

		let styleDropdown: DropdownComponent;
		let countdownDurationText: TextComponent;
		let tickNotesText: TextComponent;
		let tockNotesText: TextComponent;
		let tempoPropertyNameText: TextComponent;
		let meterPropertyNameText: TextComponent;

		new Setting(containerEl)
			.setName("Use note properties")
			.setDesc(
				"Whether or not to read the tempo and time signature from the note's frontmatter properties when they are not set in the metronome code block."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.useFrontmatterProperties)
					.onChange(async (value) => {
						this.plugin.settings.useFrontmatterProperties = value;
						this.setTextDisabled(tempoPropertyNameText, !value);
						this.setTextDisabled(meterPropertyNameText, !value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Tempo property name")
			.setDesc(
				"The name of the note property to read the tempo (BPM) from, when reading from note properties is enabled."
			)
			.addText((text) => {
				tempoPropertyNameText = text
					.setPlaceholder("bpm")
					.setValue(this.plugin.settings.tempoPropertyName)
					.onChange(async (value) => {
						this.plugin.settings.tempoPropertyName = value;
						await this.plugin.saveSettings();
					});
				this.setTextDisabled(
					tempoPropertyNameText,
					!this.plugin.settings.useFrontmatterProperties
				);
			});

		new Setting(containerEl)
			.setName("Meter property name")
			.setDesc(
				"The name of the note property to read the time signature (meter) from, when reading from note properties is enabled."
			)
			.addText((text) => {
				meterPropertyNameText = text
					.setPlaceholder("meter")
					.setValue(this.plugin.settings.meterPropertyName)
					.onChange(async (value) => {
						this.plugin.settings.meterPropertyName = value;
						await this.plugin.saveSettings();
					});
				this.setTextDisabled(
					meterPropertyNameText,
					!this.plugin.settings.useFrontmatterProperties
				);
			});

		new Setting(containerEl)
			.setName("Meter")
			.setDesc(
				"The time signature (meter) to play in. The bottom number must be 1, 2, 4, 8, 16, 32, or 64. Examples: 4/4, 3/4, 6/8, 12/8."
			)
			.addText((text) =>
				text
					.setPlaceholder("4/4")
					.setValue(this.plugin.settings.meter)
					.onChange(async (value) => {
						this.plugin.settings.meter = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Muted")
			.setDesc("Whether or not the metronome's audio starts muted.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.muted)
					.onChange(async (value) => {
						this.plugin.settings.muted = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Auto start")
			.setDesc(
				"Whether or not the metronome starts flashing visually right away. If auto start is on and muted is off, then the metronome's sound will also start playing immediately."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoStart)
					.onChange(async (value) => {
						this.plugin.settings.autoStart = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Stop after")
			.setDesc(
				"Automatically stop the metronome after the given duration, like 30s, 1h, or 1h30m. Leave blank to never automatically stop."
			)
			.addText((text) =>
				text
					.setPlaceholder("30s, 1h, 1h30m")
					.setValue(this.plugin.settings.stopAfter)
					.onChange(async (value) => {
						this.plugin.settings.stopAfter = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Countdown")
			.setDesc(
				'When used in conjunction with stop after, this controls how long the "Stopping in..." countdown button appears for before the metronome automatically stops. Choose "Always" to always show the countdown, or "Duration" to only show it for the given duration before stopping.'
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						duration: "Duration",
						always: "Always",
					})
					.setValue(this.plugin.settings.countdownMode)
					.onChange(async (value: "always" | "duration") => {
						this.plugin.settings.countdownMode = value;
						this.setTextDisabled(
							countdownDurationText,
							value === "always"
						);
						await this.plugin.saveSettings();
					})
			)
			.addText((text) => {
				countdownDurationText = text
					.setPlaceholder("10s")
					.setValue(this.plugin.settings.countdownDuration)
					.onChange(async (value) => {
						this.plugin.settings.countdownDuration = value;
						await this.plugin.saveSettings();
					});
				this.setTextDisabled(
					countdownDurationText,
					this.plugin.settings.countdownMode === "always"
				);
			});

		new Setting(containerEl)
			.setName("Size")
			.setDesc("Control the size of the metronome in the note.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						small: "Small",
						medium: "Medium",
						large: "Large",
						xlarge: "X-Large",
					})
					.setValue(this.plugin.settings.size)
					.onChange(async (value: MetronomeSize) => {
						this.plugin.settings.size = value;
						if (value === "small") {
							this.plugin.settings.style = "pulse";
							styleDropdown.setValue("pulse");
						}
						styleDropdown.setDisabled(value === "small");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Style")
			.setDesc(
				"Control the style of the metronome. Pulse makes the whole area flash color. Pendulum shows an illustration of a metronome with a swinging pendulum. Line shows a vertical line moving left and right. Dots shows dots. Only pulse is available when size is small. The other styles are only available on size medium and up."
			)
			.addDropdown((dropdown) => {
				styleDropdown = dropdown
					.addOptions({
						pulse: "Pulse",
						pendulum: "Pendulum",
						line: "Line",
						dots: "Dots",
					})
					.setValue(this.plugin.settings.style)
					.onChange(async (value: MetronomeStyle) => {
						this.plugin.settings.style = value;
						await this.plugin.saveSettings();
					});
				styleDropdown.setDisabled(this.plugin.settings.size === "small");
			});

		new Setting(containerEl)
			.setName("Instrument")
			.setDesc("Change the metronome's instrument.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						click: "Click",
						beep: "Beep",
						AMSynth: "AMSynth",
						DuoSynth: "DuoSynth",
						FMSynth: "FMSynth",
						MembraneSynth: "MembraneSynth",
						MetalSynth: "MetalSynth",
						MonoSynth: "MonoSynth",
						PluckSynth: "PluckSynth",
						WoodBlock: "WoodBlock",
					})
					.setValue(this.plugin.settings.instrument)
					.onChange(async (value: MetronomeInstrument) => {
						this.plugin.settings.instrument = value;
						this.setTextDisabled(tickNotesText, value === "click");
						this.setTextDisabled(tockNotesText, value === "click");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Tick notes")
			.setDesc(
				"This determines the note(s) played on the downbeat, specified in scientific pitch notation (for example, middle C is C4). Multiple tones can be played at the same time by providing a comma-separated list of tones. If there is no meter, every beat is considered a downbeat."
			)
			.addText((text) => {
				tickNotesText = text
					.setPlaceholder("C6")
					.setValue(this.plugin.settings.tickNotes)
					.onChange(async (value) => {
						this.plugin.settings.tickNotes = value;
						await this.plugin.saveSettings();
					});
				this.setTextDisabled(
					tickNotesText,
					this.plugin.settings.instrument === "click"
				);
			});

		new Setting(containerEl)
			.setName("Tock notes")
			.setDesc(
				"This determines the note(s) played on the upbeat, specified in scientific pitch notation (for example, middle C is C4). Multiple tones can be played at the same time by providing a comma-separated list of tones. If there is no meter, every beat is considered a downbeat."
			)
			.addText((text) => {
				tockNotesText = text
					.setPlaceholder("C5")
					.setValue(this.plugin.settings.tockNotes)
					.onChange(async (value) => {
						this.plugin.settings.tockNotes = value;
						await this.plugin.saveSettings();
					});
				this.setTextDisabled(
					tockNotesText,
					this.plugin.settings.instrument === "click"
				);
			});
	}
}
