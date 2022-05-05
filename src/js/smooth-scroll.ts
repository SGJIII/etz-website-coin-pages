export default class SmoothScroll {
  private anchors: NodeListOf<Element>;

  constructor() {
    this.anchors = document.querySelectorAll('a[href*="#"]');
  }

  /**
   * init
   */
  public init() {
    this.addSmoothScrollToAllLink();
  }

  private addSmoothScrollToAllLink() {
    for (let i = 0; i < this.anchors.length; i++) {
      const anchors = this.anchors;
      anchors[i].addEventListener("click", function (e) {
        e.preventDefault();

        const blockID = anchors[i].getAttribute("href")?.substr(1);
        if (!blockID) return;
        document.getElementById(blockID)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }
}
