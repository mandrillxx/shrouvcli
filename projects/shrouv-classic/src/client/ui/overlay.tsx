import Roact from "@rbxts/roact";
import { HUD } from "./hud";
import { ModalProvider } from "./modals";

export function Overlay() {
	return (
		<>
			<ModalProvider />
			<HUD />
		</>
	);
}
