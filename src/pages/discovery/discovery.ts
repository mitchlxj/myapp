import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseUI } from '../../common/baseui';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { RestProvider } from '../../providers/rest/rest';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { DetailsPage } from './../details/details';
/**
 * Generated class for the DiscoveryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-discovery',
  templateUrl: 'discovery.html',
})
export class DiscoveryPage extends BaseUI {

  questions: string[];

  errorMessage: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadCtrl:LoadingController,
    public rest:RestProvider,
    public toastCtrl: ToastController,
    public storage:Storage,
    public modalCtrl:ModalController,
  ) {
    super();
  }

  ionViewDidLoad() {
    this.getQuestions();
  }

  getQuestions() {
    const loading = super.showLoading(this.loadCtrl, "加载中...");
    this.rest.getQuestions()
      .subscribe(q => {
        loading.dismiss(); //屏蔽后不会报removeView was not found的错误了
        this.questions = q;
      }, error => this.errorMessage = < any > error);
  }


  doRefresh(refresher){
    this.getQuestions();
    refresher.complete();
  }

  gotoDetails(questionId){

    this.storage.get('UserId').then(val => {
      if(val){
        this.navCtrl.push(DetailsPage,{id:questionId});
      }else{
        super.showToast(this.toastCtrl,"您还没有登录，无法查看回答！");
        this.navCtrl.parent.select(4);
      }
     
    });
  }

}
