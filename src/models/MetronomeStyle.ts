export type MetronomeStyle = "pulse" | "pendulum" | "line";

export function isMetronomeStyle(
	inputStyle: string
): inputStyle is MetronomeStyle {
	return ["pulse", "pendulum", "line"].includes(inputStyle);
}
