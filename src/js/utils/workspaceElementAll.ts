import Workspace from "./workspace";

class WorkspaceElementAll<T extends HTMLElement> extends Workspace {
  elements: NodeListOf<T> | null = null;

  constructor(name: string) {
    super();
    this.elements = this.querySelectorAll(name);
  }
}

export default WorkspaceElementAll;
