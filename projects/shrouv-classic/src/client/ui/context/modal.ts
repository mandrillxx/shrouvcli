import { createContext } from "@rbxts/roact";
import { Modal } from "../modals";

export const ModalContext = createContext<[modal: Modal, setModal: (modal: Modal) => void]>([
	undefined,
	undefined as unknown as (modal: Modal) => void,
]);
