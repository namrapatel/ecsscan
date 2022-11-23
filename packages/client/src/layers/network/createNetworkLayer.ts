import { createWorld, defineComponent, Type, EntityID } from "@latticexyz/recs";
import { setupDevSystems } from "./setup";
import { createActionSystem, setupMUDNetwork } from "@latticexyz/std-client";
import { defineLoadingStateComponent } from "./components";
import { SystemTypes } from "contracts/types/SystemTypes";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";
import { GameConfig, getNetworkConfig } from "./config";
import { buildWorld } from "../loupe/loupe";

/**
 * The Network layer is the lowest layer in the client architecture.
 * Its purpose is to synchronize the client components with the contract components.
 */
export async function createNetworkLayer(config: GameConfig) {
  console.log("Network config", config);

  // --- WORLD ----------------------------------------------------------------------
  const world = createWorld();

  // --- COMPONENTS -----------------------------------------------------------------
  const components = {
    LoadingState: defineLoadingStateComponent(world),
    SignersRegistry: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "SignersRegistry",
        metadata: {
          contractId: "world.component.signers",
        },
      }
    ),
    RedTrophyComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "RedTrophyComponent",
        metadata: {
          contractId: "component.RedTrophy",
        },
      }
    ),
    BlueTrophyComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "BlueTrophyComponent",
        metadata: {
          contractId: "component.BlueTrophy",
        },
      }
    ),
    SlyComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "SlyComponent",
        metadata: {
          contractId: "component.Sly",
        },
      }
    ),
    WowComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "WowComponent",
        metadata: {
          contractId: "component.Wow",
        },
      }
    ),
    HasDiamondComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "HasDiamondComponent",
        metadata: {
          contractId: "component.HasDiamond",
        },
      }
    ),
    HasGoldComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "HasGoldComponent",
        metadata: {
          contractId: "component.HasGold",
        },
      }
    ),
    HasSilverComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "HasSilverComponent",
        metadata: {
          contractId: "component.HasSilver",
        },
      }
    ),
    PlayerComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "PlayerComponent",
        metadata: {
          contractId: "component.Player",
        },
      }
    ),
    Point1Component: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "Point1Component",
        metadata: {
          contractId: "component.Point1",
        },
      }
    ),
    Point2Component: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "Point2Component",
        metadata: {
          contractId: "component.Point2",
        },
      }
    ),
    Point3Component: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "Point3Component",
        metadata: {
          contractId: "component.Point3",
        },
      }
    ),
    Point4Component: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "Point4Component",
        metadata: {
          contractId: "component.Point4",
        },
      }
    ),
    Point5Component: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "Point5Component",
        metadata: {
          contractId: "component.Point5",
        },
      }
    ),
    MasterComponent: defineComponent(
      world,
      {
        value: 3,
      },
      {
        id: "MasterComponent",
        metadata: {
          contractId: "component.Master",
        },
      }
    ),
  };

  // --- SETUP ----------------------------------------------------------------------
  const { txQueue, systems, txReduced$, network, startSync, encoders } = await setupMUDNetwork<
    typeof components,
    SystemTypes
  >(getNetworkConfig(config), world, components, SystemAbis);

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$);

  // --- API ------------------------------------------------------------------------

  // Entities
  const id: EntityID = 0;

  // world.registerEntity({ id: "0x0000000000000000000000000000000000000000" });

  // --- CONTEXT --------------------------------------------------------------------
  const context = {
    world,
    components,
    txQueue,
    systems,
    txReduced$,
    startSync,
    network,
    actions,
    api: {},
    dev: setupDevSystems(world, encoders, systems),
  };

  return context;
}
