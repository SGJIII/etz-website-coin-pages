import { getDataName } from "../utils/getDataName";
import { createElement } from "../utils/createElement";

class BenefitsSlider {
  elementContainder: HTMLDivElement | null = null;
  elementSlide: NodeListOf<HTMLDivElement> | null = null;
  elementDotsContainder: HTMLDivElement | null = null;
  elementDot: Array<HTMLElement> | null = [];
  widthSlides: number[] = [];
  positon = 0;

  constructor() {
    this.elementContainder = document.querySelector<HTMLDivElement>(
      getDataName("BenefitsSliderContainer")
    );
    this.elementSlide = document.querySelectorAll<HTMLDivElement>(
      getDataName("BenefitsSliderSlide")
    );
    this.elementDotsContainder = document.querySelector<HTMLDivElement>(
      getDataName("BenefitsSliderDots")
    );
  }

  public init() {
    this.createDots();
  }

  private calcPosition(idx: number) {
    let newPositon = 0;
    let i = 1;
    for (const width of this.widthSlides) {
      if (i > idx) break;
      newPositon += width;
      i++;
    }

    this.positon = newPositon;
  }

  private createDots() {
    this.elementSlide?.forEach((el, idx) => {
      this.widthSlides.push(el.getBoundingClientRect().width);
      const dot = createElement("span");
      dot.className =
        idx === 0
          ? "BenefitsSection_dot BenefitsSection_dot__active"
          : "BenefitsSection_dot";

      dot.setAttribute("data-name", "BenefitsSliderDot");
      dot.addEventListener("click", () => {
        this.calcPosition(idx);
        this.elementContainder?.setAttribute(
          "style",
          `--position: -${this.positon}px`
        );
        this.elementDot?.forEach((el) => {
          el.classList.remove("BenefitsSection_dot__active");
        });
        dot.classList.add("BenefitsSection_dot__active");
      });

      this.elementDotsContainder?.appendChild(dot);
      this.elementDot?.push(dot);
    });
  }
}

export default BenefitsSlider;
