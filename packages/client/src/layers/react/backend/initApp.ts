import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { ApplicationStore } from "../stores/ApplicationStore";
import { World as mudWorld } from "@latticexyz/recs";
import { buildWorld } from "../../loupe/loupe";
import { World } from "../../loupe/types";
import { sendTx } from "../../loupe/utils";
import { Persona } from "../types";
import { call } from "../../loupe/utils";

export async function initApp(store: ApplicationStore, mudWorld: mudWorld) {
  let world: World;
  let provider: Web3Provider;

  if (store.web3Provider) {
    provider = store.web3Provider;
    world = await buildWorld(mudWorld, provider);
    store.setWorld(world);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    if (world.address) {
      console.log("here");
      const signerEntity: Persona = await registerSigner(provider, signerAddress, world.address);
    }
  } else {
    // Prompts metamask
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []).then(async () => {
      console.log("here2");
      store.setWeb3Provider(provider);
      world = await buildWorld(mudWorld, provider); // If there is a successful connection, call buildWorld using that provider
      store.setWorld(world);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      if (world.address) {
        console.log("here");
        const signerEntity: Persona = await registerSigner(provider, signerAddress, world.address);
      }
    });
  }

  // function that registers the signer if there isnt one, if there is, then does not register
  // function that builds a SignerEntity from the newly created signer and stores in the application store
}

export async function registerSigner(provider: Web3Provider, signerAddress: string, worldAddress: string) {
  let signerEntity: Persona;

  // Check that the signer is not already registered in the Signer Registry
  const signerEntityId = ethers.utils.hexZeroPad(signerAddress, 32);
  console.log("signerEntityId: " + signerEntityId);
  const existsEncoded = await call(provider, worldAddress, "0xcccf7a8e");
  console.log(existsEncoded);
  const exists = ethers.utils.defaultAbiCoder.decode(["bool"], existsEncoded);
  console.log(exists);

  // if (worldAddress !== null && worldAddress !== undefined && worldAddress !== "") {
  //   const result = await sendTx(
  //     provider,
  //     await provider.getSigner().getAddress(),
  //     worldAddress,
  //     "0",
  //     "0x034a1009" // registerSigner()
  //   );
  //   console.log(result);
  // }

  return signerEntity;
}
