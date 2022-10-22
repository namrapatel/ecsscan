import { createEntityIndex, getComponentRegistryAddress } from "./helpers";
import { Entity, Rule, Record } from "./types";
import { World, Component, getEntityComponents, getComponentEntities } from "@latticexyz/recs";
import { exec } from "node:child_process";

getRecordAddresses();

export function getRecordReaders(): Rule[] {
  // run the `ls` command using exec
  exec("cd packages/contracts && forge build && bash exports.sh", (err, output) => {
    // once the command has completed, the callback function is called

    // Read the files in /out folder, if the last 7 letters are System.json
    // then go into the file and get the deployedBytecode.
    // Then parse the deployedBytecode and see if any addresses from ComponentsList are in there

    if (err) {
      // log and return if we encounter an error
      console.error("could not execute command: ", err);
      return;
    }
    // log the output received from the command
    console.log("Output: \n", output);
  });

  const rules: Rule[] = [];
  return rules;
}

export function getRecordAddresses(): string[] {
  const addresses: string[] = [];
  const worldAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const componentsRegistryAddr = getComponentRegistryAddress(worldAddress);

  return addresses;
}
