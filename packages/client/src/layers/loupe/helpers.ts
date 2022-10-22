import { EntityIndex } from "@latticexyz/recs";
import type { Opaque } from "type-fest";
import { Provider } from "./types";

// Helper function that creates an EntityIndex from a number as required by @latticexyz/recs
export function createEntityIndex(index: number): EntityIndex {
  return index as Opaque<number, "EntityIndex">;
}

export async function getAddressCall(
  provider: Provider,
  contractAddress: string,
  functionSignature: string
): Promise<string> {
  const result = await provider.json.call({
    to: contractAddress,
    data: functionSignature,
  });

  return result;
}
