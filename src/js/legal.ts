import { API } from "./api";
import WorkspaceElement from "./utils/workspaceElement";

type Documents = {
  id: number;
  link: string;
  name: string;
};
type Group = {
  description: string;
  documents: Documents[];
  id: number;
  name: string;
};
type ApiDocuments = {
  description: string;
  groups: Group[];
};
class Legal extends WorkspaceElement<HTMLElement> {
  mainSection: null | HTMLElement = null;
  subSections: (never | HTMLElement)[] = [];
  icon: null | HTMLImageElement = null;

  constructor() {
    super("[data-name=root]");
  }

  createIcon() {
    const img = this.createElement("img");
    img.src = "/union.svg";
    img.classList.add("Legal__icon");
    return img;
  }

  async init() {
    this.bodyOverflowDisable();
    this.createMainSection();
    const responce = await this.fetchData();
    this.createTitle(responce.data.description);
    this.createSubSection(responce.data.groups);
  }

  bodyOverflowDisable() {
    document.body.style.overflow = "";
  }

  createMainSection() {
    this.mainSection = this.createElement("section");

    this.element?.appendChild(this.mainSection);
  }

  createTitle(text: string) {
    const title = this.createElement("h1");

    title.classList.add("__heading-1");
    title.innerText = text;

    this.mainSection?.appendChild(title);
  }

  createSubSection(groups: Group[]) {
    groups.forEach((group) => {
      const subSection = this.createElement("section");

      const subTitle = this.createElement("h2");
      subTitle.classList.add("__subtitle-1");
      subTitle.classList.add("Legal__subTitle");
      subTitle.innerText = group.name;

      subSection.appendChild(subTitle);

      subSection.classList.add("Legal__section");

      this.createLinks(subSection, group.documents);
      this.mainSection?.appendChild(subSection);
    });
  }

  createLinks(target: HTMLElement, links: Documents[]) {
    links.forEach((link) => {
      const linkElement = this.createElement("a");

      linkElement.classList.add("__paragraph-1");
      linkElement.classList.add("Legal__link");
      linkElement.href = link.link;
      linkElement.innerText = link.name;

      linkElement.setAttribute("target", "_blank");

      linkElement.appendChild(this.createIcon());

      target.appendChild(linkElement);
    });
  }

  async fetchData() {
    return await API.get<ApiDocuments>("/documents");
  }
}
const legal = new Legal();
legal.init();
