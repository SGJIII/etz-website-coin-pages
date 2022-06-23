import { getCoords } from "./utils/getCoords";
import { outerHeight } from "./utils/outerHeight";
import { outerWidth } from "./utils/outerWidth";
import { toggleDisableScroll } from "./utils/scroll";

type Props = { className: string };

export default class HeaderMenu {
  private target: HTMLElement | null = null;
  private className = "";
  private scrollPosition = 0;
  private isInitialPosition = true;
  private firstLoad = true;
  private sections: NodeListOf<Element>;
  private links: NodeListOf<Element>;
  private scrollDistance = 0;

  constructor(props: Props) {
    this.firstLoad = true;
    this.className = props.className;
    this.target = document.querySelector<HTMLElement>(props.className);
    this.sections = document.querySelectorAll(".__section");
    this.links = document.querySelectorAll(".HeaderMenu_link");
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
    const eventLinstener = () => {
      this.handlePositionStickyMenu();
    };

    this.target.style.display = "flex";
    this.handlePositionStickyMenu();

    window.addEventListener("scroll", eventLinstener);
    this.handleAnimationMenu();

    window.addEventListener("resize", () => {
      if (window.innerWidth < 1200) {
        this.target?.classList.remove("HeaderMenu_menu__sticky");
        this.target?.classList.remove("HeaderMenu_menu__stickyHide");
      }
    });

    const burger = document.querySelector("[data-name=HeaderMenuBurger]");
    const menu = document.querySelector(".HeaderMenu_menu");

    burger?.addEventListener("click", () => {
      menu?.classList.toggle("HeaderMenu_menuContainer__open");
      toggleDisableScroll();
    });

    const links = document.querySelectorAll<HTMLLinkElement>(
      "[data-name=HeaderMenuLink]"
    );
    links.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const href = el.getAttribute("href") ?? "";
        const element = document.querySelector(href)?.getBoundingClientRect();
        const rectBody = document.body.getBoundingClientRect();
        window.scrollTo({
          top: (element?.top ?? 0) - rectBody.top,
        });
        menu?.classList.remove("HeaderMenu_menuContainer__open");
        toggleDisableScroll();

        return false;
      });
    });
  }

  private handlePositionStickyMenu() {
    if (window.innerWidth < 1200) return;
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
