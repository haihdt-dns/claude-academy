import { selector, debounce } from '../utils/helper/function-helper';
/**
 * PageTop class for handling page scroll-to-top functionality
 * with performance optimizations
 * 
 * @export
 * @class PageTop
 *
 * usage: new PageTop() or new PageTop(topLimit, bottomLimit) or new PageTop(topLimit) new PageTop(null, bottomLimit)
 */
export default class PageTop {
  private readonly btn: HTMLElement | null;
  private readonly topLimit: HTMLElement | null;
  private readonly bottomLimit: HTMLElement | null;
  private offset: number;
  private lastScrollY: number = 0;
  private ticking: boolean = false;
  private resizeObserver: ResizeObserver | null = null;
  private readonly scrollHandler: () => void;
  private readonly resizeHandler: () => void;

  constructor(topLimit: string | null = null, bottomLimit: string | null = null) {
    this.btn = selector('.footer__pageTop');
    this.topLimit = typeof topLimit === 'string' ? selector(topLimit) : topLimit;
    this.bottomLimit = typeof bottomLimit === 'string' ? selector(bottomLimit) : null;
    this.offset = 0;

    // Pre-bind handlers to avoid creating new functions on each call
    this.scrollHandler = debounce(this.onScrollThrottled.bind(this), 16); // ~60fps
    this.resizeHandler = debounce(this.onResize.bind(this), 100);

    this.init();
  }

  private init(): void {
    this.offset = this.getTopOffset() || window.innerHeight;
    this.setupEventListeners();
    this.setupResizeObserver();
  }

  private setupEventListeners(): void {
    window.addEventListener('load', this.onScroll.bind(this), { passive: true });
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private setupResizeObserver(): void {
    if ('ResizeObserver' in window && this.btn) {
      this.resizeObserver = new ResizeObserver(this.resizeHandler);
      this.resizeObserver.observe(this.btn);
    }
  }

  private onScrollThrottled(): void {
    this.lastScrollY = window.scrollY;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.onScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private onResize(): void {
    if (window.innerWidth < 769 && this.btn) {
      this.btn.removeAttribute('style');
    }
    this.offset = this.getTopOffset() || window.innerHeight;
    this.onScroll();
  }

  private onScroll(): void {
    const windowOffset = this.lastScrollY + window.innerHeight;
    this.setPositionBottom(windowOffset);

    if (!this.btn) return;

    if (windowOffset - this.offset > 0) {
      requestAnimationFrame(() => {
        this.btn?.classList.add('show');
        this.btn?.classList.remove('hide');
      });
    } else if (this.btn.classList.contains('show')) {
      requestAnimationFrame(() => {
        this.btn?.classList.remove('show');
        this.btn?.classList.add('hide');
      });
    }
  }

  private getTopOffset(): number | null {
    if (!this.topLimit) return null;

    const btnHeight = this.btn?.clientHeight || 0;
    const tempOffset = this.topLimit.offsetTop + this.topLimit.clientHeight;
    return tempOffset < window.innerHeight ? null : tempOffset + btnHeight;
  }

  private setPositionBottom(windowOffset: number): void {
    if (window.innerWidth < 769 && !this.bottomLimit || !this.btn) return;

    const btnHeight = this.btn.clientHeight / 2;
    const bottomOffset = (this.bottomLimit?.offsetTop || 0) + (this.bottomLimit?.clientHeight || 0);

    requestAnimationFrame(() => {
      if (this.btn) {
        this.btn.style.bottom = windowOffset - bottomOffset > btnHeight / 3
          ? `${windowOffset - bottomOffset + btnHeight}px`
          : '35px';
      }
    });
  }
}
