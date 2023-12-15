import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/slices";

type Store = typeof store;

export type RootState = InferState<Store>;

export const store = combineProducers({
	...slices,
});
