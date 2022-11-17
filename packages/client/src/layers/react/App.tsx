import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@primer/react";
import Explorer from "./layout/Explorer";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import { AppContext, stores } from "./AppContext";

import "./App.css";

interface AppProps {}

function App(props: AppProps) {
  return (
    <ThemeProvider>
      <AppContext.Provider value={stores}>
        <div>
            <Header />
            <Sidebar />
            <Explorer />
        </div>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;