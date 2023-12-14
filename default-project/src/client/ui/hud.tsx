import { useSpring } from "@rbxts/rbx-react-spring";
import Roact, { useContext, useState } from "@rbxts/roact";
import { ModalContext } from "./context/modal";
import { AspectRatio, Corner, Gradient, ImageButton, ImageLabel, ListLayout, Text } from "./library";
import { Container } from "./library/container";
import { Black, Silver } from "./library/gradients";
import { Ring } from "./library/modal";
import { Modal as IModal } from "./modals";

type IHUDButton = { Modal: IModal; Color: ColorSequence; Image: string };

function HUDButton({ Modal, Color, Image }: IHUDButton) {
	const [hovering, setHovering] = useState(false);
	const [openModal, setOpenModal] = useContext(ModalContext);

	const { size } = useSpring(
		{
			config: {
				mass: 0.5,
			},
			size: hovering ? UDim2.fromScale(0.249 * 1.5, 0.802 * 1.5) : UDim2.fromScale(0.249, 0.802),
		},
		[hovering],
	);

	return (
		<ImageButton
			key={Modal}
			AspectRatio={1}
			Size={size}
			Image={Image}
			MouseEnter={() => setHovering(true)}
			MouseLeave={() => setHovering(false)}
			Clicked={() => (openModal === Modal ? setOpenModal(undefined) : setOpenModal(Modal))}
		>
			<AspectRatio AspectRatio={1} />
			<Container
				Name="Main"
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={0}
			>
				<Corner CornerRadius={new UDim(1, 0)} />
				<Gradient Color={Black} />
				<Ring
					Color={Color}
					Size={UDim2.fromScale(0.882, 0.882)}
					AspectRatio={1}
					Image="rbxassetid://14799933945"
				/>
				<ImageLabel Size={UDim2.fromScale(0.676, 0.676)} Image={Image} />
				<Text Text={Modal} Position={UDim2.fromScale(0.5, 0.895)} Size={UDim2.fromScale(0.992, 0.256)} />
			</Container>
		</ImageButton>
	);
}

function RightContainer() {
	return (
		<Container
			Name="RightContainer"
			AspectRatio={0.692}
			Position={UDim2.fromScale(0.9, 0.5)}
			Size={UDim2.fromScale(0.178, 0.458)}
		>
			<Container
				Name="Main"
				AspectRatio={1.819}
				Position={UDim2.fromScale(0.5, 0.81)}
				Size={UDim2.fromScale(1, 0.381)}
			>
				<ListLayout
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				/>
			</Container>
		</Container>
	);
}

function LeftContainer() {
	return (
		<Container
			Name="LeftContainer"
			AspectRatio={0.692}
			Position={UDim2.fromScale(0.1, 0.5)}
			Size={UDim2.fromScale(0.178, 0.458)}
		>
			<Container
				Name="Main"
				AspectRatio={1.819}
				Position={UDim2.fromScale(0.5, 0.81)}
				Size={UDim2.fromScale(1, 0.381)}
			>
				<ListLayout
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				/>
				<Container Name="Top" AspectRatio={3.6} Size={UDim2.fromScale(1, 0.505)}>
					<HUDButton Modal="Settings" Image="rbxassetid://14801559699" Color={Silver} />
				</Container>
			</Container>
		</Container>
	);
}

export function HUD() {
	return (
		<Container AspectRatio={1.781} Size={UDim2.fromScale(1, 1)}>
			<LeftContainer />
			<RightContainer />
		</Container>
	);
}
