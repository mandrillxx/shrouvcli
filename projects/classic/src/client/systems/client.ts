import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { ClientState } from "@rbxts/shrouvengine";

const player = Players.LocalPlayer;

function client(world: World, state: ClientState) {}

export = {
	priority: math.huge,
	system: client,
};
