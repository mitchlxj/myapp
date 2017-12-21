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
  Storage
} from '@ionic/storage';
import {
  BaseUI
} from '../../common/baseui';
import {
  Loading
} from 'ionic-angular/components/loading/loading';
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
 * Generated class for the QuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})
export class QuestionPage extends BaseUI {


  title: string;
  content: string;
  errorMessage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public rest: RestProvider,
    public toastCtrl: ToastController
  ) {
    super();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();

  }

  submitQuestion() {
    this.storage.get('UserId').then((val) => {
      if (val != null) {
        const loading = super.showLoading(this.loadingCtrl, "发表中...");
        this.rest.saveQuestion(val, this.title, this.content)
          .subscribe(f => {
            if (f["Status"] === "OK") {
              loading.dismissAll();
              this.dismiss();
            } else {
              loading.dismissAll();
              super.showToast(this.toastCtrl, f["StatusContent"]);
            }
          }, error => this.errorMessage = < any > error);
      } else {
        super.showToast(this.toastCtrl, "请登录后发布问题");
      }
    });
  }


}
