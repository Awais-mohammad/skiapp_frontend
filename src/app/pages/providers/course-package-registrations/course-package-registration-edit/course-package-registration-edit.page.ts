import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {AlertController, IonContent, IonRouterOutlet, ModalController, NavController} from "@ionic/angular";
import {PackageCourseRegistration} from "../../../../models/PackageCourseRegistration";
import {CoursePackage} from "../../../../models/CoursePackage";
import {Provider} from "../../../../models/Provider";
import {LearnType} from "../../../../models/code/LearnType";
import {AgeRangeOption} from "../../../../models/courseOptions/AgeRangeOption";
import {LevelOption} from "../../../../models/courseOptions/LevelOption";
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
import {Course} from "../../../../models/Course";
import {GeneralResponse} from "../../../../models/transfer/GeneralResponse";
import {PackageRegistrationInvoice} from "../../../../models/payment/coursePayment/PackageRegistrationInvoice";

@Component({
  selector: 'app-course-package-registration-edit',
  templateUrl: './course-package-registration-edit.page.html',
  styleUrls: ['./course-package-registration-edit.page.scss'],
})
export class CoursePackageRegistrationEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  private actionSheet:any;
  submitted:boolean;
  userId:number;

  packageRegistrationId:number;
  registration:PackageCourseRegistration;
  coursePackage:CoursePackage;
  providerId:number;
  provider:Provider;

  learnTypes:LearnType[] = null;

  courseEmptyError:string;
  namesEmptyError:string;
  enableLiftTicket:boolean = true;
  enableRental:boolean = true;

  ageRangeOptions:AgeRangeOption[];
  levelOptions:LevelOption[];
  useBirthDay:boolean;

  constructor(public appSession:AppSession, private route: ActivatedRoute, router: Router, private toastUtil:ToastUtil,
              public appConstants:AppConstants, private providersService:ProvidersService, public studentUtil:StudentUtil,
              private codeTableService:CodeTableService, public translateUtil:TranslateUtil, private userService:UserService,
              private paymentProcessUtil:PaymentProcessUtil, private navCtrl:NavController, public modalController: ModalController,
              private alertCtrl:AlertController, private utils:Utils, private ionRouterOutlet:IonRouterOutlet,
              private coursePaymentService:CoursePaymentService, private modalCtrl:ModalController,
              private coursePackageService:CoursePackageService,) {
    super(appSession, router, appConstants);
    super.l_checkUserId(false);
    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.registration = this.router.getCurrentNavigation().extras.state.registration;
        this.packageRegistrationId = this.router.getCurrentNavigation().extras.state.packageRegistrationId;
        if(!this.registration && !this.packageRegistrationId){
          this.toastUtil.showToastTranslate("Empty registration!");
        }

        if(this.registration){
          this.packageRegistrationId = this.registration.id;
          this.updatePageContent();
        }else if(this.packageRegistrationId>0){
          this.coursePackageService.getPackageRegistrationDetailsById(this.packageRegistrationId, (pkgRegistration:PackageCourseRegistration) => {
            this.registration = pkgRegistration;
            this.updatePageContent();
          });
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
      if (this.provider) {
        this.enableLiftTicket = this.provider.enableLiftTicket;
        this.enableRental = this.provider.enableRental;
      }
    });

    this.codeTableService.getLearnType((types: LearnType[]) => {
      this.learnTypes = types;
    });

    this.getDefaultOptions();
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

  getDisableBtn(){
    if(!this.registration || this.registration.alreadySent){
      return true;
    }
    return false;
  }

  getDefaultOptions(){
    this.providersService.getDefaultCourseAgeOptions((ageOptions:AgeRangeOption[]) => {
      this.ageRangeOptions = ageOptions;
      if(this.ageRangeOptions && this.ageRangeOptions.length>0){
        this.ageRangeOptions.sort((s1:AgeRangeOption,s2:AgeRangeOption) => {
          return (s1.sequence-s2.sequence);
        });
      }
    });

    this.providersService.getDefaultCourseLevelOptions((levelOptions:LevelOption[]) => {
      this.levelOptions = levelOptions;
      if(this.levelOptions && this.levelOptions.length>0){
        this.levelOptions.sort((s1:LevelOption,s2:LevelOption) => {
          return (s1.sequence-s2.sequence);
        });
      }
    });
  }

  onClose(){
    this.registration = null;
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  async onConfirm() {
    console.log("Good onConfirm().");
    this.submitted = true;

    if(this.utils.checkDebounce("SkiCourseRegistrationConfirmPage.onConfirm")){
      console.log("SkiCourseRegistrationConfirmPage.onConfirm debounced!");
      return;
    }

    // validation;
    if(!this.registration.students || this.registration.students.length===0){
      this.namesEmptyError = "Please add student.";
      this.toastUtil.showToast("Please add student.");
    }else{
      this.namesEmptyError = null;
    }
    if(!this.coursePackage.courses || this.coursePackage.courses.length===0){
      this.toastUtil.showToast("No course available in this package!");
      return;
    }
    let selectedCourses:Course[] = [];
    for(let course of this.coursePackage.courses){
      if(course.checked){
        selectedCourses.push(course);
      }
    }
    if(selectedCourses.length===0){
      this.toastUtil.showToast("Please select course to register.");
      this.courseEmptyError = "Please select course to register.";
      return;
    }else{
      this.courseEmptyError = null;
      this.registration.selectedPackageCourses = selectedCourses;
    }

    this.coursePackageService.registerPackageRegistration(this.userId, this.registration, (regResponse:GeneralResponse) => {
      if(!regResponse){
        this.utils.showOkAlert(this.alertCtrl, "Failed register package, no response!", regResponse.message);
        return;
      }
      if(regResponse.code!==0){
        this.utils.showOkAlert(this.alertCtrl, "Failed!", regResponse.message);
        return;
      }

      let packageInvoice:PackageRegistrationInvoice = regResponse.resultObject;
      console.log("Got back package registration invoice. Total amount: " + packageInvoice.total);

      // forward to package-payment-details page;
      let navigationExtras: NavigationExtras = {
        state: {
          providerId: this.providerId,
          packageInvoice:packageInvoice,
        }
      };
      this.router.navigate(['package-payment-details'], navigationExtras);
    });
  }
}
