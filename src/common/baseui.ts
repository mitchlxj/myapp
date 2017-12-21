import {
  Loading
} from "ionic-angular/components/loading/loading";
import {
  LoadingController
} from "ionic-angular/components/loading/loading-controller";
import {
  ToastController
} from "ionic-angular/components/toast/toast-controller";
import {
  Toast
} from "ionic-angular/components/toast/toast";


/**
 * UI 层的所有公用方法的抽象类
 * 
 * @export
 * @abstract
 * @class BaseUI
 */
export abstract class BaseUI {
  constructor() {}


  /**
   * 通用的展示loading组件
   * 
   * @protected
   * @param {LoadingController} loadingCtrl 
   * @param {string} message 
   * @returns {Loading} 
   * @memberof BaseUI
   */
  protected showLoading(loadingCtrl: LoadingController, message: string): Loading {

    const loader = loadingCtrl.create({
    
      content: message,
      dismissOnPageChange: false //页面变化的时候自动关闭loading
    });
    loader.present();
    return loader;
  }



  /**
   * 通用的展示Toast组件
   * 
   * @protected
   * @param {ToastController} toastCtrl 
   * @param {string} message 
   * @returns {Toast} 
   * @memberof BaseUI
   */
  protected showToast(toastCtrl: ToastController, message: string): Toast {
    const toast = toastCtrl.create({
      message: message,
      duration: 2000,
      //showCloseButton: true,
      //closeButtonText: 'Ok',
      position: 'bottom'
    });

    toast.present();

    return toast;
  }

}
