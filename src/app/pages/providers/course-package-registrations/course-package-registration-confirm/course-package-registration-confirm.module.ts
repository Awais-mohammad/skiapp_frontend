import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePackageRegistrationConfirmPage } from './course-package-registration-confirm.page';
import {StudentPageModule} from "../../student/student.module";

const routes: Routes = [
  {
    path: '',
    component: CoursePackageRegistrationConfirmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    StudentPageModule,
  ],
  declarations: [CoursePackageRegistrationConfirmPage]
})
export class CoursePackageRegistrationConfirmPageModule {}
