/* eslint-disable @typescript-eslint/no-explicit-any */
import { getComponentValue, removeComponent, setComponent } from "@latticexyz/recs";
import React from "react";
import ReactDOM from "react-dom/client";
import { Time } from "./utils/time";
import { createNetworkLayer as createNetworkLayerImport } from "./layers/network";
import { Layers } from "./types";
import { Engine as EngineImport } from "./layers/react/engine/Engine";
import { Wallet } from "ethers";
import { buildWorld } from "./layers/loupe/loupe";
import { connectProvider } from "./layers/react/backend/utils";

// Assign variables that can be overridden by HMR
let createNetworkLayer = createNetworkLayerImport;
let Engine = EngineImport;

/**
 * This function is called once when the game boots up.
 * It creates all the layers and their hierarchy.
 * Add new layers here.
 */
export async function bootGame() {
  const layers: Partial<Layers> = {};
  let initialBoot = true;

  async function rebootGame(): Promise<Layers> {
    // Remove react when starting to reboot layers, reboot react once layers are rebooted
    mountReact.current(false);

    const params = new URLSearchParams(window.location.search);
    const worldAddress = params.get("worldAddress");
    let privateKey = params.get("burnerWalletPrivateKey");  
    const chainIdString = params.get("chainId");
    const jsonRpc = params.get("rpc") || undefined;
    const wsRpc = params.get("wsRpc") || undefined; // || (jsonRpc && jsonRpc.replace("http", "ws"));
    const checkpointUrl = params.get("checkpoint") || undefined;
    const devMode = params.get("dev") === "true";
    const initialBlockNumberString = params.get("initialBlockNumber");
    const initialBlockNumber = initialBlockNumberString ? parseInt(initialBlockNumberString) : 0;

    if (!privateKey) {
      privateKey = localStorage.getItem("burnerWallet") || Wallet.createRandom().privateKey;
      localStorage.setItem("burnerWallet", privateKey);
    }

    let networkLayerConfig;
    if (worldAddress && privateKey && chainIdString && jsonRpc) {
      networkLayerConfig = {
        worldAddress,
        privateKey,
        chainId: parseInt(chainIdString),
        jsonRpc,
        wsRpc,
        checkpointUrl,
        devMode,
        initialBlockNumber,
      };
    }

    if (!networkLayerConfig) throw new Error("Invalid config");

    if (!layers.network) layers.network = await createNetworkLayer(networkLayerConfig);

    // Start syncing once all systems have booted
    if (initialBoot) {
      initialBoot = false;
      layers.network.startSync();
    }

    // Reboot react if layers have changed
    mountReact.current(true);

    return layers as Layers;
  }

  function dispose(layer: keyof Layers) {
    layers[layer]?.world.dispose();
    layers[layer] = undefined;
  }

  await rebootGame();

  const ecs = {
    setComponent,
    removeComponent,
    getComponentValue,
  };

  (window as any).layers = layers;
  (window as any).ecs = ecs;
  (window as any).time = Time.time;

  let reloadingNetwork = false;

  if (import.meta.hot) {
    import.meta.hot.accept("./layers/network/index.ts", async (module) => {
      if (reloadingNetwork) return;
      reloadingNetwork = true;
      createNetworkLayer = module.createNetworkLayer;
      dispose("network");
      await rebootGame();
      console.log("HMR Network");
      layers.network?.startSync();
      reloadingNetwork = false;
    });
  }
  
  if (layers.network) {
    // Create a temporary provider to build world while other things happen
    const temporaryProvider = await connectProvider();
    buildWorld(layers.network.world, await temporaryProvider);
  }

  return { layers, ecs };
}

const mountReact: { current: (mount: boolean) => void } = { current: () => void 0 };
const setLayers: { current: (layers: Layers) => void } = { current: () => void 0 };

function bootReact() {
  const rootElement = document.getElementById("react-root");
  if (!rootElement) return console.warn("React root not found");

  const root = ReactDOM.createRoot(rootElement);

  function renderEngine() {
    root.render(<Engine setLayers={setLayers} mountReact={mountReact} />);
  }

  renderEngine();  

  if (import.meta.hot) {
    // HMR React engine
    import.meta.hot.accept("./layers/Renderer/React/engine/Engine.tsx", async (module) => {
      Engine = module.Engine;
      renderEngine();
    });
  }
}

export async function boot() {
  bootReact();
  const game = await bootGame();
  setLayers.current(game.layers as Layers);
}
