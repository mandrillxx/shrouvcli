import { World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Renderable } from "shared/components";

const name = RunService.IsServer() ? "serverEntityId" : "clientEntityId";

function hoverSelection(world: World) {
	for (const [id, record] of world.queryChanged(Renderable)) {
		if (record.new) {
			record.new.model.SetAttribute(name, id);
		}
	}
}

export = hoverSelection;
