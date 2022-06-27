import { AddEventOrientationChange } from "./addEventOrientationchange";

class DocumentElement<T extends Element> {
  element: T | null = null;
  height = 0;
  width = 0;
  rect: DOMRect | undefined;
  __IdcalculateRect = 0;

  constructor(name: string) {
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

export default DocumentElement;
