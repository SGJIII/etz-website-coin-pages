import { addLinkClickCallback } from "./links/links";
import { AddEventOrientationChange } from "./utils/addEventOrientationchange";
import { getCoords } from "./utils/getCoords";
import { outerWidth } from "./utils/outerWidth";
import { disableBodyScroll, enableBodyScroll } from "./utils/scroll";

type Props = { className: string };

export default class HeaderMenu {
  private target: HTMLElement | null = null;
  private targetMobile: HTMLElement | null = null;
  private targetMobileContainer: HTMLElement | null | undefined = null;
  private buttonDemo: HTMLElement | null = null;
  private buttonJoin: HTMLElement | null = null;
  private burger: HTMLInputElement | null = null;
  private className = "";
  private scrollPosition = 0;
  private isInitialPosition = true;
  private firstLoad = true;
  private sections: NodeListOf<HTMLElement>;
  private links: NodeListOf<HTMLElement>;
  private scrollDistance = 0;
  isScrollDisabled = false;

  constructor(props: Props) {
    this.firstLoad = true;
    this.className = props.className;
    this.target = document.querySelector<HTMLElement>(props.className);
    this.sections = document.querySelectorAll(".__section");
    this.links = document.querySelectorAll(".HeaderMenu_link");
    this.targetMobile = document.querySelector(".HeaderMenu_menu__mobile");
    this.targetMobileContainer = this.targetMobile?.querySelector(
      ".HeaderMenu_menuContainer"
    );
    this.burger = document.querySelector<HTMLInputElement>(
      "[data-name=HeaderMenuBurger]"
    );

    this.buttonDemo = document.querySelector("[name-button-demo]");
    this.buttonJoin = document.querySelector("[name-button-join]");
  }

  /**
   * init
   */
  public init() {
    if (!this.target) {
      throw new Error(
        `The target does not exist with the ${this.className} class`
      );
    }

    this.target.style.display = "flex";
    this.handlePositionStickyMenu();
    this.handleAnimationMenu();
    this.handleMobileMenuActiveTab();
    this.handleBurger();
    window.addEventListener("touchmove", this.watchScrollChange.bind(this));
    window.addEventListener("scroll", this.watchScrollChange.bind(this));
    AddEventOrientationChange(this.watchOrientationChange.bind(this));
    window.addEventListener("resize", this.watchResizeChange.bind(this));
  }

  watchOrientationChange() {
    this.swapStateMenu();
    this.handleStateMobileMenu();
  }
  watchResizeChange() {
    this.swapStateMenu();
    this.handleStateMobileMenu();
  }
  watchScrollChange() {
    this.handlePositionStickyMenu();
    this.handleStateMobileMenu();
  }

  menu() {
    if (window.innerWidth <= 1200)
      return {
        sticky: () =>
          this.targetMobile?.classList.add("HeaderMenu_menu__mobileSticky"),
        unsticky: () =>
          this.targetMobile?.classList.remove("HeaderMenu_menu__mobileSticky"),
        open: () => {
          this.targetMobile?.classList.add("HeaderMenu_menuContainer__open");
          this.targetMobile?.classList.remove("HeaderMenu_menu__mobileSticky");
        },
        close: () => {
          const heightMobileMenu =
            this.targetMobileContainer?.getBoundingClientRect()?.height ?? 0;
          this.targetMobile?.classList.remove("HeaderMenu_menuContainer__open");
          if (this.burger) {
            this.burger.checked = false;
          }
          if (this.prevScrollPosition >= heightMobileMenu) {
            this.targetMobile?.classList.add("HeaderMenu_menu__mobileSticky");
          }
        },
      };

    return {
      sticky: () => {
        this.target?.classList.add("HeaderMenu_menu__sticky");
        this.target?.classList.remove("HeaderMenu_menu__stickyHide");

        this.buttonDemo?.classList.add("Button__secondary");
        this.buttonDemo?.classList.remove("Button__whiteSecondary");

        this.buttonJoin?.classList.add("Button__primary");
        this.buttonJoin?.classList.remove("Button__whitePrimary");
      },
      unsticky: () => {
        this.target?.classList.remove("HeaderMenu_menu__sticky");
        this.target?.classList.add("HeaderMenu_menu__stickyHide");

        this.buttonDemo?.classList.add("Button__whiteSecondary");
        this.buttonDemo?.classList.remove("Button__secondary");

        this.buttonJoin?.classList.add("Button__whitePrimary");
        this.buttonJoin?.classList.remove("Button__primary");
      },
      open: () => {
        this.targetMobile?.classList.add("HeaderMenu_menuContainer__open");
      },
      close: () => {
        this.targetMobile?.classList.remove("HeaderMenu_menuContainer__open");
      },
    };
  }

  get isOpenMenu() {
    if (window.innerWidth <= 1200)
      return this.targetMobile?.classList.contains(
        "HeaderMenu_menuContainer__open"
      );
  }

