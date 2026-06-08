const LS_KEY = 'claude-academy-lang';

export default class Lesson {
  private lessonBody: HTMLElement;
  private toggleBtns: HTMLButtonElement[];

  constructor() {
    this.toggleBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.lesson-toggle__btn'));
    const lessonBody = document.querySelector<HTMLElement>('.lesson-body');
    if (!this.toggleBtns.length || !lessonBody) return;
    this.lessonBody = lessonBody;

    const saved = localStorage.getItem(LS_KEY) ?? 'bilingual';
    this.applyLang(saved, this.toggleBtns, this.lessonBody);

    for (const btn of this.toggleBtns) {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang ?? 'bilingual';
        this.applyLang(lang, this.toggleBtns, this.lessonBody);
        localStorage.setItem(LS_KEY, lang);
      });
    }

    this.initSummaryModal();
    this.initExternalLinks();
  }

  private applyLang(lang: string, btns: HTMLButtonElement[], body: HTMLElement): void {
    btns.forEach(b => b.classList.remove('is-active'));
    const active = btns.find(b => b.dataset.lang === lang) ?? btns[0];
    active.classList.add('is-active');
    if (lang === 'bilingual') {
      delete body.dataset.lang;
    } else {
      body.dataset.lang = lang;
    }
  }

  private initExternalLinks(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>('.lesson-content a, .lesson-summary-modal a');
    const origin = location.origin;
    for (const link of links) {
      if (link.href && !link.href.startsWith(origin) && !link.href.startsWith('#')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    }
  }

  private initSummaryModal(): void {
    const modal = document.querySelector<HTMLElement>('.lesson-summary-modal');
    const openBtn = document.querySelector<HTMLButtonElement>('.lesson-summary-btn');
    const closeBtn = modal?.querySelector<HTMLButtonElement>('.lesson-summary-modal__close');
    const overlay = modal?.querySelector<HTMLElement>('.lesson-summary-modal__overlay');
    const modalBox = modal?.querySelector<HTMLElement>('.lesson-summary-modal__box');
    const modalToggleBtns = Array.from(
      modal?.querySelectorAll<HTMLButtonElement>('.lesson-summary-modal__toggle-btn') ?? []
    );

    if (!modal || !openBtn || !modalBox) return;

    const applyModalLang = (lang: string): void => {
      modalToggleBtns.forEach(b => b.classList.remove('is-active'));
      const active = modalToggleBtns.find(b => b.dataset.lang === lang) ?? modalToggleBtns[0];
      active?.classList.add('is-active');
      if (lang === 'bilingual') {
        delete modalBox.dataset.lang;
      } else {
        modalBox.dataset.lang = lang;
      }
    };

    openBtn.addEventListener('click', () => {
      const currentLang = localStorage.getItem(LS_KEY) ?? 'bilingual';
      applyModalLang(currentLang);
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = (): void => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    for (const btn of modalToggleBtns) {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang ?? 'bilingual';
        applyModalLang(lang);
        localStorage.setItem(LS_KEY, lang);
        this.applyLang(lang, this.toggleBtns, this.lessonBody);
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Lesson();
});
