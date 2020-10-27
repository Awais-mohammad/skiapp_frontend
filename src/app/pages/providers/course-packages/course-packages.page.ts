import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet, LoadingController,
  NavController,
  Platform
} from "@ionic/angular";
import {Provider} from "../../../models/Provider";
import {AppSession} from "../../../services/app-session.service";
import {AppConstants} from "../../../services/app-constants.service";
import {ToastUtil} from "../../../services/toast-util.service";
import {ProvidersService} from "../../../services/providers-service.service";
import {Utils} from "../../../services/utils.service";
import {TranslateUtil} from "../../../services/translate-util.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {CodeTableService} from "../../../services/code-table-service.service";
import {CoursePackage} from "../../../models/CoursePackage";
import {CoursePackageService} from "../../../services/CoursePackage.service";

@Component({
  selector: 'app-course-packages',
  templateUrl: './course-packages.page.html',
  styleUrls: ['./course-packages.page.scss'],
})
export class CoursePackagesPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('search') search : any;

  private actionSheet: any;
  public loading: any = null;

  userId:number = null;
  providerId: number = null;
  provider: Provider = null;
  coursePackages: CoursePackage[] = null;

  private keyIndex: number = 0;
  public showSearchBar: boolean = false;
  public searchKey: string = null;
  public searchKeys: string[] = null;


  constructor(public appSession: AppSession, public appConstants: AppConstants,  public toastUtil: ToastUtil,
              private providersService: ProvidersService, public utils: Utils, public translateUtil: TranslateUtil,
              private route: ActivatedRoute, public router: Router, private navCtrl: NavController, public platform: Platform,
              private actionsheetCtrl:ActionSheetController, private codeTableService:CodeTableService,
              private alertCtrl: AlertController, private coursePackageService:CoursePackageService,
              private ionRouterOutlet: IonRouterOutlet, private loadingCtrl: LoadingController,) {
    super(appSession, router, appConstants);
    console.log("Good constructor().");
    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;

      }
    });
  }

  ngOnInit() {
    console.log("Good ngOnInit().");
  }

  ionViewWillEnter() {
    console.log("Good ionViewWillEnter().");
    this.searchKey = null;
    this.searchKeys = null;

    this.updatePageContent(true);
  }

  ionViewDidEnter(){
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
    this.dismissLoading();
  }

  async showLoading(){
    console.log("showLoading called.");
    this.dismissLoading();

    if(!this.loading) {
      this.loading = await this.loadingCtrl.create({
        message: 'Loading, please wait...',
        spinner: 'crescent',
        // duration: 20000
      });
    }
    await this.loading.present();
  }

  dismissLoading(){
    console.log("dismissLoading called.");
    setTimeout(
      () => {
        if(this.loading){
          this.loading.dismiss();
        }
        this.loading = null;
      },
      500
    );
  }

  updatePageContent(refresh: boolean){
    this.coursePackageService.getPackagesForProviderId(this.providerId, (pkgs:CoursePackage[]) => {
      this.coursePackages = pkgs;
    });
  }

  toggleSearchBar(){
    this.showSearchBar = !this.showSearchBar;
    this.focusButton();
    //this.checkSearchBarTimeout();;
  }

  focusButton(){
    if(this.showSearchBar && this.search){
      setTimeout(() => {
        this.search.setFocus();
      }, 500);
    }
  }

  onViewPackageDetails(coursePackage:CoursePackage){
    console.log("Good onViewDetails, coursePackage.Id: " + coursePackage.id);
    let navigationExtras: NavigationExtras = {
      state: {
        coursePackageId: coursePackage.id,
        providerId: this.providerId
      }
    };
    this.router.navigate(['course-package-details'], navigationExtras);
  }

  onAdd(){
    console.log("Good this.onAdd().");

    let coursePackage = new CoursePackage();
    coursePackage.providerId = this.providerId;
    coursePackage.allowCourseSelection = true;
    coursePackage.enabled = true;
    let navigationExtras: NavigationExtras = {
      state: {
        coursePackage: coursePackage,
        providerId: this.providerId
      }
    };
    this.router.navigate(['course-package-edit'], navigationExtras);
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      100
    );
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  async openMenu() {
    let buttons: any = [];

    if(this.appSession.l_isAdministrator(this.providerId) || this.appSession.l_isSiteAdmin()){
      buttons.push(
        {
          text: this.translateUtil.translateKey('New Course Package'),
          handler: () => {
            console.log('Add clicked');
            this.onAdd();
          },
        }
      );
    }

    buttons.push(
      {
        text: this.translateUtil.translateKey('Home'),
        handler: () => {
          console.log('Home clicked');
          this.goHome();
        },
      }
    );

    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: buttons
    });
    this.actionSheet.present();
  }
}
