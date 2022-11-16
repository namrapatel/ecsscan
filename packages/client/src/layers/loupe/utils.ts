import { EntityIndex } from "@latticexyz/recs";
import type { Opaque } from "type-fest";
import { Web3Provider, TransactionResponse } from "@ethersproject/providers";
import { BytesLike, ethers } from "ethers";

// Helper function that creates an EntityIndex from a number as required by @latticexyz/recs
export function createEntityIndex(index: number): EntityIndex {
  return index as Opaque<number, "EntityIndex">;
}

export async function call(provider: Web3Provider, contractAddress: string, calldata: string): Promise<string> {
  const result = await provider.call({
    to: contractAddress,
    data: calldata,
  });

  return result;
}

export async function getAddressCall(
  provider: Web3Provider,
  contractAddress: string,
  functionSignature: string
): Promise<string> {
  let result = await provider.call({
    to: contractAddress,
    data: functionSignature,
  });

  // Get last 40 chars of result, which is the address of the registry
  const temp = result.slice(-40);
  result = "0x" + temp;

  return result;
}

export function sendTx(
  provider: Web3Provider,
  fromAddr: string,
  toAddr: string,
  value: string,
  data?: BytesLike
): Promise<TransactionResponse> {
  return provider.getSigner().sendTransaction({
    from: fromAddr,
    to: toAddr,
    value: ethers.utils.parseEther(value),
    nonce: provider.getTransactionCount(fromAddr, "latest"),
    gasLimit: ethers.utils.hexlify(1000000), // 100000
    gasPrice: 0,
    data: data,
  });
}
