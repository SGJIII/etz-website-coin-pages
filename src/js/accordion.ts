export default class Accordion {
  private accordions: HTMLCollectionOf<Element>;

  constructor() {
    this.accordions = document.getElementsByClassName("FAQSection_accordion");
  }

  /**
   * init
   */
  public init() {
    this.handleOpen();
  }

  private handleOpen() {
    let i = 0;

    for (i = 0; i < this.accordions.length; i++) {
      // eslint-disable-next-line no-unused-vars
      this.accordions[i].addEventListener("click", function (this: Element) {
        this.classList.toggle("FAQSection_accordion__while");
        const details = this.getElementsByClassName(
          "FAQSection_accordionDetails"
        );
        details[0].classList.toggle("FAQSection_accordion__slideUp");
        details[0].classList.toggle("FAQSection_accordion__slideDown");
        const summary = this.getElementsByClassName(
          "FAQSection_accordionSummary"
        );
        summary[0].classList.toggle("FAQSection_accordionSummary__open");
      });
    }
  }
}
