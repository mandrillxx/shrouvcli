import { NetEvent, NetEventType } from "@rbxts/proton";
import { BroadcastAction } from "@rbxts/reflex";

export namespace Network {
	export const dispatch = new NetEvent<[actions: BroadcastAction[]], NetEventType.ServerToClient>();
	export const start = new NetEvent<[], NetEventType.ClientToServer>();
}
