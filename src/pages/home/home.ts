import { Storage } from '@ionic/storage';
import { DetailsPage } from './../details/details';
import {
  Component
} from '@angular/core';
import {
  NavController,
  Tabs
} from 'ionic-angular';
import {
  ModalController
} from 'ionic-angular/components/modal/modal-controller';

import {
  BaseUI
} from '../../common/baseui';
import {
  LoadingController
} from 'ionic-angular/components/loading/loading-controller';
import {
  RestProvider
} from '../../providers/rest/rest';
import { QuestionPage } from '../question/question';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseUI {

  feeds: string[];

  errorMessage: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadCtrl: LoadingController,
    public rest: RestProvider,
    public storage: Storage,
    public toastCtrl: ToastController
  ) {
    super();
  }

  ionViewDidLoad(){
   this.getFeeds();
  }


  gotoQuestion() {
    const modal = this.modalCtrl.create(QuestionPage);
    modal.present();
  }


  gotoChat() {
    this.selectTab(2);
  }


  /**
   * 选定指定的tab
   * 
   * @param {number} index 
   * @memberof HomePage
   */
  selectTab(index: number) {
    const t: Tabs = this.navCtrl.parent;
    t.select(index);
  }

  getFeeds() {
    const loading = super.showLoading(this.loadCtrl, "加载中...");
    this.rest.getFeeds()
      .subscribe(f => {
        this.feeds = f;
        loading.dismiss();
      }, error => this.errorMessage = < any > error);
  }


  gotoDetails(questionId){
    console.log(questionId);
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
