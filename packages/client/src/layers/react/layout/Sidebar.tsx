import React, { useEffect, useState } from "react";
import { Button } from "@primer/react";

interface SidebarProps {}

function Sidebar(props: SidebarProps) {
  return (
    <div>
      <Button>Sign In</Button>
    </div>
  );
}

export default Sidebar;
