interface Workspace extends Instance {}

interface ReplicatedStorage extends Instance {
	Shared: Folder & {
		systems: Folder;
	};
	Client: Folder & {
		systems: Folder;
	};
}

interface SoundService extends Instance {}

type BaseCharacter = Model & {
	Humanoid: Humanoid;
	Body: MeshPart;
	HumanoidRootPart: BasePart;
};

declare namespace JSX {
	interface IntrinsicElements {
		blureffect: JSX.IntrinsicElement<BlurEffect>;
	}
}
