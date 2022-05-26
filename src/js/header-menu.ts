type Props = { className: string };

export default class HeaderMenu {
  private target: HTMLElement | null = null;
  private className = "";
  private scrollPosition = 0;
  private isInitialPosition = true;
  private firstLoad = true;
  private sections: NodeListOf<Element>;
  private lastLink: Element | null = null;
  private idRequest = 0;

  constructor(props: Props) {
    this.firstLoad = true;
    this.className = props.className;
    this.target = document.querySelector<HTMLElement>(props.className);
    this.sections = document.querySelectorAll(".__section");
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

    window.addEventListener("scroll", () => {
      this.handlePositionStickyMenu();
    });

    this.activeMenu();
  }

  private handlePositionStickyMenu() {
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

  private activeMenu() {
    function outerHeight(el: HTMLElement) {
      let height = el.offsetHeight;
      const style = getComputedStyle(el);
      height += parseInt(style.marginTop) + parseInt(style.marginBottom);
      return height;
    }

    function outerWidth(el: HTMLElement) {
      let width = el.offsetWidth;
      const style = getComputedStyle(el);
      width += parseInt(style.marginLeft) + parseInt(style.marginRight);
      return width;
    }
    const getCoords = (element: Element | undefined, position: string) => {
      let point = { x: 0, y: 0 };
      if (!element) return point;
      const { top, left, width, height } = element.getBoundingClientRect();
      switch (position) {
        case "top left":
          point = {
            x: left + window.pageXOffset,
            y: top + window.pageYOffset,
          };
          break;
        case "top center":
          point = {
            x: left + width / 2 + window.pageXOffset,
            y: top + window.pageYOffset,
          };
          break;
        case "top right":
          point = {
            x: left + width + window.pageXOffset,
            y: top + window.pageYOffset,
          };
          break;
        case "center left":
          point = {
            x: left + window.pageXOffset,
            y: top + height / 2 + window.pageYOffset,
          };
          break;
        case "center":
          point = {
            x: left + width / 2 + window.pageXOffset,
            y: top + height / 2 + window.pageYOffset,
          };
          break;
        case "center right":
          point = {
            x: left + width + window.pageXOffset,
            y: top + height / 2 + window.pageYOffset,
          };
          break;
        case "bottom left":
          point = {
            x: left + window.pageXOffset,
            y: top + height + window.pageYOffset,
          };
          break;
        case "bottom center":
          point = {
            x: left + width / 2 + window.pageXOffset,
            y: top + height + window.pageYOffset,
          };
          break;
        case "bottom right":
          point = {
            x: left + width + window.pageXOffset,
            y: top + height + window.pageYOffset,
          };
          break;
      }
      return point;
    };

    const sections = document.querySelectorAll(".__section");
    const links = document.querySelectorAll(".HeaderMenu_link");

    // for (const link of links) {
    //   const child = link.querySelector("a") as Element;
    //   (link as HTMLElement).style.width = getComputedStyle(
    //     child,
    //     ":before"
    //   ).width;
    // }

    const dash = document.querySelector(".HeaderMenu_dash") as HTMLElement;
    const dashContainer = document.querySelector(
      ".HeaderMenu_dashContainer"
    ) as HTMLElement;
    const widthDashContainer =
      getCoords(links[links.length - 1], "bottom right")?.x -
      getCoords(links[0], "bottom left")?.x;
    dashContainer.style.width = `${widthDashContainer}px`;

    window.addEventListener("scroll", () => {
      const scrollDistance = window.scrollY;
      if (window.innerWidth > 768) {
        sections.forEach((el, i) => {
          const element = el as HTMLElement;

          const firstElement = sections[0] as HTMLElement;
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

          const parentPos = document
            .getElementById("HeaderMenu_links")
            ?.getBoundingClientRect();
          const childPos = activeElement?.getBoundingClientRect();

          const relativePosLeft =
            (childPos?.left ?? 0) - (parentPos?.left ?? 0);
          if (i <= 0) {
            dash.style.opacity = "0";
          } else {
            dash.style.opacity = "1";
          }

          if (elementStart <= scrollDistance && scrollDistance <= elementEnd) {
            activeElement?.classList.add("HeaderMenu_link__active");
            activeElement?.classList.remove("HeaderMenu_link__deactive");

            if (dash) {
              if (activeElement) {
                dash.style.transform = `translate(${relativePosLeft - 40}px,0)`;
              } else {
                if (scrollDistance > getCoords(sections[0], "bottom left")?.y) {
                  dash.style.transform = `translate(${
                    getCoords(links[links.length - 1], "bottom left")?.x
                  }px,0)`;
                } else {
                  dash.style.transform = `translate(-${outerWidth(
                    links[0] as HTMLElement
                  )}px,0)`;
                }
              }
              dash.style.width = `${activeElement?.clientWidth}px`;
              if (i === 0) {
                dash.style.transitionDelay = "0ms, 0ms";
              } else {
                dash.style.transitionDelay = "50ms, 0ms";
              }
            }

            return;
          }
          activeElement?.classList.add("HeaderMenu_link__deactive");
          activeElement?.classList.remove("HeaderMenu_link__active");
        });
      }
    });
  }
}
