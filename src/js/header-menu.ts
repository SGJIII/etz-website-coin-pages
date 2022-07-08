import { addLinkClickCallback } from "./links/links";
import { AddEventOrientationChange } from "./utils/addEventOrientationchange";
import { getCoords } from "./utils/getCoords";
import { outerHeight } from "./utils/outerHeight";
import { outerWidth } from "./utils/outerWidth";
import { disableBodyScroll, enableBodyScroll } from "./utils/scroll";

type Props = { className: string };

export default class HeaderMenu {
  private target: HTMLElement | null = null;
  private targetMobile: HTMLElement | null = null;
  private targetMobileContainer: HTMLElement | null | undefined = null;
  private burger: HTMLElement | null = null;
  private className = "";
  private scrollPosition = 0;
  private isInitialPosition = true;
  private firstLoad = true;
  private sections: NodeListOf<Element>;
  private links: NodeListOf<Element>;
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
    this.burger = document.querySelector<HTMLElement>(
      "[data-name=HeaderMenuBurger]"
    );
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
    this.handleBurger();
    console.log(window.ontouchmove);
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
          if (this.prevScrollPosition >= heightMobileMenu) {
            this.targetMobile?.classList.add("HeaderMenu_menu__mobileSticky");
          }
        },
      };

    return {
      sticky: () => {
        this.target?.classList.add("HeaderMenu_menu__sticky");
        this.target?.classList.remove("HeaderMenu_menu__stickyHide");
      },
      unsticky: () => {
        this.target?.classList.remove("HeaderMenu_menu__sticky");
        this.target?.classList.add("HeaderMenu_menu__stickyHide");
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
        this.prevScrollPosition = this.scrollPosition;
        this.menu().open();
        disableBodyScroll(this.targetMobile);
        this.isScrollDisabled = true;
      } else {
        enableBodyScroll(this.targetMobile);
        this.menu().close();
        this.isScrollDisabled = true;
      }
    });
    addLinkClickCallback(() => {
      if (this.isScrollDisabled) {
        this.burger?.click();
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
      this.target?.classList.add("HeaderMenu_menu__sticky");
      this.target?.classList.remove("HeaderMenu_menu__stickyHide");
      this.firstLoad = false;
      return;
    }

    if (this.firstLoad) return;
    this.target?.classList.remove("HeaderMenu_menu__sticky");
    this.target?.classList.add("HeaderMenu_menu__stickyHide");
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
    const dashContainer = document.querySelector(
      ".HeaderMenu_dashContainer"
    ) as HTMLElement;
    const widthDashContainer =
      getCoords(this.links[this.links.length - 1], "bottom right")?.x -
      getCoords(this.links[0], "bottom left")?.x;
    dashContainer.style.width = `${widthDashContainer}px`;

    window.addEventListener("scroll", () => {
      this.scrollDistance = window.scrollY;
      if (window.innerWidth > 768) {
        this.sections.forEach((el) => {
          const element = el as HTMLElement;

          const firstElement = this.sections[0] as HTMLElement;
          const style = getComputedStyle(element);
          const elementStart =
            element.offsetTop -
            parseInt(style.marginTop) -
            outerHeight(firstElement) / 2;
          const elementEnd =
            element.offsetTop +
            element.offsetHeight +
            parseInt(style.marginBottom) -
            outerHeight(firstElement) / 2;

          const activeElement = document
            .querySelectorAll(`a[href="#${el.id}"]`)[0]
            ?.closest(".HeaderMenu_link");

          if (
            elementStart <= this.scrollDistance &&
            this.scrollDistance <= elementEnd
          ) {
            activeElement?.classList.add("HeaderMenu_link__active");
            activeElement?.classList.remove("HeaderMenu_link__deactive");

            this.handleAnimationDash(activeElement);
            return;
          }
          activeElement?.classList.add("HeaderMenu_link__deactive");
          activeElement?.classList.remove("HeaderMenu_link__active");
        });
      }
    });
  }

  private handleAnimationDash(activeElement: Element | null) {
    const dash = document.querySelector(".HeaderMenu_dash") as HTMLElement;
    const parentPos = document
      .getElementById("HeaderMenu_links")
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
        dash.style.transform = `translate(-${outerWidth(
          this.links[0] as HTMLElement
        )}px,0)`;
      }
    }
    dash.style.width = `${activeElement?.clientWidth}px`;
  }
}

const headerMenu = new HeaderMenu({ className: ".HeaderMenu_menu" });
headerMenu.init();
