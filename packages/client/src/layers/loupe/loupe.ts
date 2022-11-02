import { call, createEntityIndex, getAddressCall } from "./utils";
import { World as mudWorld, Component, getEntityComponents } from "@latticexyz/recs";
import {
  Entity,
  Rule,
  Record,
  World,
  Provider,
  EntitySpecificRecord,
  RecordSpecificRule,
  RuleSpecificRecord,
} from "./types";
import { createProvider, ProviderConfig } from "@latticexyz/network";
import { AbiCoder, keccak256, Result, hexlify, toUtf8Bytes } from "ethers/lib/utils";
import { getWritersByRecord, getReadersByRecord } from "./helpers";

export async function buildWorld(mudWorld: mudWorld): Promise<World> {
  console.log("Building World");
  const params = new URLSearchParams(window.location.search);
  const worldAddress = params.get("worldAddress") || "";

  if (worldAddress === "") {
    console.error("worldAddress is empty");
  }

  const providerConfig: ProviderConfig = {
    chainId: 31337,
    jsonRpcUrl: "http://localhost:8545",
  };
  const provider = createProvider(providerConfig);

  const componentRegistryAddress = await getAddressCall(provider, worldAddress, "0xba62fbe4"); // systems()
  const systemsRegistryAddress = await getAddressCall(provider, worldAddress, "0x0d59332e"); // systems()

  const world: World = {
    address: worldAddress,
    entities: [],
    records: [],
    rules: [],
    componentRegistryAddress: componentRegistryAddress,
    systemsRegistryAddress: systemsRegistryAddress,
    mudWorld: mudWorld,
  };

  // Entities
  world.entities = getAllEntities(mudWorld);
  console.log("Logging world post-entities:");
  console.log(world);

  // Records
  world.records = await getAllRecords(
    mudWorld,
    worldAddress,
    provider,
    componentRegistryAddress,
    systemsRegistryAddress
  );
  console.log("Logging world post-records:");
  console.log(world);

  // Rules
  world.rules = getAllRules(mudWorld);

  return world;
}

// WIP
export function getAllEntities(world: mudWorld): Entity[] {
  const entities: Entity[] = [];

  for (let i = 0; i < world.entities.length; i++) {
    entities[i].id = world.entities[i];

    const index = world.entityToIndex.get(world.entities[i]);
    const indexNumber = index?.valueOf() as number;
    entities[i].mudEntityIndex = createEntityIndex(indexNumber);

    entities[i].mudComponents = getEntityComponents(world, entities[i].mudEntityIndex);

    // TODO: Incomplete, add readers, writers, and creators when they are implemented
    for (let j = 0; j < entities[i].mudComponents.length; j++) {
      const record: EntitySpecificRecord = {
        id: entities[i].mudComponents[j].id,
        address: "",
        value: entities[i].mudComponents[j].values,
      };
      entities[i].records.push(record);
    }
  }

  return entities;
}

// WIP
export async function getAllRecords(
  world: mudWorld,
  worldAddress: string,
  provider: Provider,
  componentRegistryAddress: string,
  systemsRegistryAddress: string
): Promise<Record[]> {
  const mudComponents: Component[] = world.components;
  const records: Record[] = [];
  const abiCoder = new AbiCoder();

  // Get a list of all Component Addresses from the Component Registry on-chain
  const encodedComponentAddressesFromChain = await call(provider, componentRegistryAddress, "0x31b933b9"); // componentsRegistry.getEntities();
  // Deocde the encoded list of Component Addresses
  const componentsAddressesFromChain: Result = abiCoder.decode(["uint256[]"], encodedComponentAddressesFromChain)[0];

  // Get a list of all System Addresses from the System Registry on-chain
  const encodedSystemAddressesFromChain = await call(provider, systemsRegistryAddress, "0x31b933b9"); // systemsRegistry.getEntities();
  // Deocde the encoded list of System Addresses
  const tempSystemsAddressesFromChain: Result = abiCoder.decode(["uint256[]"], encodedSystemAddressesFromChain)[0];

  // Turn systemsAddressesFromChain into a string array
  const systemsAddressesFromChain: string[] = [];
  tempSystemsAddressesFromChain.forEach((systemAddress) => {
    systemsAddressesFromChain.push(systemAddress._hex);
  });

  // Loop through the list of component addresses
  componentsAddressesFromChain.forEach(async (component: { _hex: string; _isBigNumber: boolean }) => {
    const componentAddress = component._hex;
    // Get the ID for the given component from on-chain (e.g. "component.Example")
    const componentIdFromChain = await call(provider, componentAddress, "0xaf640d0f"); // id()
    // Loop through all the mudComponents from mudWorld, find a match between the on-chain component ID and the mudComponent ID
    for (let i = 0; i < mudComponents.length; i++) {
      const componentIdFromMUD = mudComponents[i].metadata;
      if (componentIdFromMUD !== undefined && typeof componentIdFromMUD.contractId === "string") {
        // Typescript BS to get the string out of the "Metadata" object
        const componentIdStringFromMUD: string = componentIdFromMUD.contractId;
        // Convert mud component ID to keccak256(componentId) to match the on-chain component ID
        const hashedComponentIdFromMUD = keccak256(hexlify(toUtf8Bytes(componentIdStringFromMUD)));
        // Check for equivalence between client and on-chain component IDs
        if (hashedComponentIdFromMUD === componentIdFromChain) {
          // Create new record and push to records array
          const record: Record = {
            id: mudComponents[i].id, // Component ID in English
            address: componentAddress,
            values: mudComponents[i].values,
            readers: await getReadersByRecord(componentAddress, systemsAddressesFromChain, provider),
            writers: await getWritersByRecord(componentAddress, systemsAddressesFromChain, provider),
            creator: await getAddressCall(provider, componentAddress, "0x8da5cb5b"), // owner()
            mudComponent: mudComponents[i],
          };
          records.push(record);
        }
      }
    }
  });
  return records;
}

// TODO
export function getAllRules(world: mudWorld): Rule[] {
  const rules: Rule[] = [];
  return rules;
}

export function getRecordReaders(address: string): RecordSpecificRule[] {
  const rules: RecordSpecificRule[] = [];
  return rules;
}

export function getRecordWriters(address: string): RecordSpecificRule[] {
  const rules: RecordSpecificRule[] = [];
  return rules;
}

export function getRecordsByEntity(entity: Entity): EntitySpecificRecord[] {
  return entity.records;
}

// TODO
export function getRulesByRecord(record: Component): RecordSpecificRule[] {
  const rules: RecordSpecificRule[] = [];

  return rules;
}

// TODO
export function getRecordsByRule(): RuleSpecificRecord[] {
  const records: RuleSpecificRecord[] = [];

  return records;
}

// TODO: Return the real Entity type
export function getEntitiesByRecord(record: Record) {
  return Object.keys(record.values);
}
