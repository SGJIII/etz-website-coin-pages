import { createElement } from "../utils/createElement";
import cryptos from "./mock";
import { CryptoData } from "./supported-crypto.types";

class SupportedCrypto {
  queryName: string | null = null;
  container: Element | null = null;
  cryptos: CryptoData[] = [];
  renderData: CryptoData[] = [];
  limit = 10;
  offset = 0;

  constructor(name: string) {
    this.queryName = name;
    this.cryptos = cryptos;
    this.renderData = cryptos;
  }

  init(): typeof this {
    this.initialContainer();
    return this;
  }

  render() {
    this.renderCoins();
  }

  rerender() {
    if (this.container === null) return;
    this.renderCoins();
  }

  renderCoins() {
    if (this.container === null) return;
    this.removeAllChild(this.container);

    const cryptoRenderFor = [...this.renderData].splice(
      this.offset,
      this.limit
    );

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

  initialContainer() {
    if (this.queryName === null) return;

    const container = document.querySelector(this.queryName);
    this.container = container;
  }

  removeAllChild(parantElement: Element | null) {
    while (parantElement?.firstChild) {
      if (parantElement.lastChild === null) break;
      parantElement.removeChild(parantElement.lastChild);
    }
  }
}

export default SupportedCrypto;
