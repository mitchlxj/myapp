import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import {
  Storage
} from '@ionic/storage/dist/storage';
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
  ViewController
} from 'ionic-angular/navigation/view-controller';
import { HeadfacePage } from '../headface/headface';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage extends BaseUI {

  headFace: string = 'http://img.mukewang.com/user/57a322f00001e4ae02560256-40-40.jpg';

  errorMessage: any;

  nickName: string = '加载中...';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loading: LoadingController,
    public rest: RestProvider,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController
  ) {
    super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
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
              this.nickName = userinfo["UserNickName"];
              //给资源文件增加一个后缀，去除缓存
              this.headFace = userinfo["UserHeadface"] + "?" + (new Date()).valueOf();

              loading.dismiss();
            },
            error => this.errorMessage = < any > error);
      }
    })
  }

  updateNickName() {
    this.storage.get('UserId').then(val => {
      if (val != null) {
        const loading = super.showLoading(this.loading, "修改中...");
        this.rest.updateNickName(val, this.nickName)
          .subscribe(f => {
            if (f["Status"] == "OK") {
              loading.dismiss();
              super.showToast(this.toastCtrl, "昵称修改成功");
              this.viewCtrl.dismiss();
            } else {
              loading.dismiss();
              super.showToast(this.toastCtrl, f["StatusContent"]);
            }
          }, error => this.errorMessage = < any > error)
      }
    })
  }


  loginOut() {

    this.storage.remove('UserId');
    this.viewCtrl.dismiss();

  }


  gotoHeadFace() {
    this.navCtrl.push(HeadfacePage);
  }

}
