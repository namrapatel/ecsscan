import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@primer/react";
import "../styles/Sidebar.css";
import { AppContext } from "../AppContext";
import { initApp } from "../backend/initApp";
import { useLayers } from "../engine";
import { buildWorld } from "../../loupe/loupe";
import { connectProvider } from "../backend/utils";
import { storeAnnotation } from "mobx/dist/internal";

interface SidebarProps {}

export const Sidebar = observer(function(props: SidebarProps) {
  const layers = useLayers();
  if (!layers) return null;

  const { applicationStore } = React.useContext(AppContext);
  const mudWorld = layers.network.world;
  console.log(applicationStore);
  console.log(applicationStore.web3Provider);
  return (
    <div>
      {
        !applicationStore.web3Provider ? (
          <Button onClick={async() => {
            const provider = await connectProvider();
            applicationStore.setWeb3Provider(provider)
            console.log(applicationStore.web3Provider)
          }}>Connect to Provider</Button>
        ) : (null)
      }
      <Button onClick={() => {
        if (mudWorld !== null && mudWorld !== undefined) {
          initApp(applicationStore, mudWorld);
        } else {
          console.error("mudWorld is null in Sign In button");
        }
      }}>Sign In</Button>
      <Button onClick={() => {
        console.log(mudWorld)
        console.log(applicationStore.web3Provider)
        if ((mudWorld && applicationStore.web3Provider !== null) && (mudWorld && applicationStore.web3Provider !== undefined)) {
          buildWorld(mudWorld, applicationStore.web3Provider);
        } else {
          console.error("mudWorld is null in BuildWorld button");
        }
      }}>Build World</Button>
    </div>
  );
});

export default Sidebar;