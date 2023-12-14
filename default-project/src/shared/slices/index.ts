import { CombineStates } from "@rbxts/reflex";
import { clientSlice } from "./state";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	client: clientSlice,
};
