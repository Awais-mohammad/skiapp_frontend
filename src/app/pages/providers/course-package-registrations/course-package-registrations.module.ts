import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursePackageRegistrationsPage } from './course-package-registrations.page';

const routes: Routes = [
  {
    path: '',
    component: CoursePackageRegistrationsPage
  },
  {
    path: ':t',
    component: CoursePackageRegistrationsPage
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CoursePackageRegistrationsPage]
})
export class CoursePackageRegistrationsPageModule {}
