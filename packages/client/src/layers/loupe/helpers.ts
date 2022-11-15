import { EntityToValueMap, RecordSpecificRule, RuleSpecificRecord, SignerEntity } from "./types";
import { call, getAddressCall } from "./utils";
import { AbiCoder, Result, hexZeroPad } from "ethers/lib/utils";
import { Web3Provider } from "@ethersproject/providers";
import { World, Entity } from "./types";
import { EntityID } from "@latticexyz/recs";

export async function getWritersByRecord(
  recordAddress: string,
  rulesAddresses: string[],
  provider: Web3Provider
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
  provider: Web3Provider
): Promise<RecordSpecificRule[]> {
  const recordReaders: RecordSpecificRule[] = [];
  const abiCoder: AbiCoder = new AbiCoder();

  for (let i = 0; i < rulesAddresses.length; i++) {
    // Get the number of records that this rule reads
    const tempCounter = await call(provider, rulesAddresses[i], "0xb8b085f2"); // readCounter())
    const counter = parseInt(tempCounter);
    // Only continue if this system actually reads records
    if (counter > 0) {
      // console.log("counter: "+ counter + " for rule: " + rulesAddresses[i]);
      // Get the ID of each record that this rule reads
      const encodedReadComponentIds = await call(provider, rulesAddresses[i], "0x0f287de2"); // getReadComponentIds()
      const readComponentIds: Result = abiCoder.decode(["string[]"], encodedReadComponentIds)[0]; // decode call result

      // For each ID find the address of the record that it corresponds to
      readComponentIds?.forEach(async (componentId) => {
        // Encode the id string so that it can be used in the call to get address
        const encodedComponentId = abiCoder.encode(["string"], [componentId]).slice(2);
        // Get address from readComponentIdToAddress(string) mapping
        const tempReadComponentAddress = await call(provider, rulesAddresses[i], "0x26542450" + encodedComponentId); // readComponentIdToAddress(uint256)
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

export async function getWrittenByRule(ruleAddress: string, provider: Web3Provider): Promise<RuleSpecificRecord[]> {
  const recordsWrittenByRule: RecordSpecificRule[] = [];
  const abiCoder: AbiCoder = new AbiCoder();

  // Get the number of records that this rule writes
  const tempCounter = await call(provider, ruleAddress, "0xa68fd6ac"); // writeCounter())
  const counter = parseInt(tempCounter);
  // Only continue if this system actually writes records
  if (counter > 0) {
    // Get the ID of each record that this rule writes
    const encodedWriteComponentIds = await call(provider, ruleAddress, "0xde46abb1"); // getWriteComponentIds()
    const writeComponentIds: Result = abiCoder.decode(["string[]"], encodedWriteComponentIds)[0]; // decode call result

    // For each ID find the address of the record that it corresponds to
    writeComponentIds?.forEach(async (componentId) => {
      const encodedComponentId = abiCoder.encode(["string"], [componentId]).slice(2);

      const tempWriteComponentAddress = await call(provider, ruleAddress, "0xfd368973" + encodedComponentId); // writeComponentIdToAddress(string)
      // Remove the first 26 chars of the result (the "0x000000000000000000000000")
      const writeComponentAddress = "0x" + tempWriteComponentAddress.slice(26);
      recordsWrittenByRule.push({
        id: componentId,
        address: writeComponentAddress,
      });
    });
  }
  return recordsWrittenByRule;
}

export async function getReadByRule(ruleAddress: string, provider: Web3Provider): Promise<RuleSpecificRecord[]> {
  const recordsReadByRule: RecordSpecificRule[] = [];
  const abiCoder: AbiCoder = new AbiCoder();

  // Get the number of records that this rule reads
  const tempCounter = await call(provider, ruleAddress, "0xb8b085f2"); // readCounter())
  const counter = parseInt(tempCounter);
  // Only continue if this system actually reads records
  if (counter > 0) {
    const encodedReadComponentIds = await call(provider, ruleAddress, "0x0f287de2"); // getReadComponentIds()
    const readComponentIds: Result = abiCoder.decode(["string[]"], encodedReadComponentIds)[0]; // decode call result

    // For each ID find the address of the record that it corresponds to
    readComponentIds?.forEach(async (componentId) => {
      // Encode the id string so that it can be used in the call to get address
      const encodedComponentId = abiCoder.encode(["string"], [componentId]).slice(2);
      // Get address from readComponentIdToAddress(string) mapping
      const tempReadComponentAddress = await call(provider, ruleAddress, "0x26542450" + encodedComponentId); // readComponentIdToAddress(string)
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

export async function getEntitiesAndValuesForRecord(recordAddress: string, provider: Web3Provider) {
  const entitiesAndValues: EntityToValueMap[] = [];
  const abiCoder: AbiCoder = new AbiCoder();

  const encodedEntities = await call(provider, recordAddress, "0x31b933b9"); // getEntities()
  // Decode encodedEntities as uint256[]
  const entities: Result = abiCoder.decode(["uint256[]"], encodedEntities)[0];
  // For each entity get the value that it has for this record
  entities?.forEach(async (entity) => {
    const encodedEntity = abiCoder.encode(["uint256"], [entity._hex]).slice(2);
    const encodedValue = await call(provider, recordAddress, "0x0ff4c916" + encodedEntity); // getValue(uint256)
    const value: Result = abiCoder.decode(["uint256"], encodedValue)[0];

    entitiesAndValues.push({
      entityId: entity._hex,
      value: value._hex,
    });
  });

  return entitiesAndValues;
}

export async function registerSigner(
  provider: Web3Provider,
  signerAddress: string,
  worldAddress: string
): Promise<SignerEntity> {
  // Check if Entity is in World
  // const entity: Entity = () => {
  //   world.entities.forEach((entity) => {
  //     if (entity.id === signerAddress) {
  //       return entity;
  //     }
  //   })
  //   // Return an empty entity
  //   return {
  //     id: signerAddress,
  //     isSigner: true,
  //     mudComponents: [],
  //     mudEntityIndex: 0,
  //     records: [],
  //   } as Entity;
  // }

  const signerEntity: SignerEntity = {
    address: signerAddress,
    actingAs: null,
  };

  // Check that the signer is not already registered in the Signer Registry
  console.log("here");
  const result = await call(provider, worldAddress, "0x034a1009"); // registerSigner()
  if (result !== "0x") {
    console.log("Signer is already registered");
  }
  console.log(result);
  return signerEntity;
}

// export async function getComponentId(provider: Web3Provider, componentAddress: string): Promise<string> {
//   const encodedComponentId = await call(provider, componentAddress, "0x8a1f3e3c"); // getId()
//   const abiCoder: AbiCoder = new AbiCoder();
//   const componentId: Result = abiCoder.decode(["string"], encodedComponentId)[0];
//   return componentId;
// }

// export async function getEntityValue(entityId: string, recordAddress: string, provider: Web3Provider) {
//   const abiCoder: AbiCoder = new AbiCoder();
//   const encodedEntity = abiCoder.encode(["string"], [entityId]).slice(2);
//   console.log(encodedEntity);
//   const encodedValue = await call(provider, recordAddress, "0x0ff4c916" + encodedEntity); // getValue(uint256)
//   console.log(encodedValue)
//   const value: Result = abiCoder.decode(["uint256"], encodedValue)[0];
//   console.log(value)
//   return value._hex;
// }
