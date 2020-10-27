import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePackageEditPage } from './course-package-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePackageEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoursePackageEditPage]
})
export class CoursePackageEditPageModule {}
