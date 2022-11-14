import { MUDJsonRpcBatchProvider, MUDJsonRpcProvider } from "@latticexyz/network/dist/provider";
import { WebSocketProvider } from "@ethersproject/providers";

export type SignerEntity = {
  address: string;
  provider: {
    json: MUDJsonRpcBatchProvider | MUDJsonRpcProvider;
    ws: WebSocketProvider | undefined;
  };
};

export type MUDProvider = {
  json: MUDJsonRpcBatchProvider | MUDJsonRpcProvider;
  ws: WebSocketProvider | undefined;
};
