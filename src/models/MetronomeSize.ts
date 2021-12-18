export type MetronomeSize = "small" | "medium" | "large";

export function isMetronomeSize(inputSize: string): inputSize is MetronomeSize {
	return ["small", "medium", "large"].includes(inputSize);
}
