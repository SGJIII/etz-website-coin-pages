import { createElement } from "../utils/createElement";
import cryptos from "./mock";

class SupportedCrypto {
  queryName: string | null = null;
  container: Element | null = null;
  limit = 10;
  offset = 0;
  page = 1;
  cryptos: { name: string; tag: string; url: string }[] = [];
  buttons: NodeListOf<HTMLButtonElement> | undefined[] = [];

  constructor(name: string) {
    this.queryName = name;
    this.cryptos = cryptos;
  }

  init() {
    this.findContainer();
    this.render();
  }

  render() {
    this.renderCoins();
    this.createPagination();
  }

  rerender() {
    if (this.container === null) return;

    const childern = this.container.childNodes;
    const cryptoRenderFor = [...this.cryptos].splice(this.offset, this.limit);

    cryptoRenderFor.forEach((crypto, idx) => {
      const numberCoin = idx + 1 + this.offset;
      const coin = this.createCoin(crypto, numberCoin);
      this.container?.replaceChild(coin, childern[idx]);
    });
  }

  renderCoins() {
    if (this.container === null) return;

    const cryptoRenderFor = [...this.cryptos].splice(this.offset, this.limit);

    cryptoRenderFor.forEach((crypto, idx) => {
      const numberCoin = idx + 1 + this.offset;
      const coin = this.createCoin(crypto, numberCoin);
      this.container?.appendChild(coin);
    });
  }

  createCoin(
    { name, tag, url }: { name: string; tag: string; url: string },
    idx: number
  ) {
    const coin = createElement("div");
    coin.className = "SupportedCryptoSection_item __paragraph-1";

    const numberCoin = createElement("span");
    numberCoin.className = "SupportedCryptoSection_numberCoin";
    const numberTextNode = document.createTextNode(String(idx));
    numberCoin.appendChild(numberTextNode);

    const imgCoin = createElement("img");
    imgCoin.className = "SupportedCryptoSection_imgCoin";
    imgCoin.setAttribute("src", url);

    const nameCoin = createElement("span");
    nameCoin.className = "SupportedCryptoSection_nameCoin";
    const nameTextNode = document.createTextNode(name);
    nameCoin.appendChild(nameTextNode);

    const tagCoin = createElement("span");
    tagCoin.className = "SupportedCryptoSection_tagCoin";
    const tagTextNode = document.createTextNode(tag);
    tagCoin.appendChild(tagTextNode);

    coin.appendChild(numberCoin);
    coin.appendChild(imgCoin);
    coin.appendChild(nameCoin);
    coin.appendChild(tagCoin);

    return coin;
  }

  createPagination() {
    const pagination = document.querySelector(
      "[data-name=SupportedCryptoPagination]"
    );
    if (pagination === null) return;

    const pages = Math.round(this.cryptos.length / this.limit);
    Array.from({ length: pages }, (_, idx) => {
      const button = createElement("button");
      button.className = "SupportedCryptoSection_button";
      if (idx === 0)
        button.classList.add("SupportedCryptoSection_button__active");
      const textNode = document.createTextNode(String(idx + 1));
      button.appendChild(textNode);

      button.addEventListener("click", () => {
        this.buttons.forEach((button) => {
          if (button === undefined) return;
          button.classList.remove("SupportedCryptoSection_button__active");
        });
        button.classList.add("SupportedCryptoSection_button__active");
        this.changePage(idx + 1);
      });

      pagination.appendChild(button);
    });

    this.buttons = pagination.querySelectorAll("button");
  }

  changePage(number: number) {
    if (number === this.page) return;

    this.offset =
      number > this.page ? this.offset + this.limit : this.offset - this.limit;

    this.rerender();

    this.page = number;
  }

  findContainer() {
    if (this.queryName === null) return;

    const container = document.querySelector(this.queryName);
    this.container = container;
  }
}

export default SupportedCrypto;
