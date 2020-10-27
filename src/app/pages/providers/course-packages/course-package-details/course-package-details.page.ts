import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent, IonRouterOutlet, LoadingController,
  ModalController,
  NavController,
  Platform
} from '@ionic/angular';
import {BasicUserIdPage} from "../../../BasicUserIdPage";
import {Utils} from "../../../../services/utils.service";
import {CoursePackage} from "../../../../models/CoursePackage";
import {AppSession} from "../../../../services/app-session.service";
import {AppConstants} from "../../../../services/app-constants.service";
import {ToastUtil} from "../../../../services/toast-util.service";
import {ProvidersService} from "../../../../services/providers-service.service";
import {TranslateUtil} from "../../../../services/translate-util.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {CodeTableService} from "../../../../services/code-table-service.service";
import {CoursePackageService} from "../../../../services/CoursePackage.service";
import {Course} from "../../../../models/Course";
import {PackageCourseRegistration} from "../../../../models/PackageCourseRegistration";

@Component({
  selector: 'app-course-package-details',
  templateUrl: './course-package-details.page.html',
  styleUrls: ['./course-package-details.page.scss'],
})
export class CoursePackageDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  private actionSheet:any;

  userId:number = null;
  providerId:number = null;
  coursePackageId:number;
  coursePackage:CoursePackage;
  availableCourses:Course[];

  constructor(public appSession:AppSession, public appConstants:AppConstants,  public toastUtil:ToastUtil,
              private providerService:ProvidersService, public utils:Utils, public translateUtil:TranslateUtil,
              private route: ActivatedRoute, public router:Router, private navCtrl:NavController, public platform:Platform,
              private actionsheetCtrl:ActionSheetController, private ionRouterOutlet:IonRouterOutlet,
              private codeTableService:CodeTableService, private coursePackageService:CoursePackageService,
              private alertCtrl:AlertController,) {
    super(appSession, router, appConstants);

    this.userId = this.appSession.l_getUserId();
    this.route.queryParams.subscribe(params => {
      console.log("Good queryParams.");
      if (this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.coursePackageId = this.router.getCurrentNavigation().extras.state.coursePackageId;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(!this.providerId) {
      this.toastUtil.showToastTranslate("Empty provider!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
      return;
    }
    this.updatePageContent();
  }

  ionViewDidEnter() {
  }

  ionViewCanLeave() {
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
    this.providerService.s_getAllCoursesForProviderId(this.providerId, false, this.appConstants.CODE_COURSE_GROUP, (courses:Course[]) => {
      this.availableCourses = courses;
    });
  }

  onViewCourse(course:Course){
    console.log("Good onViewCourse.");
  }

  onEdit(){
    console.log("Good onEdit.");
    let navigationExtras: NavigationExtras = {
      state: {
        coursePackage: this.coursePackage,
        providerId: this.providerId
      }
    };
    this.router.navigate(['course-package-edit'], navigationExtras);
  }


  onDeleteCourse(course:Course){
    console.log("Good onDeleteCourse.");
    if(!course || !course.id){
      return;
    }
    if(this.coursePackage.courses){
      this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete the course from package?", null, null, 'Cancel', null, 'Delete', () => {
        let removed:Course[] = [];
        for(let cs of this.coursePackage.courses){
          if(cs.id!==course.id){
            removed.push(cs);
          }
        }
        this.coursePackage.courses = removed;

        this.coursePackageService.deleteCourseForPackage(this.userId, this.coursePackageId, course.id, (result:boolean) => {
          if(result){
            this.toastUtil.showToast("Deleted course from package successfully.");
          }else{
            this.toastUtil.showToast("Delete course from package failed.");
          }
        });
      });
    }
  }

  async onAddCourse(){
    console.log("Good onAddCourse.");
    let inputs:any[] = [];
    for(let availableCourse of this.availableCourses){
      let notExist = true;
      if(this.coursePackage.courses){
        for(let existCourse of this.coursePackage.courses){
          if(existCourse.id===availableCourse.id){
            notExist = false;
            break;
          }
        }
      }
      if(notExist){
        inputs.push({
          type: 'checkbox',
          label: availableCourse.name,
          value: availableCourse,
          checked: false
        });
      }
    }

    const alert = await this.alertCtrl.create({
      header: this.translateUtil.translateKey("Choose Course"),
      subHeader: "Choose.",
      inputs: inputs,
      buttons: [
        {
          text: this.translateUtil.translateKey("CANCEL"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateUtil.translateKey("CHOOSE"),
          handler: data => {
            if(!this.coursePackage.courses){
              this.coursePackage.courses = [];
            }
            let chosenCourses:Course[] = data;
            let courseIds:number[] = [];
            for(let course of chosenCourses){
              if(this.coursePackage.courses.indexOf(course)<0){
                this.coursePackage.courses.push(course);
              }
              if(courseIds.indexOf(course.id)<0){
                courseIds.push(course.id);
              }
            }
            this.coursePackageService.addCoursesForPackage(this.userId, this.coursePackageId, courseIds, (result:boolean) => {
              if(result){
                this.toastUtil.showToast("Added courses to package successfully.");
              }else{
                this.toastUtil.showToast("Failed adding course to package.");
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  onDelete(){
    console.log("Good onDelete.");
    this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to delete this package?", null, null, 'Cancel', null, 'Delete', () => {
      this.coursePackageService.deleteCoursePackage(this.userId, this.coursePackageId, (result:boolean) => {
        if(result){
          this.toastUtil.showToast("Deleted course package successfully.");
          this.onClose();
        }else{
          this.toastUtil.showToast("Delete course package failed.");
        }
      });
    });
  }

  onRegisterPackage(){
    console.log("Good onRegisterPackage.");

    let registration = new PackageCourseRegistration();
    registration.coursePackageId = this.coursePackageId;
    registration.providerId = this.providerId;
    registration.title = "Registration"
    let navigationExtras: NavigationExtras = {
      state: {
        registration: registration,
        providerId: this.providerId
      }
    };
    this.router.navigate(['course-package-registration-confirm'], navigationExtras);
  }

  onClose(){
    this.navCtrl.pop();
  }

  goHome(){
    this.router.navigate([this.appConstants.ROOT_PAGE]);
  }

  async openMenu() {
    let buttons: any = [];

    if(this.appSession.l_isSiteAdmin() && this.appSession.l_isAdministrator(this.providerId)){
      buttons.push(
        {
          text: this.translateUtil.translateKey('Edit'),
          handler: () => {
            console.log('Edit clicked');
            this.onEdit();
          },
        }
      );
      buttons.push(
        {
          text: this.translateUtil.translateKey('Delete'),
          handler: () => {
            console.log('Delete clicked');
            this.onDelete();
          },
        }
      );
    }

    buttons.push(
      {
        text: this.translateUtil.translateKey('Register'),
        // role: 'cancel', // will always sort to be on the bottom
        handler: () => {
          console.log('Register clicked');
          this.onRegisterPackage();
        },
      }
    );
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