  private handleStateMobileMenu() {
    if (window.innerWidth > 1200) return;
    this.calculatePosition();
    const heightMobileMenu =
      this.targetMobileContainer?.getBoundingClientRect()?.height ?? 0;
    const phoneBlock = document.querySelector("canvas");
    const scrollStatus = phoneBlock?.getAttribute("data-status");

    if (this.scrollPosition >= heightMobileMenu) {
      this.targetMobile?.classList.add("HeaderMenu_menu__mobileSticky");
    } else if (scrollStatus !== "stop") {
      this.targetMobile?.classList.remove("HeaderMenu_menu__mobileSticky");
    }
  }
  prevScrollPosition = 0;
  private handleBurger() {
    this.burger?.addEventListener("click", () => {
      if (!this.isOpenMenu) {
        this.menu().open();
        setTimeout(() => {
          this.prevScrollPosition = this.scrollPosition;
          disableBodyScroll(this.targetMobile);
          this.isScrollDisabled = true;
        }, 10);
      } else {
        enableBodyScroll(this.targetMobile);
        this.menu().close();
        this.isScrollDisabled = true;
      }
    });
    addLinkClickCallback(() => {
      if (this.isOpenMenu) {
        enableBodyScroll(this.targetMobile);
        this.menu().close();
      }
    });
  }

  private swapStateMenu() {
    if (window.innerWidth <= 1200) {
      this.target?.classList.remove("HeaderMenu_menu__sticky");
      this.target?.classList.remove("HeaderMenu_menu__stickyHide");
    }
  }

  private handlePositionStickyMenu() {
    if (window.innerWidth <= 1200 || screen.width < 900) {
      this.target?.classList.remove("HeaderMenu_menu__sticky");
      this.target?.classList.remove("HeaderMenu_menu__stickyHide");
      return;
    }

    this.calculatePosition();
    if (this.isInitialPosition) {
      // this.target?.classList.add("HeaderMenu_menu__sticky");
      // this.target?.classList.remove("HeaderMenu_menu__stickyHide");
      this.menu().sticky();
      this.firstLoad = false;
      return;
    }

    if (this.firstLoad) return;
    // this.target?.classList.remove("HeaderMenu_menu__sticky");
    // this.target?.classList.add("HeaderMenu_menu__stickyHide");
    this.menu().unsticky();
  }

  private calculatePosition() {
    this.scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    this.isInitialPosition =
      this.scrollPosition >
      (this.target?.clientHeight ?? 0) -
        (this.target?.clientHeight ?? 0) / 2 -
        26;
  }

  private handleAnimationMenu() {
    const dashContainer = document.querySelector<HTMLElement>(
      ".HeaderMenu_dashContainer"
    );
    const widthDashContainer =
      getCoords(this.links[this.links.length - 1], "bottom right")?.x -
      getCoords(this.links[0], "bottom left")?.x;
    if (dashContainer) dashContainer.style.width = `${widthDashContainer}px`;

    const pathname = window.location.pathname;

    const activeElement = document
      .querySelector(".HeaderMenu_menu")
      ?.querySelector(
        `a[href$="${pathname === "/" ? pathname : pathname.replace("/", "")}"]`
      )
      ?.closest(".HeaderMenu_link");

    this.handleAnimationDash(activeElement);
  }

  private handleMobileMenuActiveTab() {
    const activeItemClass = "HeaderMenu_linkMobile__active";

    const pathname = window.location.pathname;

    const allMenuLinks = this.targetMobile?.querySelectorAll(
      ".HeaderMenu_linkMobile"
    );

    const activeElement = this.targetMobile?.querySelector(
      `a.HeaderMenu_linkMobile[href$="${
        pathname === "/" ? pathname : pathname.replace("/", "")
      }"]`
    );

    allMenuLinks?.forEach((item) => item.classList.remove(activeItemClass));
    activeElement?.classList.add(activeItemClass);
  }

  private handleAnimationDash(activeElement: Element | null | undefined) {
    const dash = document
      .querySelector(".HeaderMenu_menu")
      ?.querySelector<HTMLElement>(".HeaderMenu_dash");
    const parentPos = document
      .querySelector(".HeaderMenu_menu")
      ?.querySelector<HTMLElement>("#HeaderMenu_links")
      ?.getBoundingClientRect();
    const childPos = activeElement?.getBoundingClientRect();

    const relativePosLeft = (childPos?.left ?? 0) - (parentPos?.left ?? 0);

    if (!dash) return;

    if (activeElement) {
      dash.style.transform = `translate(${relativePosLeft}px,0)`;
    } else {
      if (this.scrollDistance > getCoords(this.sections[0], "bottom left")?.y) {
        dash.style.transform = `translate(${
          getCoords(this.links[this.links.length - 1], "bottom left")?.x
        }px,0)`;
      } else {
        dash.style.transform = `translate(-${
          outerWidth(this.links[0]) * 2
        }px,0)`;
      }
    }
    dash.style.width = `${activeElement?.clientWidth}px`;
  }
}

const headerMenu = new HeaderMenu({ className: ".HeaderMenu_menu" });
headerMenu.init();
