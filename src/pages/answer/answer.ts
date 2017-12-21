import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { RestProvider } from '../../providers/rest/rest';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { BaseUI } from '../../common/baseui';

/**
 * Generated class for the AnswerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-answer',
  templateUrl: 'answer.html',
})
export class AnswerPage extends BaseUI{

  id:string;
  content:string;
  errorMessage:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl:ViewController,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public rest: RestProvider,
    public toastCtrl: ToastController

  ) {
    super();
    this.id= this.navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnswerPage');
  }


  dismiss(){
    this.viewCtrl.dismiss();
  }

  submit(){
    this.storage.get('UserId').then((val) => {
      if (val != null) {
        const loading = super.showLoading(this.loadingCtrl, "发表中...");
        this.rest.answer(val, this.id, this.content)
          .subscribe(f => {
            if (f["Status"] === "OK") {
              loading.dismiss();
              this.dismiss();
            } else {
              loading.dismiss();
              super.showToast(this.toastCtrl, f["StatusContent"]);
            }
          }, error => this.errorMessage = < any > error);
      } else {
        super.showToast(this.toastCtrl, "请登录后发布回答");
      }
    });
  }

}
