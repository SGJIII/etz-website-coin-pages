import DocumentElement from "./documentElement";

class BodyWatcher<T extends HTMLElement> extends DocumentElement<T> {
  static __idWather: number | null = null;
  public static body: HTMLElement = document.body;
  public static top = 0;
  public static bottom = 0;
  public static x = 0;
  public static y = 0;
  public initialOffset = {
    top: 0,
    bottom: 0,
  };
  phoneBlock: HTMLElement | null = null;
  constructor(props: string) {
    super(props);
    this.startWatchBody();
    this.phoneBlock = document.querySelector(".webgl");
    if (this.detectDevice) {
      this.phoneBlock?.setAttribute("data-device", "mobile");
    } else {
      this.phoneBlock?.setAttribute("data-device", "desktop");
    }
    this.phoneBlock?.setAttribute("data-status", "start");
    this.setInitialOffsetElement();
  }

  public setInitialOffsetElement() {
    this.initialOffset = {
      top: this.pageOffset.top + (this.rect?.top ?? 0),
      bottom: this.pageOffset.top + (this.rect?.top ?? 0) + this.height,
    };
  }

  public startWatchBody() {
    const rectBody = BodyWatcher.body.getBoundingClientRect();
    BodyWatcher.top = -rectBody.top;
    BodyWatcher.bottom = -rectBody.bottom;
    BodyWatcher.x = rectBody.x;
    BodyWatcher.y = rectBody.y;
    BodyWatcher.__idWather = requestAnimationFrame(() => {
      this.startWatchBody();
    });
  }

  public stopWatchBody() {
    if (BodyWatcher.__idWather === null) {
      return console.warn("Body watcher was not launched.");
    }
    cancelAnimationFrame(BodyWatcher.__idWather);
  }

  get pageOffset() {
    return {
      top: BodyWatcher.top,
      bottom: BodyWatcher.bottom,
      x: BodyWatcher.x,
      y: BodyWatcher.y,
    };
  }

  get detectDevice() {
    const isMobile = window.matchMedia || window.msMatchMedia;
    if (isMobile) {
      const match_mobile = isMobile("(pointer:coarse)");
      return match_mobile.matches;
    }
    return false;
  }
  public scrollBodyDisable(top: undefined | number = 0) {
    if (this.detectDevice) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `${-top}px`;
      document.body.style.left = "0px";
      this.phoneBlock?.setAttribute("data-status", "stop");
    } else {
      document.body.style.overflow = "hidden";
    }
  }

  public scrollBodyEnable(deltaY: number) {
    if (this.detectDevice) {
      document.body.style.overflow = "initial";
      const y = -parseInt(document.body.style.top, 10);
      const x = -parseInt(document.body.style.left, 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      this.phoneBlock?.setAttribute("data-status", "start");
      window.scroll(x, y + deltaY * 1.5);
    } else {
      document.body.style.overflow = "initial";
    }
  }
}

export default BodyWatcher;
