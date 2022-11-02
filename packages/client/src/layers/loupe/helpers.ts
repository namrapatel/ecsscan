import { Provider, RecordSpecificRule, Rule, Record } from "./types";
import { call } from "./utils";
import { hexZeroPad } from "ethers/lib/utils";

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
    if (rulesAddresses[i] === "0x10c6e9530f1c1af873a391030a1d9e8ed0630d26") {
      console.log("Entered helper");
      console.log("Checking: ");
      console.log(rulesAddresses[i]);
      const tempCounter = await call(provider, rulesAddresses[i], "0x61bc221a"); // counter()
      console.log("tempCounter: " + tempCounter);
      const counter = parseInt(tempCounter);
      console.log("counter: " + counter);
      const readComponentIds = await call(provider, rulesAddresses[i], "0x8b0b7f8b"); // readComponentIds()
      console.log("readComponentIds: " + readComponentIds);
      const functionSignature = "0xa421782f"; // readComponentIdToAddress(uint256)
    }
  }
  return recordReaders;
}
