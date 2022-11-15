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
  signerRegistryAddress: string;
  mudWorld: mudWorld;
};

export type Entity = {
  id: EntityID;
  isSigner: boolean;
  records: EntitySpecificRecord[]; // TODO: Is this the best way to represent this?
  mudEntityIndex: EntityIndex;
  mudComponents: mudComponent[];
};

export type Record = {
  id: string;
  address: string;
  values: EntityToValueMap[];
  readers: RecordSpecificRule[];
  writers: RecordSpecificRule[];
  creator: string;
  mudComponent: mudComponent;
};

export type Rule = {
  id: string;
  address: string;
  readsRecords: RuleSpecificRecord[];
  writesRecords: RuleSpecificRecord[];
  creator: string;
  metadataURL: string;
};

export type Provider = {
  json: MUDJsonRpcProvider | MUDJsonRpcBatchProvider;
  ws: WebSocketProvider | undefined;
};

export type EntitySpecificRecord = {
  id: string;
  address: string;
  value: any; // TODO
};

export type RecordSpecificRule = {
  id: string;
  address: string;
};

export type RuleSpecificRecord = {
  id: string;
  address: string;
};

export type EntityToValueMap = {
  [key: string]: any;
};
