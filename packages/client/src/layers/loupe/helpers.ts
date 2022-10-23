import { EntityIndex } from "@latticexyz/recs";
import type { Opaque } from "type-fest";
import { Provider, Rule } from "./types";
import { call } from "./utils";

export async function getWritersByRecord(
  recordAddress: string,
  rulesAddresses: string[],
  provider: Provider
): Promise<Rule[]> {
  const recordWriters: Rule[] = [];

  for (let i = 0; i < rulesAddresses.length; i++) {
    const functionSignature = "0x861eb905"; // writeAccess(address)

    // Remove first two chars of address (the "0x")
    const recordAddressWithout0x = recordAddress[i].slice(2);

    const result = await call(provider, recordAddress, functionSignature + recordAddressWithout0x); // writeAccess(address) + recordAddress
    console.log("result: " + result);
  }
  return recordWriters;
}
