class DocumentElement<T extends Element> {
  elementMain: T | null = null;
  constructor(name: string) {
    this.elementMain = document.querySelector<T>(name);
  }
}
export default DocumentElement;
