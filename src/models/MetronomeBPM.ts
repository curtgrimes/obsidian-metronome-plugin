import { BPM } from "@vapurrmaid/bpm";

import { Meter } from "./Meter";

export class MetronomeBPM {
	bpm: number;

	constructor(bpm: number | string) {
		this.bpm = parseFloat(bpm as string);
	}

	getBeatDurationSeconds(meter: Meter): number {
		return this.isValid()
			? new BPM(this.bpm || 0).durationFor(
					(meter && meter.noteDuration()) || "quarter"
			  )
			: Number.MAX_SAFE_INTEGER;
	}

	isValid() {
		return !isNaN(this.bpm) && this.bpm > 0 && this.bpm < 10000;
	}

	isSuperFast() {
		return this.bpm >= 500;
	}

	toString() {
		return this.isValid() ? `${String(this.bpm)} BPM` : "⚠️ Invalid BPM";
	}
}
