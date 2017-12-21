import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import {
  ViewController
} from 'ionic-angular/navigation/view-controller';
import {
  LoadingController
} from 'ionic-angular/components/loading/loading-controller';
import {
  BaseUI
} from '../../common/baseui';
import {
  RestProvider
} from '../../providers/rest/rest';
import {
  ToastController
} from 'ionic-angular/components/toast/toast-controller';
import {
  Storage
} from '@ionic/storage';
import {
  RegisterPage
} from '../register/register';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BaseUI {

  mobile: string;
  password: string;
  errorMessage: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController,
    public loadingCtrl: LoadingController,
    public restProvider: RestProvider,
    public toastCtrl: ToastController,
    public storage: Storage
  ) {
    super(); //因继承了BASEUI 需要调用父类的构造函数
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    const loding = super.showLoading(this.loadingCtrl, "登录中...");
    this.restProvider.login(this.mobile, this.password)
      .subscribe(res => {
          if (res['Status'] == "OK") {
            //处理登录成功的页面跳转 
            //这里最好存储token
            this.storage.set('UserId', res["UserId"]);
            loding.dismiss();
            this.dismiss();
          } else {
            loding.dismiss();
            super.showToast(this.toastCtrl, res["StatusContent"]);
          }
        },
        error => this.errorMessage = < any > error
      );

  }


  pushRegister() {
    this.navCtrl.push(RegisterPage);
  }

  /**
   * 关闭当前页面的方法
   * 
   * @memberof LoginPage
   */
  dismiss() {
    this.viewController.dismiss();
  }

}
