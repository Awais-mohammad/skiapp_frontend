import { Injectable } from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {UserInfo} from '../models/UserInfo';
import {ProviderContext} from '../models/transfer/ProviderContext';
import {AppConstants} from './app-constants.service';
declare function require(path: string): any;

@Injectable({
  providedIn: 'root'
})
export class UserSession {
  private user$:BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(null);
  private providerContext$:BehaviorSubject<ProviderContext> = new BehaviorSubject<ProviderContext>(null);
  private CryptoJS = require("crypto-js");

  constructor(private appConstants:AppConstants) { }


  public subscribeUser(callback:any):Subscription{
    if(!callback){
      return;
    }
    return this.user$.subscribe( (userInfo:UserInfo) => {
      callback(userInfo);
    });
  }

  public getSessionUser():UserInfo{
    let userInfo:UserInfo = this.user$.getValue();
    if(userInfo){
      return userInfo;
    }

    let encryptedText = window.localStorage.getItem(this.appConstants.SAVED_USER);
    if(!encryptedText || encryptedText.trim().length===0 || encryptedText.toLowerCase().indexOf("null".toLowerCase())>-1){
      window.localStorage.setItem(this.appConstants.SAVED_USER, null);
      return null;
    }
    // Decrypt
    let bytes  = this.CryptoJS.AES.decrypt(encryptedText.toString(), this.appConstants.CLIENT_ENCTYPT_KEY);
    let json = bytes.toString(this.CryptoJS.enc.Utf8);
    if(json.toLowerCase().indexOf("id".toLowerCase())<1){
      window.localStorage.setItem(this.appConstants.SAVED_USER, null);
      return null;
    }

    userInfo = JSON.parse(json);
    if(userInfo){
      this.user$.next(userInfo);
    }else{
      window.localStorage.setItem(this.appConstants.SAVED_USER, null);
    }
    return userInfo;
  }

  public setSessionUser(userInfo:UserInfo){
    let localUserInfo:UserInfo = this.getSessionUser();
    if(localUserInfo && userInfo){
      userInfo.token = localUserInfo.token;
    }

    // Encrypt
    if(userInfo){
      let encryptedObj = this.CryptoJS.AES.encrypt(JSON.stringify(userInfo), this.appConstants.CLIENT_ENCTYPT_KEY);
      let encryptedText = encryptedObj.toString();

      window.localStorage.setItem(this.appConstants.SAVED_USER, encryptedText);
    }else{
      window.localStorage.setItem(this.appConstants.SAVED_USER, null);
    }
    this.user$.next(userInfo);
  }

  public subscribeProviderContext(callback:any){
    if(!callback){
      return;
    }
    this.providerContext$.subscribe( (pContext:ProviderContext) => {
      callback(pContext);
    });
  }

  public getProviderContext():ProviderContext{
    let pContext:ProviderContext = this.providerContext$.getValue();
    if(pContext){
      return pContext;
    }

    let encryptedText = window.localStorage.getItem(this.appConstants.SAVED_PROVIDER_CONTEXT);
    if(!encryptedText || encryptedText.trim().length===0 || encryptedText.toLowerCase().indexOf("null".toLowerCase())>-1){
      return null;
    }
    // Decrypt
    let bytes  = this.CryptoJS.AES.decrypt(encryptedText.toString(), this.appConstants.CLIENT_ENCTYPT_KEY);
    let json = bytes.toString(this.CryptoJS.enc.Utf8);
    if(json.toLowerCase().indexOf("userId".toLowerCase())<1){
      return null;
    }

    pContext = JSON.parse(json);
    if(pContext){
      this.providerContext$.next(pContext);
    }
    return pContext;
  }

  public setProviderContext(pContext:ProviderContext){
    this.providerContext$.next(pContext);

    // Encrypt
    if(pContext){
      let encryptedObj = this.CryptoJS.AES.encrypt(JSON.stringify(pContext), this.appConstants.CLIENT_ENCTYPT_KEY);
      let encryptedText = encryptedObj.toString();

      window.localStorage.setItem(this.appConstants.SAVED_PROVIDER_CONTEXT, encryptedText);
    }else{
      window.localStorage.setItem(this.appConstants.SAVED_PROVIDER_CONTEXT, null);
    }
  }
}
