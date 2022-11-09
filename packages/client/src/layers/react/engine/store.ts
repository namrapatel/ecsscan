import { observable, action } from "mobx";
import { UIComponent } from "./types";

export const EngineStore = observable({
  UIComponents: new Map<string, UIComponent>(),
});
