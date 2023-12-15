import { useSpring } from "@rbxts/rbx-react-spring";
import Roact, { useContext, useState } from "@rbxts/roact";
import {
	AspectRatio,
	BackgroundBlur,
	BaseProps,
	Corner,
	Gradient,
	Header,
	ImageButton,
	ImageLabel,
	Ring,
	Stroke,
	Text,
} from "@rbxts/shrouvengine";
import { ModalContext } from "../context/modal";

type IModal = Roact.PropsWithChildren<
	BaseProps<ImageLabel> & { Name: string; RingColor: ColorSequence; Color: ColorSequence }
>;

export function Modal({ Name, Image, Color, RingColor, children }: IModal) {
	const [openModal, setOpenModal] = useContext(ModalContext);
	const visible = openModal === Name;

	const { position } = useSpring(
		{
			config: {
				mass: 1,
				friction: 20,
				tension: 150,
			},
			position: visible ? UDim2.fromScale(0.5, 0.5) : UDim2.fromScale(0.5, 2.5),
		},
		[visible],
	);

	return (
		<ImageLabel key={Name ?? "Modal"} Position={position} Size={UDim2.fromScale(0.984, 0.945)} Image={Image}>
			<BackgroundBlur blurSize={visible ? 50 : 0} />
			<AspectRatio AspectRatio={1.804} />
			<Gradient Color={Color} />
			<Ring AspectRatio={1.824} Color={RingColor} />
			<Header Title={openModal ?? "Title"} Color={RingColor} />
			<Close />
			{children}
		</ImageLabel>
	);
}

function Close() {
	const [hovering, setHovering] = useState(false);
	const [openModal, setOpenModal] = useContext(ModalContext);

	const { size } = useSpring(
		{
			config: {
				mass: 0.5,
			},
			size: hovering ? UDim2.fromScale(0.068 * 1.5, 0.122 * 1.5) : UDim2.fromScale(0.068, 0.122),
		},
		[hovering],
	);

	return (
		<ImageButton
			Name="Close"
			AspectRatio={1}
			Position={UDim2.fromScale(1, 0)}
			Size={size}
			BackgroundTransparency={0}
			Clicked={() => setOpenModal(undefined)}
			MouseEnter={() => setHovering(true)}
			MouseLeave={() => setHovering(false)}
		>
			<Gradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(199, 35, 34)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(225, 53, 52)),
					])
				}
			/>
			<Stroke Thickness={4} />
			<Corner CornerRadius={new UDim(1, 0)} />
			<Text Size={UDim2.fromScale(0.649, 0.672)} Text="X" />
		</ImageButton>
	);
}
