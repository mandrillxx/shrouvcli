import Roact from "@rbxts/roact";
import { AspectRatio, BaseProps, Frame } from ".";

type IContainer = Roact.PropsWithChildren<BaseProps<Frame>> & { AspectRatio?: number };

export function Container({
	Name,
	Position,
	Size,
	BackgroundTransparency,
	AspectRatio: IAspectRatio,
	children,
}: IContainer) {
	return (
		<Frame
			Name={Name ?? "Container"}
			BackgroundTransparency={BackgroundTransparency ?? 1}
			Position={Position}
			Size={Size ?? UDim2.fromScale(0.5, 0.5)}
		>
			{IAspectRatio !== undefined && <AspectRatio AspectRatio={IAspectRatio} />}
			{children}
		</Frame>
	);
}
