import { Component, EntityID, EntityIndex } from "@latticexyz/recs";

export type Entity = {
  id: EntityID;
  entityIndex: EntityIndex;
  records: Component[];
};

export type Rule = {
  id: string;
  records: Component[];
};
