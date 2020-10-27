import { Injectable } from '@angular/core';
import {HttpUtil} from '../http-util.service';
import {ACLService} from '../aclservice.service';
import {AppConstants} from '../app-constants.service';
import {PaymentAction} from '../../models/payment/PaymentAction';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackagePaymentService {

  constructor(private appConstants:AppConstants, private aclService:ACLService,
              private httpUtil:HttpUtil) {

  }

  packageCheckOut(providerId:number, userId:number, paymentAction:PaymentAction, callback?){
    if(!paymentAction){
      return;
    }
    console.log("packageCheckOut.");
    this.aclService.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
        "packageCheckOut",  // objName
        serviceUrl + "packageCheckOut/" + providerId + "/" + userId, //urlStr,
        "post", //method,
        paymentAction, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:boolean) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }

  cancelPackagePaymentByClient(providerId:number, userId:number, packageInvoiceId:number, callback?){
    if(!packageInvoiceId){
      return;
    }
    console.log("cancelPackagePaymentByClient.");
    this.aclService.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
        "cancelPackagePaymentByClient",  // objName
        serviceUrl + "cancelPackagePaymentByClient/" + providerId + "/" + userId, //urlStr,
        "post", //method,
        packageInvoiceId, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (result:boolean) => {
          if(callback){
            callback(result);
          }
        }
      );
    });
  }

  // /******************* testing service ****************/
  // simplePackageCheckOut(providerId:number, userId:number, paymentAction:PaymentAction, callback?){
  //   if(!paymentAction){
  //     return;
  //   }
  //   console.log("simplePackageCheckOut.");
  //   this.aclService.s_getURL( (serviceUrl:string) => {
  //     this.httpUtil.s_call(
  //       "simplePackageCheckOut",  // objName
  //       serviceUrl + "simplePackageCheckOut/" + providerId + "/" + userId, //urlStr,
  //       "post", //method,
  //       paymentAction, //requestObj,
  //       null, //keyStr,
  //       null, //groupKeyStr,
  //       null, //ttl,
  //       (result:boolean) => {
  //         if(callback){
  //           callback(result);
  //         }
  //       }
  //     );
  //   });
  // }
}
