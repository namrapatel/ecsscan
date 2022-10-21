import { EntityIndex } from "@latticexyz/recs";
import type { Opaque } from "type-fest";

// Helper function that creates an EntityIndex from a number as required by @latticexyz/recs
export function createEntityIndex(index: number): EntityIndex {
  return index as Opaque<number, "EntityIndex">;
}
