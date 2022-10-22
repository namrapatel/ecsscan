import { EntityIndex } from "@latticexyz/recs";
import type { Opaque } from "type-fest";
import { exec } from "node:child_process";

// Helper function that creates an EntityIndex from a number as required by @latticexyz/recs
export function createEntityIndex(index: number): EntityIndex {
  return index as Opaque<number, "EntityIndex">;
}

export function getComponentRegistryAddress(worldAddress: string): string {
  let componentsRegistryAddr = "";

  exec("cast call " + worldAddress + ' \\ "components()" ', (err, output) => {
    if (err) {
      console.error("could not execute command: ", err);
      return;
    }

    // Get last 42 chars of output
    const temp = output.slice(-42);
    componentsRegistryAddr = "0x" + temp;
    console.log("ComponentRegistryAddress: \n", componentsRegistryAddr);
  });
  return componentsRegistryAddr;
}

export function getSystemsRegistryAddress(worldAddress: string): string {
  let systemsRegistryAddr = "";

  exec("cast call " + worldAddress + ' \\ "systems()" ', (err, output) => {
    if (err) {
      console.error("could not execute command: ", err);
      return;
    }

    // Get last 42 chars of output
    const temp = output.slice(-42);
    systemsRegistryAddr = "0x" + temp;
    console.log("SystemsRegistryAddress: \n", systemsRegistryAddr);
  });
  return systemsRegistryAddr;
}
