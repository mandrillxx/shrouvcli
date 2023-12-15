import { createProducer } from "@rbxts/reflex";
import { ClientState as IClientState } from "@rbxts/shrouvengine";

export interface ClientState extends Readonly<IClientState> {}

const initialState: ClientState = {
  character: undefined as unknown as BaseCharacter,
  debug: true,
  entityIdMap: new Map(),
  playerId: undefined,
};

export const clientSlice = createProducer(initialState, {
  setClientState: (state, data: Partial<ClientState>) => ({
    ...state,
    ...data,
  }),
});
