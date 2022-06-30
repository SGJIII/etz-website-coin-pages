import { AddEventOrientationChange } from "./addEventOrientationchange";
import { detectDevice } from "./detectDevice";

class Workspace {
  public static isMobileDevice = false;

  constructor() {
    Workspace.isMobileDevice = detectDevice();
    window.addEventListener("resize", () => {
      Workspace.isMobileDevice = !detectDevice();
    });
    AddEventOrientationChange(() => {
      Workspace.isMobileDevice = !detectDevice();
    });
  }

  public querySelector<T extends HTMLElement>(selectors: string) {
    return document.querySelector<T>(selectors);
  }

  public querySelectorAll<T extends HTMLElement>(selectors: string) {
    return document.querySelectorAll<T>(selectors);
  }

  public createElement<T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    options?: ElementCreationOptions | undefined
  ) {
    return document.createElement(tagName, options);
  }
}

export default Workspace;
