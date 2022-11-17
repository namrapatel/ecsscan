import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@primer/react";
import "../styles/Sidebar.css";
import { AppContext } from "../AppContext";
import { initApp } from "../backend/initApp";
import { useLayers } from "../engine";
import { buildWorld } from "../../loupe/loupe";

interface SidebarProps {}

export const Sidebar = observer(function(props: SidebarProps) {
  const layers = useLayers();
  if (!layers) return null;

  const { applicationStore } = React.useContext(AppContext);
  const mudWorld = layers.network.world;
  const provider = applicationStore.web3Provider;

  return (
    <div>
      <Button onClick={() => {
        if (mudWorld !== null && mudWorld !== undefined) {
          initApp(applicationStore, mudWorld);
        } else {
          console.error("mudWorld is null in Sidebar.tsx");
        }
      }}>Sign In</Button>
      <Button onClick={() => {
        if ((mudWorld && provider !== null) && (mudWorld && provider !== undefined)) {
          buildWorld(mudWorld, provider)
        } else {
          console.error("mudWorld is null in BuildWorld button");
        }
      }}>Build World</Button>
    </div>
  );
});

export default Sidebar;