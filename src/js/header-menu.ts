type Props = { className: string };

export default class HeaderMenu {
  private target: HTMLElement | null = null;
  private className = "";
  private scrollPosition = 0;

  private isInitialPosition = true;

  private firstLoad = true;

  constructor(props: Props) {
    this.firstLoad = true;
    this.className = props.className;
    this.target = document.querySelector<HTMLElement>(props.className);
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
      this.scrollPosition > (this.target?.clientHeight ?? 0) * (3 / 5);
  }
}
