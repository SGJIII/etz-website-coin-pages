import { AddEventOrientationChange } from "./addEventOrientationchange";
import Workspace from "./workspace";

class WorkspaceElement<T extends Element> extends Workspace {
  element: T | null = null;
  height = 0;
  width = 0;
  rect: DOMRect | undefined;
  __IdcalculateRect = 0;

  constructor(name: string) {
    super();
    this.element = document.querySelector<T>(name);
    cancelAnimationFrame(this.__IdcalculateRect);
    const calculateRect = () => {
      this.rect = this.element?.getBoundingClientRect();
      if (this.rect === undefined) {
        throw new Error(`${name} element not exist`);
      }
      this.height = this.rect.height;
      this.width = this.rect.width;
      this.__IdcalculateRect = requestAnimationFrame(calculateRect);
    };
    calculateRect();
    AddEventOrientationChange(() => {
      calculateRect();
    });
  }
}

export default WorkspaceElement;
