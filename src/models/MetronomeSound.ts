export type MetronomeSound = "click" | "beep";

export function isMetronomeSound(
	inputSound: string
): inputSound is MetronomeSound {
	return ["click", "beep"].includes(inputSound);
}
