import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PackagePaymentDetailsPage } from './package-payment-details.page';

const routes: Routes = [
  {
    path: '',
    component: PackagePaymentDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PackagePaymentDetailsPage]
})
export class PackagePaymentDetailsPageModule {}
