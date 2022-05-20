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
    // eslint-disable-next-line no-unused-vars
    this.accordions[idx].addEventListener("click", function (this: Element) {
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
