import Log, { Logger } from "@rbxts/log";
import { Proton } from "@rbxts/proton";
import { createBroadcastReceiver } from "@rbxts/reflex";
import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { Network } from "shared/network";
import { start } from "shared/start";
import { receiveReplication } from "./receiveReplication";
import { clientStore } from "./store";
import { App } from "./ui/app";

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

const player = Players.LocalPlayer;
const character = (player.Character || player.CharacterAdded.Wait()[0]) as BaseCharacter;

start([ReplicatedStorage.Client.systems, ReplicatedStorage.Shared.systems], clientStore)(receiveReplication);

async function bootstrap() {
	while (!clientStore.getState().client.playerId) {
		task.wait(0.1);
	}

	Roact.mount(<App />, player.FindFirstChildWhichIsA("PlayerGui")!);

	const receiver = createBroadcastReceiver({
		start: () => {
			Network.start.client.fire();
		},
	});

	clientStore.applyMiddleware(receiver.middleware);

	Network.dispatch.client.connect((actions) => {
		receiver.dispatch(actions);
	});
}

bootstrap()
	.done((status) => {
		Log.Info("Client Bootstrap complete with status {@Status}", status);
	})
	.catch(Log.Error);
