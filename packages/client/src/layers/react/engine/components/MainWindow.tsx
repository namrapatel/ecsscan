import React from "react";
import { observer } from "mobx-react-lite";
import { ComponentRenderer } from "./ComponentRenderer";

export const MainWindow: React.FC = observer(() => {
  return <div></div>; // Removed component renderer from here
});
