import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePackageDetailsPage } from './course-package-details.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePackageDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoursePackageDetailsPage]
})
export class CoursePackageDetailsPageModule {}
