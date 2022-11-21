import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { ApplicationStore } from "../stores/ApplicationStore";
import { World as mudWorld } from "@latticexyz/recs";
import { buildWorld } from "../../loupe/loupe";
import { World } from "../../loupe/types";
import { sendTx, call } from "../../loupe/utils";
import { Persona } from "../types";
import { addChain } from "./utils";
import { getAddress, isAddress } from "ethers/lib/utils";

export async function initApp(store: ApplicationStore, mudWorld: mudWorld) {
  let world: World;
  let provider: Web3Provider;

  if (store.web3Provider) {
    provider = store.web3Provider;
    world = await buildWorld(mudWorld, provider);
    // store.setWorld(world);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    if (world.address) {
      const signerEntity = await registerSigner(
        provider,
        signerAddress,
        world.signerRegistryAddress,
        world.address,
        world,
        mudWorld
      );
      if (signerEntity) {
        store.setSignerEntity(signerEntity);
      }
    }
  } else {
    // Prompts metamask
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []).then(async () => {
      store.setWeb3Provider(provider);
      world = await buildWorld(mudWorld, provider); // If there is a successful connection, call buildWorld using that provider
      //   store.setWorld(world);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      if (world.address) {
        const signerEntity = await registerSigner(
          provider,
          signerAddress,
          world.signerRegistryAddress,
          world.address,
          world,
          mudWorld
        );
        if (signerEntity) {
          store.setSignerEntity(signerEntity);
        }
      }
    });
  }
  // function that builds a SignerEntity from the newly created signer and stores in the application store
}

export async function registerSigner(
  provider: Web3Provider,
  signerAddress: string,
  signerRegistryAddress: string,
  worldAddress: string,
  world: World,
  mudWorld: mudWorld
): Promise<Persona | null> {
  let signerEntity: Persona | null = null;

  // Check that the chain the provider is connected to is chainId 888
  const network = await provider.getNetwork();
  if (network.chainId !== 888) {
    console.log("Prompting chain change.");
    await addChain(provider, 888, "https://rpc-back-black-caterpillar-l1ym8rlocb.t.exfac.xyz");
  }

  // Check that the signer is not already registered in the Signer Registry
  const encodedSignerAddress = ethers.utils.defaultAbiCoder.encode(["uint256"], [signerAddress]).slice(2); // Encode the signer address as a uint256
  const existsEncoded = await call(provider, signerRegistryAddress, "0xcccf7a8e" + encodedSignerAddress); // has(uint256)
  const exists = ethers.utils.defaultAbiCoder.decode(["bool"], existsEncoded)[0];

  // If the signer does not already exist, send TX to register the signer
  if (exists === false) {
    // registerSigner()
    console.log("Registering signer.");
    await sendTx(provider, signerAddress, worldAddress, "0x00", "0x034a1009").then(async () => {
      console.log("Signer is now registered.");
      const world: World = await buildWorld(mudWorld, provider);
      world.entities.forEach((entity) => {
        if (isAddress(entity.id)) {
          if (getAddress(entity.id) === signerAddress) {
            signerEntity = {
              signer: entity,
              entityPerspective: entity,
            };
          }
        }
      });
    });
  } else {
    console.log("Signer already registered, creating Persona.");
    world.entities.forEach((entity) => {
      if (isAddress(entity.id)) {
        if (getAddress(entity.id) === signerAddress) {
          signerEntity = {
            signer: entity,
            entityPerspective: entity,
          };
        }
      }
    });
    if (!signerEntity) {
      console.error("Signer not found in world.");
    }
  }

  return signerEntity;
}
