export type MetronomeSize = "small" | "medium" | "large" | "xlarge";

export function isMetronomeSize(inputSize: string): inputSize is MetronomeSize {
	return ["small", "medium", "large", "xlarge"].includes(inputSize);
}
