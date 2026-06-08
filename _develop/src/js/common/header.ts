import { selector, selectorAll, debounce } from '../utils/helper/function-helper';
import Util from '../utils/util';

export default class Header {
  private readonly target: HTMLElement | null;
  private readonly header: HTMLElement | null;
  private readonly menuHolder: HTMLElement | null;
  private winWidth: number;
  private winHeight: number;
  private isOpen: boolean;
  private readonly isSticky: boolean = true;

  constructor() {
    this.target = document.getElementById('js-hamburger');
    this.header = document.getElementById('header');
    this.menuHolder = document.getElementById('js-menu');
    this.isOpen = false;
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.init();
  }

  private init(): void {
    if (!this.target) return;

    this.setActiveMenu();
    const debouncedResize = debounce(this.handleResize, 100);
    this.target.addEventListener('click', this.handleToggle);
    window.addEventListener('load', this.handleSticky);
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('scroll', this.handleSticky);
    this.setCloseMenuWhenAnchor();
  }

  private handleResize = (): void => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (this.winWidth !== newWidth) {
      this.winWidth = newWidth;
      this.handleSticky();
      this.changeMenuDevice();
    }
    if (this.winHeight !== newHeight) {
      this.setHeightResize();
      this.winHeight = newHeight;
    }
  };

  private handleToggle = (): void => {
    this.header?.classList.remove('is-show-sub');
    if (window.innerWidth > 768) return;
    this.setHeightMenu();
    this.isOpen = !this.isOpen;
    this.isOpen ? this.openMenu() : this.closeMenu();
  };

  private handleSticky = (): void => {
    if (!this.header || !this.isSticky) return;

    const shouldBeFixed = window.scrollY > 0;
    const isLocked = document.body.classList.contains('is-lock');

    if (shouldBeFixed) {
      this.header.classList.add('is-fixed');
    } else if (!isLocked) {
      this.header.classList.remove('is-fixed');
    }
  };

  private setHeightMenu(): void {
    if (!this.menuHolder) return;

    const timing = 0.22;
    const transitionDuration = timing * window.innerHeight;

    if (this.isOpen) {
      this.menuHolder.style.transition = `height ${transitionDuration}ms linear`;
      this.menuHolder.style.height = '';
      this.menuHolder.style.overflow = '';
      this.cleanupTransition(transitionDuration);
    } else {
      Util.Dispatcher.dispatchEvent('SCROLL_LOCK');
      setTimeout(() => {
        this.menuHolder!.style.transition = `height ${transitionDuration}ms linear`;
        this.menuHolder!.style.height = `${window.innerHeight}px`;
        this.menuHolder!.style.overflow = 'auto';
        this.cleanupTransition(transitionDuration);
      }, 100);
    }
  }

  private cleanupTransition(timing: number): void {
    setTimeout(() => {
      if (!this.menuHolder) return;

      this.menuHolder.style.transition = '';
      if (!this.isOpen) {
        this.menuHolder.scrollTop = 0;
      }
    }, timing);
  }

  private changeMenuDevice(): void {
    if (window.innerWidth > 768) {
      this.removeStyle();
      Util.Dispatcher.dispatchEvent('SCROLL_RELEASE');
    } else {
      this.setHeightResize();
    }
  }

  private removeStyle(): void {
    if (!this.menuHolder) return;

    this.menuHolder.style.height = '';
    this.menuHolder.style.overflow = '';
    this.menuHolder.style.visibility = '';
    this.menuHolder.scrollTop = 0;
  }

  private setHeightResize(): void {
    if (!this.menuHolder || this.winWidth > 768) return;

    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
      this.menuHolder.style.height = `${window.innerHeight}px`;
      this.menuHolder.style.visibility = 'visible';
      this.menuHolder.style.overflow = 'auto';
      Util.Dispatcher.dispatchEvent('SCROLL_LOCK');
    }
  }

  private openMenu(): void {
    if (!this.target || !this.header) return;

    this.isOpen = true;
    this.target.classList.add('is-active');
    this.header.classList.add('is-active');
  }

  private closeMenu(): void {
    if (!this.target || !this.header) return;

    const nav = selector('.header__nav');
    this.isOpen = false;
    this.target.classList.remove('is-active');
    this.header.classList.remove('is-active');
    Util.Dispatcher.dispatchEvent('SCROLL_RELEASE');
    if (nav) {
      nav.scrollTo(0, 0);
    }
  }

  private setActiveMenu(): void {
    const menus = selectorAll('.header__menu .nav__menu a');
    const currentUrl = location.pathname.replace(/(index\.html|index\.htm|index\.php)$/g, '');

    menus.forEach(menu => {

      const href = menu.getAttribute('href')?.replace(/[^/]+(\.html|\.htm|\.php)$/, '');
      if (currentUrl === '/' && currentUrl === href) {
        menu.parentElement?.classList.add('active')
      }
      else if (href && href !== '/' && currentUrl.includes(href)) {
        menu.parentElement?.classList.add('active')
      }
      else {
        menu.parentElement?.classList.remove('active')
      }
    });
  }

  private setCloseMenuWhenAnchor(): void {
    if (!this.menuHolder) return;
    const menus = Array.prototype.slice.call(this.menuHolder.querySelectorAll('.header__nav ul li a'));

    menus.forEach(menu => {
      const menuUrlWithoutHash = menu.href.split('#')[0];
      const locationWithoutHash = location.href.split('#')[0];
      if (menuUrlWithoutHash !== locationWithoutHash) return;
      if (menu.href.includes('#')) {
        menu.addEventListener('click', () => {
          this.handleToggle();
          Util.Dispatcher.dispatchEvent('SCROLL_RELEASE');
        });
      }
    });
  }
}


