export default class Loading {
  private target: HTMLElement | null;

  constructor() {
    this.target = document.getElementById('loading');
    this.init();
  }

  private init = () => {
    document.addEventListener('readystatechange', (e) => {
      const eTarget = e.target as Document;
      if (eTarget.readyState === 'complete') {
        this.target?.classList.add('loaded');
      }
    });
  };
}
