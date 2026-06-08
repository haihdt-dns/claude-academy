/**
 *
 *
 * usage
 *  - apply all: new  MatchHeight('.js-matchHeight', false)
 *  - apply by Row: new  MatchHeight('.js-matchHeight')
 */

interface ArrayMatch {
  elm: number[];
  offset: number;
}
export default class MatchHeight {
  private items: HTMLElement[] = [];
  private byRow: boolean;
  constructor(el: string, byRow: boolean = true) {
    this.items = Array.prototype.slice.call(document.querySelectorAll(el));
    this.byRow = byRow;
    this.init();
  }

  private init = () => {
    if (!this.items || this.items.length === 0) return;

    window.addEventListener('load', this.processHeight, false);
    window.addEventListener('resize', this.processHeight, false);
  };

  private processHeight = (): void => {
    let elmG: ArrayMatch[] = [];
    if (this.items.length > 1) {
      if (this.byRow) {
        this.setHeightTemp();
        elmG = this.createGroup();
        this.resetHeight();
        elmG.forEach((arr: ArrayMatch) => {
          this.setHeightByRow(arr.elm);
        });
      } else {
        let maxHeight = this.items[0].offsetHeight;
        this.resetHeight();
        this.items.forEach((item) => {
          if (maxHeight < item.offsetHeight) {
            maxHeight = item.offsetHeight;
          }
        });

        this.items.forEach((item) => {
          item.style.height = `${maxHeight}px`;
        });
      }
    }
  };

  private createGroup = () => {
    let array: ArrayMatch[] = [];
    this.items.forEach((item: HTMLElement, i) => {
      const rect: DOMRect  = item.getBoundingClientRect();
      const style = window.getComputedStyle(item);
      const offsetTemp = rect.top - this.parse(style.marginTop);
      array = this.setByRow(i, offsetTemp, array);
    });
    return array;
  };

  private setByRow = (index: number, offset: number, arr: ArrayMatch[]) => {
    if (arr.length === 0) {
      arr.push({
        elm: [index],
        offset
      });
    } else {
      const objTemp = arr.filter((item) => item.offset === offset)[0];
      const arrTemp = arr.filter((item) => item.offset !== offset);
      if (arrTemp.length === arr.length) {
        arr.push({
          elm: [index],
          offset
        });
      } else {
        objTemp.elm.push(index);
        arr = [...arrTemp, objTemp];
      }
    }
    return arr;
  };

  private setHeightByRow = (arr: number[]) => {
    let maxHeight = this.items[arr[0]].clientHeight;
    if (arr.length > 1) {
      // Get max height
      arr.forEach((el) => {
        maxHeight = Math.max(this.items[el].clientHeight, maxHeight);
      });

      // Set max height
      arr.forEach((el) => {
        this.items[el].style.height = `${maxHeight}px`;
      });
    }
  };

  private parse = (value: string) => {
    return parseFloat(value) || 0;
  };

  // Reset height
  private resetHeight = () => {
    this.items.forEach((item: HTMLElement) => {
      item.style.height = '';
    });
  };

  private setHeightTemp = () => {
    if (this.items) {
      this.items.forEach((item) => {
        item.style.height = '20px';
      });
    }
  };
}
