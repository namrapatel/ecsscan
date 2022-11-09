import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@primer/react";
import Explorer from "./layout/Explorer";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";

import "./App.css";

interface AppProps {}

function App(props: AppProps) {
  return (
    <ThemeProvider>
      <div>
        <Header />
        <Sidebar />
        <Explorer />
      </div>
    </ThemeProvider>
  );
}

export default App;
