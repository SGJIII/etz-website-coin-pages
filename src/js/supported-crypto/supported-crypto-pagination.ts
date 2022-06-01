import { createElement } from "../utils/createElement";
import SupportedCrypto from "./supported-crypto";

type SupportedCryptoPaginationProps = {
  nameContainer: string;
  namePagination: string;
};
class SupportedCryptoPagination extends SupportedCrypto {
  paginationElement: Element | null = null;
  prevPage: number | null = 1;
  nextPage: number | null = 1;
  currentPage = 1;
  buttonsPagination: NodeListOf<HTMLButtonElement> | undefined[] = [];
  namePagination: string | null = null;
  isClickPagination = false;

  constructor(props: SupportedCryptoPaginationProps) {
    super(props.nameContainer);
    this.namePagination = props.namePagination;
    this.paginationElement = document.querySelector(
      "[data-name=SupportedCryptoPagination]"
    );
  }

  init(): typeof this {
    super.init();

    return this;
  }

  render(): void {
    super.render();
    this.createPagination();
  }

  rerender(): void {
    super.rerender();
    if (this.isClickPagination) {
      this.isClickPagination = false;
      return;
    }
    this.createPagination();
  }

  createPagination() {
    if (this.paginationElement === null) return;
    const pages = Math.ceil(this.renderData.length / this.limit);

    if (this.prevPage === this.nextPage)
      this.removeAllChild(this.paginationElement);

    Array.from({ length: pages }, (_, idx) => {
      const button = createElement("button");
      button.className = "SupportedCryptoSection_button";
      if (idx === 0)
        button.classList.add("SupportedCryptoSection_button__active");
      const textNode = document.createTextNode(String(idx + 1));
      button.appendChild(textNode);
      button.addEventListener("click", () => {
        this.buttonsPagination.forEach((button) => {
          if (button === undefined) return;
          button.classList.remove("SupportedCryptoSection_button__active");
        });
        button.classList.add("SupportedCryptoSection_button__active");
        this.isClickPagination = true;
        this.changePage(idx + 1);
      });

      this.paginationElement?.appendChild(button);
    });

    this.buttonsPagination = this.paginationElement.querySelectorAll("button");
  }

  changePage(number: number) {
    if (number === this.currentPage) return;

    this.offset = (number - 1) * this.limit;

    this.currentPage = number;
    this.rerender();
  }
}

export default SupportedCryptoPagination;
