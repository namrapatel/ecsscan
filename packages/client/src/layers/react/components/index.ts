import { registerComponentBrowser } from "./ComponentBrowser";
import { registerActionQueue } from "./ActionQueue";
import { registerLoadingState } from "./LoadingState";
import { registerPlaceHolder } from "./Placeholder";

export function registerUIComponents() {
  registerLoadingState();
  // registerComponentBrowser();
  // registerActionQueue();
  registerPlaceHolder();
}
