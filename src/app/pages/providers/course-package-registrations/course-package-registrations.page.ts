import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet, LoadingController,
  NavController, PickerController,
  Platform
} from "@ionic/angular";
import {Provider} from "../../../models/Provider";
import {PackageCourseRegistration} from "../../../models/PackageCourseRegistration";
import {AppSession} from "../../../services/app-session.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {Utils} from "../../../services/utils.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {CodeTableService} from "../../../services/code-table-service.service";
import {CoursePackageService} from "../../../services/CoursePackage.service";

@Component({
  selector: 'app-course-package-registrations',
  templateUrl: './course-package-registrations.page.html',
  styleUrls: ['./course-package-registrations.page.scss'],
})
export class CoursePackageRegistrationsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet: any;
  public loading: any = null;

  fromCommand: number = null;
  showAllDetails:boolean = false;

  searchKey:string;

  userId:number;
  providerId: number = null;
  provider: Provider = null;
  packageRegistrations: PackageCourseRegistration[];

  constructor(public appSession: AppSession, public appConstants: AppConstants,  public toastUtil: ToastUtil,
              private providersService: ProvidersService, public utils: Utils, public translateUtil: TranslateUtil,
              private route: ActivatedRoute, public router: Router, private navCtrl: NavController, public platform: Platform,
              private actionsheetCtrl:ActionSheetController, private codeTableService:CodeTableService,
              private alertCtrl: AlertController, private coursePackageService:CoursePackageService,
              private ionRouterOutlet: IonRouterOutlet,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.fromCommand = this.router.getCurrentNavigation().extras.state.fromCommand;
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
      }
    });
  }

  ngOnInit() {
    console.log("Good ngOnInit().");
    if(!this.providerId){
      this.goHome();
      return;
    }
  }

  ionViewWillEnter() {
    console.log("Good ionViewWillEnter().");
    this.updatePageContent();
  }

  private updatePageContent(){
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }else{
      this.providersService.s_getProviderById(this.providerId, (provider: Provider) => {
        this.provider = provider;
        if(!this.provider){
          this.toastUtil.showToast("Can not find provider!");
          this.onClose();
        }
      });

    }

    //////////
    if(this.fromCommand===this.appConstants.PAGE_FOR_PROVIDER && this.providerId>0){
      this.coursePackageService.getPackageRegistrationsByProviderId(this.providerId, (pkgRegistrations:PackageCourseRegistration[]) => {
        this.packageRegistrations = pkgRegistrations;
      });
    }else if(this.fromCommand===this.appConstants.PAGE_FOR_MEMBER && this.userId>0){
      this.coursePackageService.getPackageRegistrationsByProviderId(this.providerId, (pkgRegistrations:PackageCourseRegistration[]) => {
        this.packageRegistrations = pkgRegistrations;
      });
    }else{
      console.log("Unknown fromCommand!");
      return;
    }
  }

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onViewDetails(registration:PackageCourseRegistration){
    console.log("Good onViewDetails, courseId: " + registration.id);
    let navigationExtras: NavigationExtras = {
      state: {
        packageRegistrationId: registration.id,
        providerId: this.providerId
      }
    };
    this.router.navigate(['course-package-registration-details'], navigationExtras);
  }


  async openMenu() {
    let buttons: any = [];
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
    if(this.ionRouterOutlet.canGoBack()){
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
