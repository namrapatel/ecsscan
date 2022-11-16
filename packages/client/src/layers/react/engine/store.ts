import { observable, action } from "mobx";
import { GridConfiguration, UIComponent } from "./types";

export const EngineStore = observable({
  UIComponents: new Map<string, UIComponent>(),
});
