import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/all';
gsap.registerPlugin(ScrollToPlugin);

/**
 * アンカーリンクスムーズスクロール
 * @export
 * @class AnchorLink
 * @param offset: fixのヘッダー等の場合合わせるピクセル、または高さを考慮する対象。
 * 例） new AnchorLink(), new AnchorLink(100), new AnchorLink('#header');
 * @param speed: スクロール速度 (ms)
 */
export default class AnchorLink {
  private currentX: number = 0;
  private currentY: number = 0;
  private offsetY: number = 0;
  private speed: number = 0;
  private offsetTarget: HTMLElement | null = null;

  constructor(offset?: number | string, speed: number = 0.6) {
    this.speed = speed;

    if (typeof offset === 'number') {
      this.offsetY = offset;
    }
    if (typeof offset === 'string') {
      this.offsetTarget = document.querySelector(offset);
    }

    window.addEventListener('load', this.init, false);
  }

  private init = () => {
    if (window.location.hash) {
      const hashTarget: HTMLElement | null = document.querySelector(window.location.hash);
      if (hashTarget) {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
        this.go2DefaultTarget(hashTarget);
      }
    }

    const anchorLink: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll('a[href*="#"]:not(.not-anchor)'));

    for (const elem of anchorLink) {
      const href: string | null = elem.getAttribute('href');
      const hash: string | null = `#${href?.split('#')[1]}`;
      if (hash && hash.length > 1) {
        elem.addEventListener('click', this.go2Anchor, false);
      }
    }
  };

  private go2DefaultTarget = (target: HTMLElement): void => {
    let offset: number = this.offsetY;
    if (this.offsetTarget) {
      offset = this.offsetTarget.offsetHeight;
    }
    try {
      gsap.killTweensOf(window);
      gsap.set(window, { scrollTo: { x: target, y: target, offsetY: offset } });
    } catch (event) {
      const targetPositionX = target.offsetLeft;
      const targetPositionY = target.offsetTop - offset;
      window.scrollTo(targetPositionX, targetPositionY);
    }
  };

  private go2Anchor = (e: any): void => {
    let offset: number = this.offsetY;
    if (this.offsetTarget) {
      offset = this.offsetTarget.offsetHeight;
    }
    const href: string | null = e.currentTarget.getAttribute('href');
    const hash = `#${href?.split('#')[1]}`;
    const scrollTarget: HTMLElement | null = document.querySelector(hash);
    if (!scrollTarget) return;

    try {
      gsap.killTweensOf(window);
      gsap.to(window, {
        duration: this.speed,
        scrollTo: { x: scrollTarget, y: scrollTarget, autoKill: false, offsetY: offset },
        ease: 'power1.inOut',
      });
    } catch (event) {
      this.currentX = window.scrollX || window.pageXOffset;
      this.currentY = window.scrollY || window.pageYOffset;

      const targetPositionX = scrollTarget.offsetLeft;
      const targetPositionY = scrollTarget.offsetTop - offset;

      gsap.killTweensOf(this);
      gsap.to(this, {
        duration: this.speed,
        currentX: targetPositionX,
        currentY: targetPositionY,
        ease: 'power1.inOut',
        onUpdate: () => {
          window.scrollTo(this.currentX, this.currentY);
        }
      });
    }
    e.preventDefault();
  };
}
