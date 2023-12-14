import { World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Renderable } from "shared/components";

const name = RunService.IsServer() ? "serverEntityId" : "clientEntityId";

function updateRenderableAttribute(world: World) {
	for (const [id, renderable] of world.queryChanged(Renderable)) {
		if (renderable.new) {
			renderable.new.model.SetAttribute(name, id);
		}
	}
}

export = updateRenderableAttribute;
