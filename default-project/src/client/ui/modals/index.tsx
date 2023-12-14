import Roact, { Element, useContext } from "@rbxts/roact";
import { ModalContext } from "../context/modal";
import { Settings } from "./settings";

export * from "./settings";

export type IModal = { Visible: boolean };
export type Modal = "Codes" | "Quests" | "Settings" | "Inventory" | "Shop" | "Crafting" | undefined;

export const Modals: { Component: ({ Visible }: IModal) => Element; Name: string }[] = [
	{ Name: "Settings", Component: Settings },
];

export function ModalProvider() {
	const [openModal, setOpenModal] = useContext(ModalContext);

	return (
		<>
			{Modals.map((Modal) => (
				<Modal.Component Visible={openModal === Modal.Name} />
			))}
		</>
	);
}
