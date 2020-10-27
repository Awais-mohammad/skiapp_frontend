import { Injectable } from '@angular/core';
import {AppConstants} from '../app-constants.service';
import {Utils} from '../utils.service';
import {AppSession} from '../app-session.service';
import {HttpUtil} from '../http-util.service';
import {AppConfiguration} from '../../models/admin/AppConfiguration';


@Injectable()
export class AdminConfigureService {

  constructor(private appConstants:AppConstants, private utils:Utils,
              public appSession:AppSession, private httpUtil:HttpUtil) {
    console.log('Hello GroupService Provider');
  }

  s_getAppConfiguration(callback?){
  }

  s_saveAppConfigure(appConfigure:AppConfiguration, callback?){
  }
}
