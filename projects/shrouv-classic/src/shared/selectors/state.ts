import { SharedState } from "shared/slices";

export const selectClientState = () => {
	return (state: SharedState) => {
		return state.client;
	};
};
