import { EntityIndex } from "@latticexyz/recs";
import type { Opaque } from "type-fest";
import { exec } from "child_process";

// Helper function that creates an EntityIndex from a number as required by @latticexyz/recs
export function createEntityIndex(index: number): EntityIndex {
  return index as Opaque<number, "EntityIndex">;
}

export function castCall(address: string, functionSignature: string, calldata: string): string {
  let result = "";

  exec("cast call " + address + ' \\ "' + functionSignature + '" ' + calldata, (err, output) => {
    if (err) {
      console.error("could not execute command: ", err);
      return;
    }
    result = output;
  });
  return result;
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

export function getOwner(address: string): string {
  let owner = "";

  exec("cast owner " + address + "owner()", (err, output) => {
    if (err) {
      console.error("could not execute command: ", err);
      return;
    }

    // Get last 42 chars of output, which is the address of the registry
    const temp = output.slice(-42);
    owner = "0x" + temp;
    console.log("Owner Address: \n", owner);
  });
  return owner;
}
