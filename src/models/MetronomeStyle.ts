export type MetronomeStyle = "pulse" | "pendulum" | "line" | "dots";

export function isMetronomeStyle(
	inputStyle: string
): inputStyle is MetronomeStyle {
	return ["pulse", "pendulum", "line", "dots"].includes(inputStyle);
}
