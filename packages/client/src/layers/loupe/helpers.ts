import { Provider, RecordSpecificRule, RuleSpecificRecord } from "./types";
import { call } from "./utils";
import { hexZeroPad } from "ethers/lib/utils";
import { AbiCoder, keccak256, Result, hexlify, toUtf8Bytes } from "ethers/lib/utils";

export async function getWritersByRecord(
  recordAddress: string,
  rulesAddresses: string[],
  provider: Provider
): Promise<RecordSpecificRule[]> {
  const recordWriters: RecordSpecificRule[] = [];

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
      });
    }
  }
  return recordWriters;
}

export async function getReadersByRecord(
  recordAddress: string,
  rulesAddresses: string[],
  provider: Provider
): Promise<RecordSpecificRule[]> {
  const recordReaders: RecordSpecificRule[] = [];

  for (let i = 0; i < rulesAddresses.length; i++) {
    // Get the number of records that this rule reads
    const tempCounter = await call(provider, rulesAddresses[i], "0xb8b085f2"); // readCounter())
    const counter = parseInt(tempCounter);
    // Only continue if this system actually reads records
    if (counter > 0) {
      // console.log("counter: "+ counter + " for rule: " + rulesAddresses[i]);
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
      // For each ID find the address of the record that it corresponds to
      filteredComponentIds?.forEach(async (componentId) => {
        const tempReadComponentAddress = await call(provider, rulesAddresses[i], "0x26542450" + componentId); // readComponentIdToAddress(uint256)
        // Remove the first 26 chars of the result (the "0x000000000000000000000000")
        const readComponentAddress = "0x" + tempReadComponentAddress.slice(26);
        if (readComponentAddress === recordAddress) {
          recordReaders.push({
            id: componentId,
            address: readComponentAddress,
          });
        }
      });
    }
  }
  return recordReaders;
}

export async function getWrittenByRule(ruleAddress: string, provider: Provider): Promise<RuleSpecificRecord[]> {
  const recordsWrittenByRule: RecordSpecificRule[] = [];
  const abiCoder: AbiCoder = new AbiCoder();

  // Get the number of records that this rule writes
  const tempCounter = await call(provider, ruleAddress, "0xa68fd6ac"); // writeCounter())
  const counter = parseInt(tempCounter);
  // Only continue if this system actually writes records
  if (counter > 0) {
    // Get the ID of each record that this rule writes
    const encodedWriteComponentIds = await call(provider, ruleAddress, "0xde46abb1"); // getWriteComponentIds()
    console.log(encodedWriteComponentIds);
    const writeComponentIds: Result = abiCoder.decode(["string[]"], encodedWriteComponentIds)[0];
    console.log(writeComponentIds);

    // For each ID find the address of the record that it corresponds to
    writeComponentIds?.forEach(async (componentId) => {
      console.log("hello");
      console.log(componentId);
      const temp2 = abiCoder.encode(["string"], [componentId]);
      console.log(temp2);
      // trim first two chars of result (the "0x")
      const encodedComponentId = temp2.slice(2);
      console.log(encodedComponentId);
      const tempWriteComponentAddress = await call(provider, ruleAddress, "0xfd368973" + encodedComponentId); // writeComponentIdToAddress(string)
      console.log("HERE2: " + componentId);
      // Remove the first 26 chars of the result (the "0x000000000000000000000000")
      const writeComponentAddress = "0x" + tempWriteComponentAddress.slice(26);
      console.log("HERE3: " + writeComponentAddress);
      recordsWrittenByRule.push({
        id: componentId,
        address: writeComponentAddress,
      });
      console.log(recordsWrittenByRule);
    });
  }
  return recordsWrittenByRule;
}

export async function getReadByRule(ruleAddress: string, provider: Provider): Promise<RuleSpecificRecord[]> {
  const recordsReadByRule: RecordSpecificRule[] = [];

  // Get the number of records that this rule reads
  const tempCounter = await call(provider, ruleAddress, "0xb8b085f2"); // readCounter())
  const counter = parseInt(tempCounter);
  // Only continue if this system actually reads records
  if (counter > 0) {
    // Get the ID of each record that this rule reads
    const readComponentIds = await call(provider, ruleAddress, "0x0f287de2"); // getReadComponentIds()
    // Remove the first two chars of the result (the "0x")
    const readComponentIdsWithout0x = readComponentIds.slice(2);
    // Split the result into an array of 64-char strings
    const readComponentIdsArray = readComponentIdsWithout0x.match(/.{1,64}/g);
    // Find all items that have five 0s in a row in their string, and remove them
    const filteredComponentIds = readComponentIdsArray?.filter((item) => {
      return !item.match(/0{5}/);
    });
    // For each ID find the address of the record that it corresponds to
    filteredComponentIds?.forEach(async (componentId) => {
      const tempReadComponentAddress = await call(provider, ruleAddress, "0xa421782f" + componentId); // readComponentIdToAddress(string)
      // Remove the first 26 chars of the result (the "0x000000000000000000000000")
      const readComponentAddress = "0x" + tempReadComponentAddress.slice(26); // TODO: this may cause a bug, I don't know what the first 26 chars are
      recordsReadByRule.push({
        id: componentId,
        address: readComponentAddress,
      });
    });
  }

  return recordsReadByRule;
}
