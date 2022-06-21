export default class Accordion {
  private accordions: HTMLCollectionOf<Element>;
  private isFirstArray: boolean[] = [];

  constructor() {
    this.accordions = document.getElementsByClassName("FAQSection_accordion");
  }

  /**
   * init
   */
  public init() {
    this.handleOpen();
  }

  public handleClasses(element: Element, idx: number) {
    const details = element.getElementsByClassName(
      "FAQSection_accordionDetails"
    );
    const summary = element.getElementsByClassName(
      "FAQSection_accordionSummary"
    );

    if (this.isFirstArray[idx]) {
      element.classList.add("FAQSection_accordion__while");
      details[0].classList.add("FAQSection_accordion__slideUp");
      summary[0].classList.add("FAQSection_accordionSummary__open");

      this.isFirstArray[idx] = false;
      return;
    }

    element.classList.toggle("FAQSection_accordion__while");
    element.classList.toggle("FAQSection_accordion__dark");

    details[0].classList.toggle("FAQSection_accordion__slideUp");
    details[0].classList.toggle("FAQSection_accordion__slideDown");
    summary[0].classList.toggle("FAQSection_accordionSummary__open");
  }

  private addEventListener(accordion: Accordion, idx: number) {
    this.isFirstArray[idx] = true;
    const acc = this.accordions[idx];
    const itemsAcc = this.accordions;
    acc.addEventListener("click", function (this: Element) {
      let i = 0;
      for (i = 0; i < itemsAcc.length; i++) {
        if (i === idx) continue;
        if (itemsAcc[i].classList.contains("FAQSection_accordion__while")) {
          itemsAcc[i].classList.toggle("FAQSection_accordion__while");
          itemsAcc[i].classList.toggle("FAQSection_accordion__dark");

          const details = itemsAcc[i].querySelector<HTMLElement>(
            ".FAQSection_accordionDetails"
          );
          const summary = itemsAcc[i].querySelector<HTMLElement>(
            ".FAQSection_accordionSummary"
          );

          if (!details) return;

          details.classList.toggle("FAQSection_accordion__slideUp");
          details.classList.toggle("FAQSection_accordion__slideDown");
          summary?.classList.toggle("FAQSection_accordionSummary__open");
          if (details.style.maxHeight) {
            details.style.maxHeight = "";
          } else {
            details.style.maxHeight =
              String(Number(details.scrollHeight) + 37) + "px";
          }
        }
      }

      const panel = acc.querySelector<HTMLElement>(
        ".FAQSection_accordionDetails"
      );
      if (!panel) return;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = "";
      } else {
        panel.style.maxHeight = String(Number(panel.scrollHeight) + 37) + "px";
      }
      accordion.handleClasses(this, idx);
    });
  }

  private handleOpen() {
    let i = 0;
    for (i = 0; i < this.accordions.length; i++) {
      this.addEventListener(this, i);
    }
  }
}
