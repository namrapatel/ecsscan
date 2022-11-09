import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useLayers } from "../hooks";
import { getComponentValue } from "@latticexyz/recs";
import { GodID, SyncState } from "@latticexyz/network";
import { BootScreen } from "./BootScreen";
import { useStream } from "@latticexyz/std-client";
import { Layers } from "../../../../types";
import { concat, map, of } from "rxjs";
import App from "../../App";

export const CustomRenderer: React.FC<{ layers: Layers }> = React.memo(({ layers }) => {
  const req = useMemo(() => {
    const {
      components: { LoadingState },
      world,
    } = layers.network;

    return concat([1], LoadingState.update$).pipe(
      map(() => ({
        LoadingState,
        world,
      }))
    );
  }, [layers]);
  const state = useStream(req);
  if (!state) return null;

  const {
    components: { LoadingState },
    world,
  } = layers.network;

  const GodEntityIndex = world.entityToIndex.get(GodID);

  const loadingState = GodEntityIndex == null ? null : getComponentValue(LoadingState, GodEntityIndex);
  if (loadingState == null) {
    return <BootScreen initialOpacity={1}>Connecting</BootScreen>;
  }

  if (loadingState.state !== SyncState.LIVE) {
    return <BootScreen initialOpacity={1}>{loadingState.msg}</BootScreen>;
  }

  return <BootScreen initialOpacity={1}>Connecting</BootScreen>;

  return <App />;
});

export const ComponentRenderer: React.FC = observer(() => {
  // const { UIComponents } = useEngineStore();
  const layers = useLayers();
  if (!layers) return null;

  return <CustomRenderer layers={layers} />;
});
