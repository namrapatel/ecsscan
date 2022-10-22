import { registerComponentBrowser } from "./ComponentBrowser";
import { registerActionQueue } from "./ActionQueue";
import { registerLoadingState } from "./LoadingState";
import { registerTestButton } from "./TestButton";

export function registerUIComponents() {
  registerLoadingState();
  // registerTestButton();
  registerComponentBrowser();
  registerActionQueue();
}
