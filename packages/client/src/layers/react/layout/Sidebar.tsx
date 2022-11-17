import React, { useEffect, useState } from "react";
import { Button } from "@primer/react";
import "../styles/Sidebar.css";
import { boot } from "../../../boot";

interface SidebarProps {}

function Sidebar(props: SidebarProps) {
  return (
    <div>
      <Button onClick={() => {
        boot()
      }}>Sign In</Button>
    </div>
  );
}

export default Sidebar;