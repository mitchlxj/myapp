import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  normalizeURL
} from 'ionic-angular';
import {
  ActionSheetController
} from 'ionic-angular/components/action-sheet/action-sheet-controller';
import {
  Storage
} from '@ionic/storage';
import {
  ModalController
} from 'ionic-angular/components/modal/modal-controller';
import {
  LoadingController
} from 'ionic-angular/components/loading/loading-controller';
import {
  RestProvider
} from '../../providers/rest/rest';
import {
  BaseUI
} from '../../common/baseui';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera';
import {
  File
} from '@ionic-native/file';
import {
  FilePath
} from '@ionic-native/file-path';
import {
  Transfer,
  TransferObject
} from '@ionic-native/transfer';
import {
  Platform
} from 'ionic-angular/platform/platform';
import {
  ToastController
} from 'ionic-angular/components/toast/toast-controller';
import {
  ViewController
} from 'ionic-angular/navigation/view-controller';

//declare const cordova: any; //导入第三方的库定义到ts项目中


/**
 * Generated class for the HeadfacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-headface',
  templateUrl: 'headface.html',
})
export class HeadfacePage extends BaseUI {


  userId: string;
  errorMessage: any;
  lastImage: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public rest: RestProvider,
    public camera: Camera,
    public file: File,
    public filePath: FilePath,
    public transfer: Transfer,
    public platform: Platform,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,

  ) {
    super();
  }

  ionViewDidEnter() {
    this.storage.get('UserId').then(val => {
      if (val != null) {
        this.userId = val;
      }
    });


  }


  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: '选择图片',
      buttons: [{
          text: '从图片库中选择',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: '使用相机',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: '取消',
          role: 'cancel',
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType) {
    //定义相机的一些参数
    const options: CameraOptions = {
      quality: 30,
      allowEdit: true, //允许裁剪相片
      sourceType: sourceType,
      saveToPhotoAlbum: false, //是否保存拍摄的照片到相册中去
      correctOrientation: true, //是否纠正拍摄照片的方向
    };

    //获取图片的方法
    this.camera.getPicture(options).then(imagePath => {
      //特别处理android平台文件路径问题
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        //获取android平台下的真实路径
        this.filePath.resolveNativePath(imagePath).then(filePath => {
          //获取正确的路径 注意substring和substr方法的区别 一个是从哪开始到哪结束，一个是从哪开始取多长长度
          const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          //获取正确的文件名
          const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        })
      } else {
        //获取正确的路径
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //获取正确的文件名
        const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1);

        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, error => {
      //super.showToast(this.toastCtrl, '选择图片出现错误，请在app中操作或检查相关权限。');
    });
  }

  //将获取到的图片或相机拍摄到的图片另存为，用于后期图片上传使用
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      super.showToast(this.toastCtrl, '存储图片到本地图库出现错误。');
    });
  }

  //为文件生成一个新的文件名
  createFileName() {
    const d = new Date();
    const n = d.getTime();
    const newFileName = n + ".jpg"; //拼接文件名
    return newFileName;
  }

  //处理出片的路径为可以上传的路径
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      //normalizeURL方式ios11打不开照相机
      return normalizeURL(this.file.dataDirectory + img);
    }
  }

  uploadImage() {
    const url = 'https://imoocqa.gugujiankong.com/api/account/uploadheadface';
    const targetPath = this.pathForImage(this.lastImage);
    const filename = this.userId + ".jpg"; //定义上传后的文件名

    //上传的参数
    const options = {
      fileKey: 'file',
      fileName: filename,
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: {
        'fileName': filename,
        'userid': this.userId
      }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    const loading = super.showLoading(this.loadingCtrl, '上传中...');

    //开始正式的上传
    fileTransfer.upload(targetPath, url, options).then(data => {
      loading.dismiss();
      super.showToast(this.toastCtrl, "图片上传成功");
      //在用户看清弹窗提示后进行页面的关闭
      setTimeout(() => {
        this.viewCtrl.dismiss();
      }, 3000);
    }, error => {
      loading.dismiss();
      super.showToast(this.toastCtrl, "图片上传发生错误，请重试。");
    });

  }

}
