import { Injectable } from '@angular/core';
import {AppConstants} from './app-constants.service';
import {Utils} from './utils.service';
import {ToastUtil} from './toast-util.service';
import {HttpUtil} from './http-util.service';
import {TranslateUtil} from './translate-util.service';
import {ACLUser} from '../models/transfer/RegisterUser';
import {UserInfo} from '../models/UserInfo';
import {GeneralResponse} from '../models/transfer/GeneralResponse';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ACLService {

  constructor(private appConstants:AppConstants, public utils:Utils, private toastUtil:ToastUtil,
              private httpUtil:HttpUtil, public translateUtil:TranslateUtil, private alertCtl:AlertController) {
  }
  
  s_getURL(callback?){
  if(callback){
    callback(this.appConstants.INITIAL_SERVICE_URL);
  }
}

  s_getJSONFromPress(press:string, callback?){
    if(!press){
      if(callback){
        callback(null);
      }
      return;
    }
    console.log("getJSONFromPress.");
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
        "getJSONFromPress",  // objName
        serviceUrl + "getJSONFromPress", //urlStr,
        "post", //method,
        press, //requestObj,
        null, //keyStr,
        null, //groupKeyStr,
        null, //ttl,
        (json:string) => {
          if(callback){
            callback(json);
          }
        }
      );
    });
  }

  /**
   * ACL Register UserInfo;
   */
  s_RegisterUser(registerUser:ACLUser, callback?){
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
          "register user",  // objName
          serviceUrl + "registerUser", //urlStr,
          "post", //method,
          registerUser, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (userInfo:UserInfo) => {
            if(callback){
              callback(userInfo);
            }
          }
      );
    });
  }

  /**
   * This method should only be used by AppSession.
   */
  s_LoginUser(loginUser:ACLUser, callback?){
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
          "login user",  // objName
          serviceUrl + "loginUser", //urlStr,
          "post", //method,
          loginUser, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (userInfo:UserInfo) => {
            userInfo = this.l_updateLogin(userInfo);
            if(callback){
              callback(userInfo);
            }
          }
      );
    });
  }

  /**
   * This method should only be used by AppSession.
   */
  l_updateLogin(userInfo:UserInfo){
    if(userInfo){
      userInfo = this.utils.replaceIconUrl(userInfo);
      userInfo = this.translateUtil.translateUserFields(userInfo);

      let token = userInfo.token;
      // console.log("token: " + token);
      if(!token || token.indexOf("--")<=0){
        // console.log("Wrong token!");
        return null;
      }

      let fields = token.split("--");
      if(!fields || fields.length<2) {
        // console.log("Wrong token!");
        return null;
      }
      return userInfo;
    }else{
      return null;
    }
  }

  // l_setSorageUserInfo(userInfo:UserInfo, callback?){
  //   console.log("update session user$ 03.");
  //   this.appSession.user$.next(userInfo);
  //   this.storage.set(this.appConstants.SAVED_USER, userInfo).then(() => {
  //     if(callback){
  //       callback(userInfo);
  //     }
  //     return;
  //   });
  // }

  /**
   * This method should only be used by AppSession.
   * ACL Logout UserInfo;
   * "/logoutUser/:userId"
   */
  s_LogoutUser(callback?){
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
          "login user",  // objName
          serviceUrl + "logoutUser", //urlStr,
          "post", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (result:boolean) => {
            if(callback){
              callback(result);
            }
            return;
          }
      );
    });
  }

  /**
   * Check email address in use;
   */
  s_checkEmailExist(email:string, callback?){
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
          "check email used",  // objName
          serviceUrl + "checkEmailExist/" + email, //urlStr,
          "post", //method,
          null, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (exists:boolean) => {
            if(callback){
              callback(exists);
            }
          }
      );
    });
  }

  /**
   * Reset password;
   */
  s_resetPassword(email:string, callback?){
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
          "reset password",  // objName
          serviceUrl + "resetPassword/" + email, //urlStr,
          "post", //method,
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

  /**
   * Reset password;
   * put "/updatePassword/:userId/:currentPassword/:newPassword"
   */
  s_updatePassword(userId:number, currentPassword:string, newPassword:string, callback?){
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
          "save password",  // objName
          serviceUrl + "updatePassword/" + userId + "/" + currentPassword + "/" + newPassword, //urlStr,
          "put", //method,
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

  /**
   * ACL Register UserInfo;
   */
  s_confirmEmail(press:string, callback?){
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
          "register user",  // objName
          serviceUrl + "confirmEmail", //urlStr,
          "post", //method,
          press, //requestObj,
          null, //keyStr,
          null, //groupKeyStr,
          null, //ttl,
          (response:GeneralResponse) => {
            if(callback){
              callback(response);
            }
          }
      );
    });
  }

  /**
   * Check ACL for service function;
   */
  s_checkACL(userId:number, nameList:string[], callback?){
    this.s_getURL( (serviceUrl:string) => {
      this.httpUtil.s_call(
          "check ACL",  // objName
          serviceUrl + "checkUserACL/" + userId, //urlStr,
          "post", //method,
          nameList, //requestObj,
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
