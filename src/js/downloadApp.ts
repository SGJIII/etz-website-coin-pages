import WorkspaceElement from "./utils/workspaceElement";

class DownloadApp extends WorkspaceElement<HTMLButtonElement> {
  popUp: null | HTMLDivElement = null;

  constructor() {
    super("[data-name=downloadApp]");
    this.element?.addEventListener("click", this.toggleShow.bind(this));
  }

  init() {
    this.createPopUp();
  }

  toggleShow() {
    this.popUp?.classList.toggle("PopUp_show");
  }

  createPopUp() {
    this.popUp = this.createElement("div");
    const overflow = this.createElement("div");
    const paper = this.createElement("div");

    overflow.addEventListener("click", this.toggleShow.bind(this));

    this.popUp.classList.add("PopUp");
    overflow.classList.add("PopUp__overflow");
    paper.classList.add("PopUp__paper");

    this.createModal(paper);

    this.popUp.appendChild(overflow);
    this.popUp.appendChild(paper);
    document.body.appendChild(this.popUp);
  }

  createModal(target: HTMLDivElement) {
    this.createHeaderModal(target);
    this.createBodyModal(target);
  }

  createHeaderModal(target: HTMLDivElement) {
    const header = this.createElement("div");

    header.classList.add("PopUp__headerModal");

    const icon = this.createElement("img");
    icon.src = "/exit.svg";
    icon.classList.add("PopUp__iconExit");

    icon.addEventListener("click", this.toggleShow.bind(this));

    header.appendChild(icon);

    target.appendChild(header);
  }

  createBodyModal(target: HTMLDivElement) {
    const body = this.createElement("div");

    body.classList.add("PopUp__bodyModal");

    this.createTitle(body);
    this.createQRCodeSection(body);

    target.appendChild(body);
  }

  createTitle(target: HTMLDivElement) {
    const title = this.createElement("span");

    title.classList.add("__heading-2");
    title.innerText = "Download Mobile App";

    target.appendChild(title);
  }

  createQRCodeSection(target: HTMLDivElement) {
    const qrCodeSection = this.createElement("div");

    qrCodeSection.classList.add("PopUp__qrCodeSection");

    /** Apple */
    const appleSection = this.createElement("div");
    appleSection.classList.add("PopUp__appleSection");

    const appleLink = this.createElement("a");
    appleLink.href = ""; // Need add

    const appleQR = this.createElement("img");
    appleQR.src = "/appleQR.svg";

    appleLink.appendChild(appleQR);
    appleSection.appendChild(appleLink);

    /** Android */
    const androidLink = this.createElement("a");
    androidLink.href = ""; // Need add

    const androidSection = this.createElement("div");
    androidSection.classList.add("PopUp__appleSection");

    const androidQR = this.createElement("img");
    androidQR.src = "/androidQR.svg";

    androidLink.appendChild(androidQR);
    androidSection.appendChild(androidLink);

    qrCodeSection.appendChild(appleSection);
    qrCodeSection.appendChild(androidSection);

    target.appendChild(qrCodeSection);
  }
}

const downloadApp = new DownloadApp();
downloadApp.init();
