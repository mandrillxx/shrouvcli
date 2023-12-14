import { Workspace } from "@rbxts/services";

const camera = Workspace.CurrentCamera;

export function useCamera() {
	return camera!;
}
