import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { ApplicationStore } from "../stores/ApplicationStore";
import { World as mudWorld } from "@latticexyz/recs";
import { buildWorld } from "../../loupe/loupe";
import { World } from "../../loupe/types";
import { sendTx, call } from "../../loupe/utils";
import { Persona } from "../types";
import { addChain } from "./utils";

export async function initApp(store: ApplicationStore, mudWorld: mudWorld) {
  let world: World;
  let provider: Web3Provider;
  console.log("initApp");
  console.log(store);

  if (store.web3Provider) {
    provider = store.web3Provider;
    console.log("store provider:");
    console.log(store.web3Provider);
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
    }
  } else {
    // Prompts metamask
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []).then(async () => {
      console.log("here2");
      store.setWeb3Provider(provider);
      world = await buildWorld(mudWorld, provider); // If there is a successful connection, call buildWorld using that provider
      //   store.setWorld(world);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      if (world.address) {
        console.log("here");
        const signerEntity = await registerSigner(
          provider,
          signerAddress,
          world.signerRegistryAddress,
          world.address,
          world,
          mudWorld
        );
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
) {
  let signerEntity: Persona | null;

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
  if (exists == false) {
    await sendTx(provider, signerAddress, worldAddress, "0x00", "0x034a1009").then(async () => {
      // registerSigner()
      console.log("Signer registered.");
      const world: World = await buildWorld(mudWorld, provider);
      const foundEntity = world.entities.find((entity) => entity.id === signerAddress);
      if (foundEntity) {
        console.log("Found an entity");
        signerEntity = {
          signer: foundEntity,
          entityPerspective: foundEntity,
        };
      } else {
        console.error("Signer not found in world.");
      }
    });
    // const params = [{
    //     from: signerAddress,
    //     to: worldAddress,
    //     value: "0x00",
    //     nonce: await (await provider.getTransactionCount(signerAddress, "latest")).toString(),
    //     gasLimit: ethers.utils.hexlify(1000000000), // 100000
    //     gasPrice: ethers.utils.hexlify(0),
    //     data: "0x034a1009", // registerSigner()
    //     chainId: ethers.utils.hexlify(888)
    //   }];
    //   console.log(params)
    // const txHash = await provider.send("eth_sendTransaction", params).then((txHash) => {
    //     console.log(txHash);
    // });
  } else {
    console.log("Signer already registered.");
    console.log(world.entities);
    const foundEntity = world.entities.forEach((entity) => {
      console.log(1);
      console.log(entity.id);
      console.log(signerAddress);
      if (entity.id === signerAddress) {
        signerEntity = {
          signer: entity,
          entityPerspective: entity,
        };
      } else {
        console.error("Signer not found in world.");
      }
    });
    return foundEntity;
  }

  return signerEntity;
}
