import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

export async function connectProvider(): Promise<ethers.providers.Web3Provider> {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []).then(async () => {
    console.log("Account:", await provider.getSigner().getAddress());
  });

  return provider;
}

export async function addChain(provider: Web3Provider, chainId: number, jsonRpcUrl: string) {
  const network = await provider.getNetwork();
  if (network.chainId !== chainId) {
    await provider.send("wallet_addEthereumChain", [
      {
        chainId: "0x" + chainId.toString(16),
        chainName: "Anvil",
        rpcUrls: [jsonRpcUrl],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
      },
    ]);
  }
}
