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
  BaseUI
} from '../../common/baseui';
import {
  LoadingController
} from 'ionic-angular/components/loading/loading-controller';
import {
  RestProvider
} from '../../providers/rest/rest';
import {
  ToastController
} from 'ionic-angular/components/toast/toast-controller';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage extends BaseUI {


  mobile: any;
  nickName: string;
  password: string;
  confirmPassword: string;

  errorMessage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController,
    public loadingCtrl: LoadingController,
    public rest: RestProvider,
    public toastCtrl: ToastController
  ) {
    super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }


  dismiss() {
    this.viewController.dismiss();
  }


  gotoLogin() {
    this.navCtrl.pop(); //通过nav导航到的页面使用POP返回上一级
  }

  doRegister() {
    //前台验证表单数据的正确性，包括手机号码
    if (!(/^1[34578]\d{9}$/.test(this.mobile))) {
      super.showToast(this.toastCtrl, "您的手机号码不正确");
    } else if (this.nickName.length < 3 || this.nickName.length > 10) {
      super.showToast(this.toastCtrl, "昵称长度为3~10位之间");
    } else if (this.password.length < 6 || this.password.length > 20 || this.confirmPassword.length < 6 || this.confirmPassword.length > 20) {
      super.showToast(this.toastCtrl, "密码长度为6~20位之间");
    } else if (this.password !== this.confirmPassword) {
      super.showToast(this.toastCtrl, "两次输入的密码不匹配");
    } else {
      console.log(this.password);
      console.log(this.confirmPassword)
      const loading = super.showLoading(this.loadingCtrl, "注册中...");

      this.rest.register(this.mobile, this.nickName, this.password)
        .subscribe(f => {
          if (f["Status"] == "OK") {
            loading.dismiss();
            this.dismiss();
            super.showToast(this.toastCtrl, "注册成功");
          } else {
            loading.dismiss();
            super.showToast(this.toastCtrl, f['StatusContent']);
          }
        }, error => this.errorMessage = < any > error);
    }
  }
}
