import { useSpring } from "@rbxts/rbx-react-spring";
import Roact, { useContext, useState } from "@rbxts/roact";
import {
	AspectRatio,
	BackgroundBlur,
	BaseProps,
	Corner,
	Frame,
	Gradient,
	ImageButton,
	ImageLabel,
	Stroke,
	Text,
} from ".";

type IRing = BaseProps<ImageLabel> & { Color: ColorSequence; AspectRatio?: number; Image?: string };

export function Ring({ Position, Size, Color, AspectRatio: IAspectRatio, Image }: IRing) {
	return (
		<ImageLabel
			Name="Ring"
			Position={Position}
			Size={Size ?? UDim2.fromScale(0.987, 0.976)}
			Image={Image ?? "rbxassetid://14800624185"}
		>
			<Gradient Color={Color} />
			{IAspectRatio !== undefined && <AspectRatio AspectRatio={IAspectRatio} />}
		</ImageLabel>
	);
}

type IHeader = { Title: string; Color: ColorSequence };

export function Header({ Title, Color }: IHeader) {
	return (
		<Frame Name="Header" Position={UDim2.fromScale(0.268, 0.045)} Size={UDim2.fromScale(0.552, 0.15)}>
			<AspectRatio AspectRatio={6.653} />
			<ImageLabel
				Name="Main"
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Image={"rbxassetid://14800937055"}
				ImageColor3={Color3.fromRGB(24, 24, 24)}
			>
				<Ring AspectRatio={7.839} Color={Color} Image="rbxassetid://14800942412" />
				<Text Position={UDim2.fromScale(0.5, 0.447)} Size={UDim2.fromScale(0.298, 0.556)} Text={Title} />
			</ImageLabel>
		</Frame>
	);
}
