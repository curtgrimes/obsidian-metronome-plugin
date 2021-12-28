import { BPM } from "@vapurrmaid/bpm";
import { Ref } from "vue";
import t from "../i18n/locale";
import { Meter } from "./Meter";

// @ts-ignore
import { evalExpression } from "@hkh12/node-calc";

export class MetronomeBPM {
	bpm: number;

	constructor(bpm: number | string) {
		try {
			this.bpm = evalExpression(bpm);
		} catch (e) {
			console.error("Could not calculate BPM", e);
			this.bpm = NaN;
		}
	}

	getBeatDurationSeconds(meter: Ref<Meter>): number {
		return this.isValid()
			? new BPM(this.bpm || 0).durationFor(
					meter?.value?.noteDuration() || "quarter"
			  )
			: 999;
	}

	isValid() {
		return !isNaN(this.bpm) && this.bpm > 0 && this.bpm < 10000;
	}

	isSuperFast() {
		return this.bpm >= 500;
	}

	toString() {
		return this.isValid()
			? t(`%1 BPM`, String(this.bpm))
			: `⚠️ ${t("Invalid BPM")}`;
	}
}
