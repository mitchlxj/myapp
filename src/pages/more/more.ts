import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  ModalController
} from 'ionic-angular/components/modal/modal-controller';
import {
  LoginPage
} from '../login/login';
import {
  Storage
} from '@ionic/storage';
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
  UserPage
} from '../user/user';
import {
  ToastController
} from 'ionic-angular/components/toast/toast-controller';

/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage extends BaseUI {

  headFace: string;

  userinfo: string[];

  notLogin: boolean = true;
  logined: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public storage: Storage,
    public loading: LoadingController,
    public rest: RestProvider,
    public toastCtrl: ToastController
  ) {
    super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }

  showModal() {
    const modal = this.modalCtrl.create(LoginPage);
    //关闭后的回调 因为modal关闭的时候，不会再次触发父页面的ionViewDidEnter
    modal.onDidDismiss(() => {
      this.loadUserPage();
    });

    modal.present();
  }

  ionViewDidEnter() {
    this.loadUserPage();
  }

  loadUserPage() {
    this.storage.get('UserId').then((val) => {
      if (val != null) {
        //加载用户数据
        const loading = super.showLoading(this.loading, "加载中...");
        this.rest.getUserInfo(val)
          .subscribe(userinfo => {
            this.userinfo = userinfo;
           //给资源文件增加一个后缀，去除缓存
           this.headFace = userinfo["UserHeadface"]+"?"+(new Date()).valueOf();
           this.notLogin= false;
           this.logined = true;
           loading.dismiss();
         });

      } else {
        this.notLogin = true;
        this.logined = false;
      }
    })
  }


  gotoUserPage() {
    this.navCtrl.push(UserPage);
  }

}
