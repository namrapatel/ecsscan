import { call, createEntityIndex, getAddressCall } from "./helpers";
import { World as mudWorld, Component, getEntityComponents, getComponentEntities } from "@latticexyz/recs";
import { Entity, Rule, Record, World, Provider } from "./types";
import { createProvider, ProviderConfig } from "@latticexyz/network";
import { BigNumber } from "ethers";
import { AbiCoder, keccak256, Result, hexlify, toUtf8Bytes } from "ethers/lib/utils";

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
  console.log("Logging world:");
  console.log(world);

  // Records
  world.records = await getAllRecords(mudWorld, worldAddress, provider, componentRegistryAddress);
  console.log("Logging world:");
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
      const record: Record = {
        id: entities[i].mudComponents[j].id,
        address: "",
        values: entities[i].mudComponents[j].values,
        readers: [],
        writers: [],
        creator: "",
        mudComponent: entities[i].mudComponents[j],
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
  componentRegistryAddress: string
): Promise<Record[]> {
  const mudComponents: Component[] = world.components;
  const records: Record[] = [];
  const abiCoder = new AbiCoder();

  const rawComponentsFromChain = await call(provider, componentRegistryAddress, "0x31b933b9"); // ComponentsRegistry.getEntities();
  const componentsFromChain: Result = abiCoder.decode(["uint256[]"], rawComponentsFromChain);

  // Loop through componentsFromChain
  componentsFromChain[0].forEach(async (component: any) => {
    console.log(component._hex);
    // Get contractId for each component from chain
    const rawContractId = await call(provider, component._hex, "0xaf640d0f"); // id()
    const contractId = abiCoder.decode(["uint256"], rawContractId);
    console.log(contractId);
    // Get metadata for each component in mudComponents
    for (let i = 0; i < mudComponents.length; i++) {
      console.log("Entering check loop:");
      const mudComponentContractId = mudComponents[i].metadata;
      if (mudComponentContractId !== undefined && typeof mudComponentContractId.contractId === "string") {
        const mudContractIdString: string = mudComponentContractId.contractId;
        const hashedMetadata = BigNumber.from(keccak256(hexlify(toUtf8Bytes(mudContractIdString))));
        console.log("hashedMetadata: " + hashedMetadata);
        if (hashedMetadata === contractId[0]) {
          console.log("found match");
          console.log(mudContractIdString);
          console.log(contractId[0]);
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

export function getRecordReaders(address: string): Rule[] {
  const rules: Rule[] = [];
  return rules;
}

export function getRecordWriters(address: string): Rule[] {
  const rules: Rule[] = [];
  return rules;
}

export function getRecordsByEntity(entity: Entity): Record[] {
  return entity.records;
}

// TODO
export function getRulesByRecord(record: Component): Rule[] {
  const rules: Rule[] = [];

  return rules;
}

// TODO
export function getRecordsByRule(): Component[] {
  const records: Component[] = [];

  return records;
}

// TODO: Return the real Entity type
export function getEntitiesByRecord(record: Component) {
  return getComponentEntities(record);
}
