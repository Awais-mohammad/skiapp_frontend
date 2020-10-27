import { Injectable } from '@angular/core';
import {UserInfo} from '../models/UserInfo';
import {ProviderContext} from '../models/transfer/ProviderContext';
import {ConfigureForClient} from '../models/transfer/ConfigureForClient';
import {ACLUser} from '../models/transfer/RegisterUser';
import {UserSession} from './user-session.service';
import {AppConstants} from './app-constants.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Page} from '../models/client/page';
import {ACLService} from './aclservice.service';
import {UserService} from './user-service.service';
import {ProvidersService} from './providers-service.service';

@Injectable({
  providedIn: 'root'
})
export class AppSession {
  public requiredAppVersion;
  public clientConfigure:ConfigureForClient = null;

  private networkConnected$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public pages: Array<Page>;

  public shownAvailableAler:boolean = false;

  constructor(public appConstants:AppConstants, private userService:UserService,
              private providerService:ProvidersService, private aclService:ACLService, private userSession:UserSession) {

  }


  public subscribeUser(callback:any):Subscription{
    if(!callback){
      return;
    }
    return this.userSession.subscribeUser( (userInfo:UserInfo) => {
      callback(userInfo);
    });
  }

  public getClientConfigure(callback?):ConfigureForClient{
    if(this.clientConfigure && this.clientConfigure.fromServer){
      if(callback){
        callback(this.clientConfigure);
      }
      return this.clientConfigure;
    }
    this.userService.s_getClientConfigure((clientConf:ConfigureForClient) => {
      if(!clientConf){
        console.log("Failed get client configure. Using default values for client!");
        this.clientConfigure = new ConfigureForClient();
        if(callback){
          callback(this.clientConfigure);
        }
      }else{
        this.clientConfigure = clientConf;
        this.clientConfigure.fromServer = true;
        if(callback){
          callback(this.clientConfigure);
        }
      }
    });
    return this.clientConfigure;
  }

  public loginUser(aclUser:ACLUser, callback?){
    this.aclService.s_LoginUser(aclUser, (userInfo:UserInfo) => {
      this.userSession.setSessionUser(userInfo);
      if(callback){
        callback(userInfo);
      }
    });
  }

  public logoutUser(callback?){
    this.aclService.s_LogoutUser((result:boolean) => {
      this.userSession.setSessionUser(null);
      this.userSession.setProviderContext(null);
      if(callback){
        callback(result);
      }
    });
  }

  public updateNetwork(status:boolean){
    this.networkConnected$.next(status);
  }

  public subscribeNetwork(callback){
    this.networkConnected$.subscribe((status:boolean) => {
      if(callback){
        callback(status);
      }
    });
  }

  public saveUserInfo(userInfo:UserInfo, callback?){
    this.userService.s_saveUser(userInfo, (savedInfo:UserInfo) => {
      this.userSession.setSessionUser(savedInfo);
      if(callback){
        callback(savedInfo);
      }
    });
  }

  /**
   * Initial method;
   * FreshOnly will always return null, need to provide callbacks!!
   */
  public checkProviderContext(refreshOnly:boolean, providerId:number, success?, failure?):ProviderContext{
    if(!this.userSession.getSessionUser() || !providerId || providerId<=0){
      if(failure){
        failure(null);
      }
      return null;
    }

    if(refreshOnly){
      this.loadProviderContext(this.userSession.getSessionUser().id, providerId, success, failure);
      return null;
    }

    let providerContext = this.userSession.getProviderContext();
    if(providerContext && providerContext.providerId===providerId){
      if(success){
        success(providerContext);
      }
      return providerContext;
    }else{
      this.loadProviderContext(this.userSession.getSessionUser().id, providerId, success, failure);
      return null;
    }
  }

  private loadProviderContext(userId:number, providerId:number, success, failure){
    // Get from server side if storage is empty;
    this.providerService.s_getProviderContextForUserId(providerId, userId, (serverContext:ProviderContext) => {
      if(serverContext && serverContext.providerId){
        this.userSession.setProviderContext(serverContext);
        if(success){
          success(serverContext);
        }
      }else{
        this.userSession.setProviderContext(null);
        if(failure){
          failure(null);
        }
      }
    });
  }

  public l_setProviderContext(pContext:ProviderContext){
    this.userSession.setProviderContext(pContext);
  }

  public l_getProviderContext():ProviderContext{
    return this.userSession.getProviderContext();
  }

  public l_setSessionUser(userInfo:UserInfo){
    this.userSession.setSessionUser(userInfo);
  }

  public l_hasAboveInstructorAccess(providerId:number):boolean{
    if(!providerId){
      return false;
    }
    let userId = this.l_getUserId();
    if(!userId || userId<=0){
      return false;
    }
    let userInfo = this.userSession.getSessionUser();
    let pContext = this.userSession.getProviderContext();
    if(this.l_isSiteAdmin() || this.l_isAdministrator(providerId) || this.l_isInstructor(providerId) ){
      return true;
    }else{
      return false;
    }
  }

  public l_isSiteAdmin():boolean {
    let userInfo = this.userSession.getSessionUser();
    if(userInfo && userInfo.isSiteAdmin){
      return true;
    }else{
      return false;
    }
  }

  public l_getUserId():number{
    let userInfo = this.userSession.getSessionUser();
    if(userInfo && userInfo.id){
      return userInfo.id;
    }
    return null;
  }

  public l_getUserInfo():UserInfo{
    return this.userSession.getSessionUser();
  }

  public l_isAdministrator(providerId:number):boolean {
    if(!this.userSession.getSessionUser() || !providerId ){
      return false;
    }
    let pContext = this.userSession.getProviderContext();
    if(pContext && pContext.providerId===providerId && pContext.adminUserId){
      return true;
    }else{
      return false;
    }
  }

  public l_isInstructor(providerId:number):boolean {
    if(!this.userSession.getSessionUser() || !providerId ){
      return false;
    }
    let pContext = this.userSession.getProviderContext();
    if(pContext && pContext.providerId===providerId && pContext.instructorId){
      return true;
    }else{
      return false;
    }
  }

  public l_getInstructorId(providerId:number):number{
    if(!providerId){
      return null;
    }
    let pContext = this.userSession.getProviderContext();
    if(pContext && pContext.providerId===providerId && pContext.instructorId){
      return pContext.instructorId;
    }else{
      return null;
    }
  }

  public l_isMember(providerId:number):boolean {
    if(!this.userSession.getSessionUser() || !providerId ){
      return false;
    }
    let pContext = this.userSession.getProviderContext();
    if(pContext && pContext.providerId===providerId && pContext.memberId){
      return true;
    }else{
      return false;
    }
  }

  public l_getMemberId(providerId:number){
    if(!providerId){
      return null;
    }
    let pContext = this.userSession.getProviderContext();
    if(pContext && pContext.providerId===providerId && pContext.memberId){
      return pContext.memberId;
    }else{
      return null;
    }
  }

  public l_hasCurrentProviderAccount(providerId:number):boolean {
    if(!this.userSession.getSessionUser() || !providerId){
      return false;
    }
    if(!providerId){
      return null;
    }
    let pContext = this.userSession.getProviderContext();
    // if(pContext && pContext.providerId==providerId && (pContext.adminUserId>0 || pContext.instructorId>0 || pContext.memberId>0)){
    // For Chinese club only for now, all are members;
    if(pContext && pContext.providerId===providerId){
      return true;
    }else{
      return false;
    }
  }
}
