import { World as mudWorld, Component as mudComponent, EntityID, EntityIndex } from "@latticexyz/recs";

export type World = {
  address: string;
  entities: Entity[];
  records: Record[];
  rules: Rule[];
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
