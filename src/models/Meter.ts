import { NoteDuration } from "@vapurrmaid/bpm";
import t from "../i18n/locale";

export class Meter {
	upper: number;
	lower: number;

	constructor(upper: number, lower: number) {
		this.upper = upper;
		this.lower = lower;
	}

	noteDuration(): NoteDuration {
		switch (this.lower) {
			case 64:
				return "sixtyfourth";
			case 32:
				return "thirtysecondth";
			case 16:
				return "sixteenth";
			case 8:
				return "eigth";
			case 4:
				return "quarter";
			case 2:
				return "half";
			case 1:
				return "whole";
			default:
				return null;
		}
	}

	isValid() {
		return (
			!isNaN(this.upper) &&
			!isNaN(this.lower) &&
			this.upper > 0 &&
			this.lower > 0
		);
	}

	toString() {
		return this.isValid() && this.noteDuration()
			? `${this.upper}/${this.lower}`
			: t("Invalid or unsupported meter");
	}

	static fromString(unparsedMeterString: string) {
		const meterSplit = (unparsedMeterString || "").split("/");
		const upper = parseInt(meterSplit?.[0]);
		const lower = parseInt(meterSplit?.[1]);

		return new Meter(upper, lower);
	}
}
