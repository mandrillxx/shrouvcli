import { component } from "@rbxts/matter";

export const Renderable = component<{
	model: Model;
	doNotDestroy?: boolean;
}>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{
	cf: CFrame;
	doNotReconcile?: boolean;
}>("Transform");
export type Transform = ReturnType<typeof Transform>;

export const Body = component<{ model: BaseCharacter }>("Body");
export type Body = ReturnType<typeof Body>;
