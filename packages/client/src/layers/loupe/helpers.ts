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
    console.log("rulesAddresses[i]: " + rulesAddresses[i]);
    const contractCode = await provider.json.getCode(rulesAddresses[i]);
    console.log(contractCode);
    // Loop through the contract code and see if the record address is in the code
    if (contractCode.includes(recordAddressWithout0x)) {
      recordReaders.push({
        id: recordId,
        address: rulesAddresses[i],
      });
    }
  }
  return recordReaders;
}
