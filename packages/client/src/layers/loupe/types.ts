import { World as mudWorld, Component as mudComponent, EntityID, EntityIndex } from "@latticexyz/recs";
import { MUDJsonRpcBatchProvider, MUDJsonRpcProvider } from "@latticexyz/network/dist/provider";
import { WebSocketProvider } from "@ethersproject/providers";

export type World = {
  address: string | null;
  entities: Entity[];
  records: Record[];
  rules: Rule[];
  componentRegistryAddress: string;
  systemsRegistryAddress: string;
  mudWorld: mudWorld;
};

export type Entity = {
  id: EntityID;
  records: Record[];
  mudEntityIndex: EntityIndex;
  mudComponents: mudComponent[];
};

export type Record = {
  id: string;
  address: string;
  values: mudComponent["values"]; // TODO: Do we want to use MUD's value type?
  readers: Rule[];
  writers: Rule[];
  creator: string;
  mudComponent: mudComponent;
};

export type Rule = {
  id: string;
  address: string;
  readsRecords: Record[];
  writesRecords: Record[];
  creator: string;
  abi: JSON; // TODO: Does this work?
};

export type Provider = {
  json: MUDJsonRpcProvider | MUDJsonRpcBatchProvider;
  ws: WebSocketProvider | undefined;
};

export type ComponentMetadata = {
  contractId: string;
};
