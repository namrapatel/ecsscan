import { Component } from "@latticexyz/recs";

export type Entity = {
  id: string;
  entityIndex: number;
  records: Component[];
};

export type Rule = {
  id: string;
  records: Component[];
};
