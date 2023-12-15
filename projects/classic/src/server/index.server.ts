import { New } from "@rbxts/fusion";
import Log, { Logger } from "@rbxts/log";
import { AnyEntity } from "@rbxts/matter";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { Proton } from "@rbxts/proton";
import { createBroadcaster } from "@rbxts/reflex";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { BaseState } from "@rbxts/shrouvengine";
import { Body, Client, Renderable } from "shared/components";
import { Network } from "shared/network";
import { setupTags } from "shared/setupTags";
import { slices } from "shared/slices";
import { start } from "shared/start";
import { IProfile } from "./data";
import { GameProvider } from "./providers/game";
import { store } from "./store";

Proton.awaitStart();

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

declare const script: { systems: Folder };
export interface ServerState extends BaseState {
	clients: Map<number, AnyEntity>;
	profiles: Map<Player, Profile<IProfile, unknown>>;
}

const state: ServerState = {
	debug: true,
	verbose: true,
	clients: new Map(),
	profiles: new Map(),
};

const world = start([script.systems, ReplicatedStorage.Shared.systems], state)(setupTags);
const gameProvider = Proton.get(GameProvider);

const ProfileTemplate: IProfile = {
	logInTimes: 0,
	money: 0,
};

const GameProfileStore = ProfileService.GetProfileStore("PlayerData", ProfileTemplate);

async function bootstrap() {
	function playerRemoving(player: Player) {
		state.clients.delete(player.UserId);
		const profile = state.profiles.get(player);
		if (profile) {
			profile.Release();
			state.profiles.delete(player);
		}
		gameProvider.saveAndCleanup(player, state, world);
	}
	function playerAdded(player: Player) {
		function handleData() {
			const profile = GameProfileStore.LoadProfileAsync("Player_" + player.UserId);
			if (!profile) {
				return player.Kick("Failed to load profile");
			}
			profile.AddUserId(player.UserId);
			profile.Reconcile();
			profile.ListenToRelease(() => {
				state.profiles.delete(player);
				player.Kick("Session was terminated");
			});
			if (player.IsDescendantOf(Players)) {
				const leaderstats = New("Folder")({
					Name: "leaderstats",
					Parent: player,
				});

				return state.profiles.set(player, profile);
			}
			return profile.Release();
		}

		function characterAdded(character: Model) {
			const model = character as BaseCharacter;

			const playerEntity = world.spawn(
				Client({
					player,
					document: {
						coinMultiplier: 1,
					},
				}),
				Body({
					model,
				}),
				Renderable({
					model,
				}),
			);

			state.clients.set(player.UserId, playerEntity);
			gameProvider.setup(playerEntity, world, state, player);
		}

		handleData();

		if (player.Character) characterAdded(player.Character);
		player.CharacterAdded.Connect(characterAdded);
	}

	Players.PlayerAdded.Connect(playerAdded);
	Players.PlayerRemoving.Connect(playerRemoving);
	for (const player of Players.GetPlayers()) {
		playerAdded(player);
	}

	gameProvider.beginGameplayLoop(world, state);

	const broadcaster = createBroadcaster({
		producers: slices,
		dispatch: (player, actions) => {
			Network.dispatch.server.fire(player, actions);
		},
	});

	Network.start.server.connect((player) => {
		broadcaster.start(player);
	});

	store.applyMiddleware(broadcaster.middleware);
}

bootstrap().done((status) => {
	Log.Info("Bootstrap complete with status {@Status}", status);
});
