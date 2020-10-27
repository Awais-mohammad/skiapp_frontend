import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePackageRegistrationEditPage } from './course-package-registration-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePackageRegistrationEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoursePackageRegistrationEditPage]
})
export class CoursePackageRegistrationEditPageModule {}
