import Util from "../utils/util";

export default class DOMContentChanged {
  private root: HTMLElement | null = null;
  constructor() {
    this.root = document.getElementById('root')
    if (!this.root) return;
    const config = { childList: true, subtree: true };
    const observerRoot = new MutationObserver((mutationsList) => {

      if (!this.root) return;
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          Util.Dispatcher.dispatchEvent('DOMContentChanged')
        }
      }
    });
    observerRoot.observe(this.root, config);
  }
}