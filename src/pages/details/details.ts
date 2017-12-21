import { LoginPage } from './../login/login';
import {
  AnswerPage
} from './../answer/answer';
import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
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
import {
  Storage
} from '@ionic/storage';
import {
  ModalController
} from 'ionic-angular/components/modal/modal-controller';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage extends BaseUI {

  id: string;
  question: string[];
  answers: string[];
  errorMessage: any;
  IsFavourite: boolean;
  userId: string;
  isMyQuestion: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadCtrl: LoadingController,
    public rest: RestProvider,
    public toastCtrl: ToastController,
    public storage: Storage,
    public modalCtrl: ModalController,
  ) {
    super();
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');

    this.loadQuestion(this.id);
  }

  loadQuestion(id) {
    this.storage.get('UserId').then(val => {
      if (val !== null) {
        this.userId = val;
        const loading = super.showLoading(this.loadCtrl, "加载中...");
    
        this.rest.getQuestionWithUser(this.id, val)
          .subscribe(
            q => {
              this.question = q;
              this.answers = q["Answers"];
              this.IsFavourite = q["IsFavourite"];
              this.isMyQuestion = (q["OwnUserId"] == val);
              loading.dismiss(); //屏蔽后不会报removeView was not found的错误了

            }, error => this.errorMessage = < any > error);
      }else{

        super.showToast(this.toastCtrl,"您还没有登录，无法查看回答！");
        this.navCtrl.parent.select(4);

      }
    })

  }


  saveFavourite() {
    const loading = super.showLoading(this.loadCtrl, "请求中...");

    this.rest.saveFavourite(this.id, this.userId)
      .subscribe(f => {
        if (f["Status"] == "OK") {
          loading.dismiss();
          super.showToast(this.toastCtrl, this.IsFavourite ? "取消关注成功" : "关注问题成功");
          this.IsFavourite = !this.IsFavourite;
        }
      }, error => this.errorMessage = error);


  }

  showAnswerPage() {
    const modal = this.modalCtrl.create(AnswerPage, {
      "id": this.id
    });


    modal.onDidDismiss(() => {
      this.loadQuestion(this.id);
    });
    modal.present();


  }

}
