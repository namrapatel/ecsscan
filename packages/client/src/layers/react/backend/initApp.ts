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

  if (store.web3Provider) {
    provider = store.web3Provider;
    world = await buildWorld(mudWorld, provider);
    // store.setWorld(world);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    if (world.address) {
      console.log("here");
      const signerEntity: Persona = await registerSigner(
        provider,
        signerAddress,
        world.signerRegistryAddress,
        world.address
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
        const signerEntity: Persona = await registerSigner(
          provider,
          signerAddress,
          world.signerRegistryAddress,
          world.address
        );
      }
    });
  }

  // function that registers the signer if there isnt one, if there is, then does not register
  // function that builds a SignerEntity from the newly created signer and stores in the application store
}

export async function registerSigner(
  provider: Web3Provider,
  signerAddress: string,
  signerRegistryAddress: string,
  worldAddress: string
) {
  let signerEntity: Persona;

  // Check that the signer is not already registered in the Signer Registry
  const signerEntityId = ethers.utils.hexZeroPad(signerAddress, 32);

  // Check that the chain the provider is connected to is chainId 31337
  const network = await provider.getNetwork();
  if (network.chainId !== 31337) {
    console.log("Prompting chain change.");
    await addChain(provider, 31337, "https://localhost:8545/");
  }
  const existsEncoded = await call(provider, signerRegistryAddress, "0xcccf7a8e" + signerEntityId.slice(2));
  const exists = ethers.utils.defaultAbiCoder.decode(["bool"], existsEncoded)[0];
  // If the signer does not already exist, send TX to register the signer
  console.log(ethers.utils.hexlify(0));
  console.log(ethers.utils.hexlify(31337));
  console.log(await provider.getSigner().getAddress());
  if (exists == false) {
    const tx = await sendTx(provider, signerAddress, worldAddress, "0", "0x034a1009");
    await tx.wait();
    console.log(tx);
    // const params = [{
    //     from: signerAddress,
    //     to: worldAddress,
    //     value: "0x00",
    //     nonce: await provider.getTransactionCount(signerAddress, "latest"),
    //     gas: ethers.utils.hexlify(100000),
    //     gasLimit: ethers.utils.hexlify(1000000000), // 100000
    //     gasPrice: ethers.utils.hexlify(0),
    //     data: "0x034a1009", // registerSigner()
    //     chainId: ethers.utils.hexlify(31337)
    //   }];
    // const txHash = await provider.send("eth_sendTransaction", params).then((txHash) => {
    //     console.log(txHash);
    // });
  }

  return signerEntity;
}
