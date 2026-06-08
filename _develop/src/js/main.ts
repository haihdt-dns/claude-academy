import AnchorLink from './common/anchor-link-custom';
import FormSpamPrevention from './common/form-spam-prevention';
import Header from './common/header';
import DeviceWatcher from './utils/logic/device-watcher';
import intersectElem from './utils/logic/intersect-elem';
import ScrollController from './utils/logic/scroll-controller';
// break-pointによるPC/SP判別機能。 詳細はdevice-watcher.tsを見てみよう。
new DeviceWatcher();
// モーダル等で下のウインドウが動かないようにする。scroll-controller.ts参照
new ScrollController();

export default class Main {
  constructor() {
    /*
      // よく使うので入れておきます。演出等で必ず一番上から始めたい時はこちら(Chrome等の位置記憶を破棄)
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0,0);
      };
    */


    new intersectElem();
    new Header();
    new AnchorLink('#header');
    new FormSpamPrevention()
  }
}
window.addEventListener('DOMContentLoaded', () => {
  new Main();
});
