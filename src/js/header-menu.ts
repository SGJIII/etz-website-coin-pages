export default class HeaderMenu {
  private target: Element | null = null;

  private scrollPosition = 0;

  private isInitialPosition = true;

  private firstLoad = true;

  constructor() {
    this.firstLoad = true;
  }

  /**
   * init
   */
  public init() {
    this.firstLoad = true;
    this.target = document.querySelector(".HeaderMenu_menu");

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
