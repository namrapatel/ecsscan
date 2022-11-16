import React, { useEffect, useState } from "react";
import { Button } from "@primer/react";

import "../styles/Sidebar.css";

interface SidebarProps {}

function Sidebar(props: SidebarProps) {
  return (
    <div>
      <Button>Sign In</Button>
    </div>
  );
}

export default Sidebar;