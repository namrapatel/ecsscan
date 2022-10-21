import { World as mudWorld, Component as mudComponent, EntityID, EntityIndex } from "@latticexyz/recs";

export type World = {
  entities: Entity[];
  records: Record[];
  rules: Rule[];
  mudWorld: mudWorld;
};

export type Entity = {
  id: EntityID;
  mudEntityIndex: EntityIndex;
  records: mudComponent[];
};

export type Record = {
  id: string;
  values: mudComponent["values"]; // TODO: Do we want to use MUD's value type?
  mudComponent: mudComponent;
  rules: Rule[];
};

export type Rule = {
  id: string;
  creator: string;
  records: Record[];
};
