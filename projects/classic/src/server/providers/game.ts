import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { AnyEntity, World } from "@rbxts/matter";
import { Provider } from "@rbxts/proton";
import { getOrError } from "@rbxts/shrouvengine";
import { ServerState } from "server/index.server";
import { Client } from "shared/components";

@Provider()
export class GameProvider {
	private maid = new Maid();

	private cleanup(world: World, state: ServerState, player: Player) {}

	private loadPlayerData(client: Client, state: ServerState) {
		return true;
	}

	saveAndCleanup(player: Player, state: ServerState, world: World) {
		this.cleanup(world, state, player);
	}

	setup(playerEntity: AnyEntity, world: World, state: ServerState, player: Player) {
		const client = getOrError(world, playerEntity, Client, "Client component not found for player entity");
		const playerData = this.loadPlayerData(client, state);
		if (!playerData) {
			Log.Fatal("Player data could not be loaded for {@Player}", client.player.Name);
			return;
		}
	}

	beginGameplayLoop(world: World, state: ServerState) {}
}
