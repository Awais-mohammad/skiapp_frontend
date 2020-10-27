import {Component, OnInit, ViewChild} from '@angular/core';
import {BasicUserIdPage} from '../../../BasicUserIdPage';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonRouterOutlet,
  ModalController,
  NavController,
  Platform
} from '@ionic/angular';
import {AppSession} from '../../../../services/app-session.service';
import {AppConstants} from '../../../../services/app-constants.service';
import {ToastUtil} from '../../../../services/toast-util.service';
import {ProvidersService} from '../../../../services/providers-service.service';
import {Utils} from '../../../../services/utils.service';
import {TranslateUtil} from '../../../../services/translate-util.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {CodeTableService} from '../../../../services/code-table-service.service';
import {NgForm} from '@angular/forms';
import {DateTimeUtils} from '../../../../services/date-time-utils.service';
import {CoursePackage} from "../../../../models/CoursePackage";
import {CoursePackageService} from "../../../../services/CoursePackage.service";
import {Course} from "../../../../models/Course";

@Component({
  selector: 'app-course-package-edit',
  templateUrl: './course-package-edit.page.html',
  styleUrls: ['./course-package-edit.page.scss'],
})
export class CoursePackageEditPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("formRef") formRef:NgForm;
  private actionSheet:any;

  submitted:boolean;

  userId:number;
  providerId:number;
  coursePackageId;
  coursePackage:CoursePackage;
  availableCourses:Course[];

  constructor(public appSession:AppSession, public appConstants:AppConstants, public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private actionsheetCtrl:ActionSheetController, public dateTimeUtils:DateTimeUtils,
              private codeTableService:CodeTableService, private ionRouterOutlet:IonRouterOutlet,
              private alertCtrl:AlertController, private coursePackageService:CoursePackageService) {
    super(appSession, router, appConstants);
    super.l_checkUserId(true);

    this.userId = this.appSession.l_getUserId();

    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if(this.router.getCurrentNavigation()&& this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.coursePackageId = this.router.getCurrentNavigation().extras.state.coursePackageId;
        this.coursePackage = this.router.getCurrentNavigation().extras.state.coursePackage;
      }
    });
  }

  ngOnInit() {
    if(!this.providerId){
      this.toastUtil.showToastTranslate("Empty providerId!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
  }


  ionViewWillEnter() {
    if(this.coursePackageId){
      this.updatePageContent();
    }else if(this.coursePackage){
      this.coursePackageId = this.coursePackage.id;
    }
    this.providerService.s_getAllCoursesForProviderId(this.providerId, false, this.appConstants.CODE_COURSE_GROUP, (courses:Course[]) => {
      this.availableCourses = courses;
    });
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

  updatePageContent(){
    this.coursePackageService.getCoursePackageWithDetails(this.coursePackageId, (coursePackage:CoursePackage) => {
      this.coursePackage = coursePackage;
    });
  }

  onClose(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onSaveCoursePackage(formRef:NgForm) {
    console.log("save called good.");
    this.submitted = true;

    if (!this.appSession.l_isSiteAdmin() && !this.appSession.l_isAdministrator(this.providerId)) {
      this.toastUtil.showToastTranslate("No able to create course!");
      return;
    }

    if (!formRef.valid) {
      this.toastUtil.showToast(this.translateUtil.translateKey("FORM_FILL_MESG"));
      return;
    }

    this.coursePackageService.saveCoursePackage(this.userId, this.coursePackage, (result:boolean) => {
      if(result){
        this.toastUtil.showToast("Saved successfully.");
      }else{
        this.toastUtil.showToast("Failed saving.");
      }
      this.onClose();
    });
  }

  async openMenu() {
    this.actionSheet = await this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.translateUtil.translateKey('SAVE'),
          handler: () => {
            console.log('To submit form.');
            if(!this.formRef){
              console.log("Can not find formRef!");
            }else{
              this.formRef.ngSubmit.emit("ngSubmit");
              console.log('Save clicked finished.');
            }
          }
        },
      ]
    });
    this.actionSheet.present();
  }
}
