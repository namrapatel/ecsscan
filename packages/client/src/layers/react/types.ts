import { MUDJsonRpcBatchProvider, MUDJsonRpcProvider } from "@latticexyz/network/dist/provider";
import { WebSocketProvider } from "@ethersproject/providers";

export type MUDProvider = {
  json: MUDJsonRpcBatchProvider | MUDJsonRpcProvider;
  ws: WebSocketProvider | undefined;
};
