import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@primer/react";
import "../styles/Sidebar.css";
import { AppContext } from "../AppContext";
import { initApp } from "../backend/initApp";

interface SidebarProps {}

export const Sidebar = observer(function(props: SidebarProps) {
  const { applicationStore } = React.useContext(AppContext);
  const mudWorld = applicationStore.mudWorld;

  return (
    <div>
      <Button onClick={() => {
        if (mudWorld !== null && mudWorld !== undefined) {
          initApp(applicationStore, mudWorld);
        } else {
          console.error("mudWorld is null in Sidebar.tsx");
        }
      }}>Sign In</Button>
    </div>
  );
});

export default Sidebar;