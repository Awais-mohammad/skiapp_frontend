import { Injectable } from '@angular/core';
import {ACLService} from "./aclservice.service";
import {AppConstants} from "./app-constants.service";
import {HttpUtil} from "./http-util.service";
import {CoursePackage} from "../models/CoursePackage";
import {GeneralResponse} from "../models/transfer/GeneralResponse";
import {PackageCourseRegistration} from "../models/PackageCourseRegistration";
import {CourseRegistrationInvoice} from "../models/payment/coursePayment/CourseRegistrationInvoice";
import {NavigationExtras} from "@angular/router";
import {PackageRegistrationInvoice} from "../models/payment/coursePayment/PackageRegistrationInvoice";

@Injectable({
  providedIn: 'root'
})
export class CoursePackageService {

  constructor(private appConstants:AppConstants, private aclService:ACLService, private httpUtil:HttpUtil, ) { }

  getPackageRegistrationsByUserId(userId:number, callback?) {
    console.log("getPackageRegistrationsByUserId.");
    if(!userId ){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getURL( (serviceUrl:string) => {
      let url = serviceUrl + "getPackageRegistrationsByUserId/" + userId;
      this.httpUtil.s_call(
        "getPackageRegistrationsByUserId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (pkgRegistrations:PackageCourseRegistration[]) => {
          if(callback){
            callback(pkgRegistrations);
          }
        }
      );
    });
  }

  getPackageRegistrationsByProviderId(providerId:number, callback?) {
    console.log("getPackageRegistrationsByProviderId.");
    if(!providerId ){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getURL( (serviceUrl:string) => {
      let url = serviceUrl + "getPackageRegistrationsByProviderId/" + providerId;
      this.httpUtil.s_call(
        "getPackageRegistrationsByProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (pkgRegistrations:PackageCourseRegistration[]) => {
          if(callback){
            callback(pkgRegistrations);
          }
        }
      );
    });
  }

  registerPackageRegistration(userId:number, registration:PackageCourseRegistration, callback?) {
    if(!registration){
      if(callback){
        callback(null);
      }
      return;
    }
    if(!userId){
      userId = -1;
    }

    console.log("registerPackageRegistration.");
    this.aclService.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
        "registerPackageRegistration",  // objName
        serviceUrl + "registerPackageRegistration/" + userId, //urlStr,
        "put", //method,
        registration, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (regResponse:GeneralResponse) => {
          if(regResponse && regResponse.resultObject){
            let packageInvoice:PackageRegistrationInvoice = regResponse.resultObject;
            console.log("Got back package registration invoice.");
          }
          if(callback){
            callback(regResponse);
          }
        }
      );
    });
  }

  getPackageRegistrationDetailsById(packageRegistrationId:number, callback?) {
    console.log("getPackageRegistrationDetailsById.");
    if(!packageRegistrationId ){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getURL( (serviceUrl:string) => {
      let url = serviceUrl + "getPackageRegistrationDetailsById/" + packageRegistrationId;
      this.httpUtil.s_call(
        "getPackageRegistrationDetailsById",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (pkgRegistration:PackageCourseRegistration) => {
          if(callback){
            callback(pkgRegistration);
          }
        }
      );
    });
  }

  // "/getCoursePackageWithDetails/:coursePackageId"
  getCoursePackageWithDetails(coursePackageId:number, callback?) {
    console.log("getCoursePackageWithDetails.");
    if(!coursePackageId ){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getURL( (serviceUrl:string) => {
      let url = serviceUrl + "getCoursePackageWithDetails/" + coursePackageId;
      this.httpUtil.s_call(
        "getCoursePackageWithDetails",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (pkg:CoursePackage) => {
          if(callback){
            callback(pkg);
          }
        }
      );
    });
  }

  // "/getPackagesForProviderId/:providerId"
  getPackagesForProviderId(providerId:number, callback?) {
    console.log("getPackagesForProviderId.");
    if(!providerId ){
      if(callback){
        callback(null);
      }
    }
    this.aclService.s_getURL( (serviceUrl:string) => {
      let url = serviceUrl + "getPackagesForProviderId/" + providerId;
      this.httpUtil.s_call(
        "getPackagesForProviderId",  // objName
        url, //urlStr,
        "get", //method,
        null, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (pkgs:CoursePackage[]) => {
          if(callback){
            callback(pkgs);
          }
        }
      );
    });
  }

  saveCoursePackage(userId:number, pkg:CoursePackage, callback?){
    if(!pkg){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
        "saveCoursePackage",  // objName
        serviceUrl + "saveCoursePackage/" + userId, //urlStr,
        "put", //method,
        pkg, //requestObj,
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

  // "/addCoursesForPackage/:userId/:coursePackageId"
  addCoursesForPackage(userId:number, coursePackageId:number, courseIds:number[], callback?){
    if(!coursePackageId || !courseIds || courseIds.length===0){
      if(callback){
        callback(false);
      }
      return;
    }

    this.aclService.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
        "addCoursesForPackage",  // objName
        serviceUrl + "addCoursesForPackage/" + userId + "/" + coursePackageId, //urlStr,
        "put", //method,
        courseIds, //requestObj,
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

  deleteCourseForPackage(userId:number, coursePackageId:number, courseId:number, callback?){
    if(!userId || !coursePackageId || !courseId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteCourseForPackage",  // objName
        serviceUrl + "deleteCourseForPackage/" + userId + "/" + coursePackageId + "/" + courseId, //urlStr,
        "delete", //method,
        null, //requestObj,
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

  // "/deleteCoursePackage/:userId/:coursePackageId"
  deleteCoursePackage(userId:number, coursePackageId:number, callback?){
    if(!userId || !coursePackageId){
      if(callback){
        callback(null);
      }
      return;
    }

    this.aclService.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
        "deleteCoursePackage",  // objName
        serviceUrl + "deleteCoursePackage/" + userId + "/" + coursePackageId, //urlStr,
        "delete", //method,
        null, //requestObj,
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
}
