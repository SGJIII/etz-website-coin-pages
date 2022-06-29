import WorkspaceElementAll from "../utils/workspaceElementAll";

type Callback = () => void;
class Links extends WorkspaceElementAll<HTMLLinkElement> {
  private static arrayCallback: (() => void | never)[] = [];
  init() {
    this.initClickEvent(this);

    const margin = getComputedStyle(document.documentElement).getPropertyValue(
      "--section-margin-top"
    );
    console.log(margin);
  }

  public static addLinkClickCallback(callback: Callback) {
    Links.arrayCallback.push(callback);
  }

  private calculatePositionLink(name: string | null) {
    if (name === null) return 0;
    const element = document.querySelector(name);
    const body = document.body.getBoundingClientRect();
    const rect = element?.getBoundingClientRect();
    let position = Math.abs((rect?.top ?? 0) - body.top);
    const heightMenu = 106;
    let marginBottomMenu = 0;
    switch (name) {
      case "#contact-us":
        marginBottomMenu = 0;
        position = position - marginBottomMenu - heightMenu;

        break;
      case "#benefits":
        marginBottomMenu = 0;
        break;
      case "#etz-mobile":
        marginBottomMenu = 0;
        position = position - marginBottomMenu - heightMenu;

        position =
          position -
          (window.innerHeight / 2 - ((rect?.height ?? 0) + heightMenu) / 2);
        break;
      default:
        marginBottomMenu = 64;
        position = position - marginBottomMenu - heightMenu;
        break;
    }
    return position;
  }

  public initClickEvent(_self: Links) {
    this.elements?.forEach((link) => {
      const href = link.getAttribute("href");
      link.addEventListener("click", function (e) {
        e.preventDefault();
        Links.arrayCallback.forEach((callback) => {
          if (typeof callback === "function") {
            callback();
          }
        });
        const isInstantScroll = link.getAttribute("data-scroll");
        window.scrollTo({
          top: _self.calculatePositionLink(href),
          behavior: isInstantScroll ? "auto" : "smooth",
        });
      });
    });
  }
}

const links = new Links("[name-link]");
links.init();

export const addLinkClickCallback = Links.addLinkClickCallback;
