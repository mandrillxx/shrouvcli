import { ReflexProvider } from "@rbxts/react-reflex";
import Roact, { useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { clientStore } from "client/store";
import { ModalContext } from "./context/modal";
import { Modal } from "./modals";
import { Overlay } from "./overlay";

const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();

export function App() {
	const [openModal, setOpenModal] = useState<Modal>();

	return (
		<ReflexProvider producer={clientStore}>
			<ModalContext.Provider value={[openModal, setOpenModal]}>
				{IS_EDIT ? (
					<Overlay />
				) : (
					<screengui ResetOnSpawn={false} ZIndexBehavior="Sibling" IgnoreGuiInset>
						<Overlay />
					</screengui>
				)}
			</ModalContext.Provider>
		</ReflexProvider>
	);
}
