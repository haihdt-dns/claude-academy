export default class FormSpamPrevention {
  private enableClick: boolean = true;
  constructor() {
    this.initializeFormHandlers();
  }

  private initializeFormHandlers = (): void => {
    const btnSend = document.getElementById('btn-send');

    btnSend?.addEventListener('click', () => {
      if (!this.enableClick) return;
      this.enableClick = false;
      btnSend.classList.add('disabled')
    })
  }
}

