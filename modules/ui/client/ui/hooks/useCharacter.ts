import { useAsync, useEventListener } from "@rbxts/pretty-react-hooks";
import promiseR15, { CharacterRigR15 } from "@rbxts/promise-character";
import { useState } from "@rbxts/roact";

export function useCharacter(player: Player): CharacterRigR15 | undefined {
	const [model, setModel] = useState(player.Character);

	const [character] = useAsync(async () => {
		return model && promiseR15(model);
	}, [model]);

	useEventListener(player.CharacterAdded, (character) => {
		setModel(character);
	});

	useEventListener(player.CharacterRemoving, () => {
		setModel(undefined);
	});

	return character;
}
