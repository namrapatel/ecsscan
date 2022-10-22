import { EntityIndex } from "@latticexyz/recs";
import type { Opaque } from "type-fest";
import { exec } from "node:child_process";

// Helper function that creates an EntityIndex from a number as required by @latticexyz/recs
export function createEntityIndex(index: number): EntityIndex {
  return index as Opaque<number, "EntityIndex">;
}

// Accepts "components()" or "systems()" as input and returns the address of the respective registry
export function getRegistryAddress(worldAddress: string, componentOrSystem: string): string {
  let registryAddress = "";

  exec("cast call " + worldAddress + ' \\ "' + componentOrSystem + '"', (err, output) => {
    if (err) {
      console.error("could not execute command: ", err);
      return;
    }

    // Get last 42 chars of output, which is the address of the registry
    const temp = output.slice(-42);
    registryAddress = "0x" + temp;
    console.log("Registry Address: \n", registryAddress);
  });
  return registryAddress;
}
