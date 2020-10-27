import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet,
  ModalController,
  NavController
} from "@ionic/angular";
import {PackageCourseRegistration} from "../../../../models/PackageCourseRegistration";
import {CoursePackage} from "../../../../models/CoursePackage";
import {Provider} from "../../../../models/Provider";
import {AppSession} from "../../../../services/app-session.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ToastUtil} from "../../../../services/toast-util.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {StudentUtil} from "../../../../services/student-util.service";
import {CodeTableService} from "../../../../services/code-table-service.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {UserService} from "../../../../services/user-service.service";
import {PaymentProcessUtil} from "../../../../services/coursePayment/payment-process-util.service";
import {Utils} from "../../../../services/utils.service";
import {CoursePaymentService} from "../../../../services/coursePayment/course-payment-service.service";
import {CoursePackageService} from "../../../../services/CoursePackage.service";

@Component({
  selector: 'app-course-package-registration-details',
  templateUrl: './course-package-registration-details.page.html',
  styleUrls: ['./course-package-registration-details.page.scss'],
})
export class CoursePackageRegistrationDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;
  private myModal:any;

  submitted:boolean;
  userId:number;

  packageRegistrationId:number;
  registration:PackageCourseRegistration;
  coursePackage:CoursePackage;
  providerId:number;
  provider:Provider;

  constructor(public appSession:AppSession, private route: ActivatedRoute, router: Router, private toastUtil:ToastUtil,
              public appConstants:AppConstants, private providersService:ProvidersService, public studentUtil:StudentUtil,
              private codeTableService:CodeTableService, public translateUtil:TranslateUtil, private userService:UserService,
              private paymentProcessUtil:PaymentProcessUtil, private navCtrl:NavController, public modalController: ModalController,
              private alertCtrl:AlertController, private utils:Utils, private ionRouterOutlet:IonRouterOutlet,
              private coursePaymentService:CoursePaymentService, private modalCtrl:ModalController,
              private coursePackageService:CoursePackageService, private actionsheetCtrl:ActionSheetController,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);
    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.packageRegistrationId = this.router.getCurrentNavigation().extras.state.packageRegistrationId;

        if(!this.registration && !this.packageRegistrationId){
          this.toastUtil.showToastTranslate("Empty registration!");
        }
      }
    });
  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.providerId) {
      this.toastUtil.showToastTranslate("Empty provider!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    this.providersService.s_getProviderById(this.providerId, (provider: Provider) => {
      this.provider = provider;
      if (!this.provider) {
        this.toastUtil.showToastTranslate("Can not find provider by providerId!");
        this.router.navigate([this.appConstants.ROOT_PAGE]);
        return;
      }
    });

    this.coursePackageService.getPackageRegistrationDetailsById(this.packageRegistrationId, (pkgRegistration:PackageCourseRegistration) => {
      this.registration = pkgRegistration;
      this.updatePageContent();
    });
  }

  updatePageContent(){
    if(!this.registration || !this.registration.coursePackageId){
      this.toastUtil.showToastTranslate("Empty package!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.coursePackageService.getCoursePackageWithDetails(this.registration.coursePackageId, (pkg:CoursePackage) => {
        if(!pkg){
          this.toastUtil.showToast("Can not find course package!");
        }else{
          this.coursePackage = pkg;
          this.registration.title = this.coursePackage.name + " registration";
        }
      });
    }

    if(this.registration.alreadySent){
      this.registration = null;
      this.toastUtil.showToast("Please start registration again.");
      this.onClose();
      return;
    }
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  onViewConsent(){
    console.log("Good onViewConsent().");
    let navigationExtras: NavigationExtras = {
      state: {
        providerId: this.providerId,
      }
    };
    this.router.navigate(['consent-view'], navigationExtras);
  }

  onClose(){
    this.registration = null;
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onEdit(){
    console.log("Good onEdit().");
  }

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  async openMenu() {
    let buttons: any = [];

    // if (this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()) {
    //   buttons.push(
    //     {
    //       text: this.translateUtil.translateKey('Edit'),
    //       handler: () => {
    //         console.log('Edit clicked');
    //         this.onEdit();
    //       },
    //     }
    //   );
    // }

    buttons.push(
      {
        text: this.translateUtil.translateKey('Home'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('Home clicked');
          this.goHome();
        },
      }
    );

    if (this.ionRouterOutlet.canGoBack()) {
      buttons.push(
        {
          text: this.translateUtil.translateKey('CLOSE'),
          // role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('CLOSE clicked');
            this.onClose();
          },
        }
      );
    }

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
