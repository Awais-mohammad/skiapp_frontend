import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePackageRegistrationDetailsPage } from './course-package-registration-details.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePackageRegistrationDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoursePackageRegistrationDetailsPage]
})
export class CoursePackageRegistrationDetailsPageModule {}
