import { Provider, RecordSpecificRule, Rule, Record } from "./types";
import { call } from "./utils";
import { hexZeroPad } from "ethers/lib/utils";
import { AbiCoder, keccak256, Result, hexlify, toUtf8Bytes } from "ethers/lib/utils";

export async function getWritersByRecord(
  recordAddress: string,
  rulesAddresses: string[],
  provider: Provider
): Promise<Rule[]> {
  const recordWriters: Rule[] = [];

  for (let i = 0; i < rulesAddresses.length; i++) {
    const functionSignature = "0x861eb905"; // writeAccess(address)

    // Remove first two chars of address (the "0x")
    const recordAddressWithout0x = hexZeroPad(rulesAddresses[i], 32).slice(2);

    const result = await call(provider, recordAddress, functionSignature + recordAddressWithout0x); // writeAccess(address) + recordAddress
    // Get the last char of result, which is the boolean value
    const temp = result.slice(-1);
    // If the last char is 1, then this rule has write access to the record, so add it to the list
    if (temp === "1") {
      recordWriters.push({
        id: "",
        address: rulesAddresses[i],
        readsRecords: [],
        writesRecords: [],
        creator: "",
        abi: JSON,
      });
    }
  }
  return recordWriters;
}

export async function getReadersByRecord(
  recordId: string,
  recordAddress: string,
  rulesAddresses: string[],
  provider: Provider
): Promise<RecordSpecificRule[]> {
  const recordReaders: RecordSpecificRule[] = [];
  // Strip the first two chars of the record address (the "0x")
  const recordAddressWithout0x = hexZeroPad(recordAddress, 32).slice(2);

  for (let i = 0; i < rulesAddresses.length; i++) {
    if (rulesAddresses[i] === "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6") {
      console.log("Entered helper");
      console.log("Checking: ");
      console.log(rulesAddresses[i]);
      // Get the number of records that this rule reads
      const tempCounter = await call(provider, rulesAddresses[i], "0x61bc221a"); // counter()
      console.log("tempCounter: " + tempCounter);
      const counter = parseInt(tempCounter);
      console.log("counter: " + counter);
      // Get the ID of each record that this rule reads
      const readComponentIds = await call(provider, rulesAddresses[i], "0x0f287de2"); // getReadComponentIds()
      // Remove the first two chars of the result (the "0x")
      const readComponentIdsWithout0x = readComponentIds.slice(2);
      // Split the result into an array of 64-char strings
      const readComponentIdsArray = readComponentIdsWithout0x.match(/.{1,64}/g);
      // Find all items that have five 0s in a row in their string, and remove them
      const filteredComponentIds = readComponentIdsArray?.filter((item) => {
        return !item.match(/0{5}/);
      });
      console.log("readComponentIdsArray: ");
      console.log(filteredComponentIds);
      // For each ID find the address of the record that it corresponds to
      filteredComponentIds?.forEach(async (componentId) => {
        const componentAddress = await call(provider, rulesAddresses[i], "0xa421782f" + componentId); // readComponentIdToAddress(uint256)
        recordReaders.push({
          id: componentId,
          address: componentAddress,
        });
      });
    }
  }
  return recordReaders;
}
