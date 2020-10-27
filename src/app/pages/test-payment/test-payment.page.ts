import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateUtil} from "../../services/translate-util.service";
import {UserService} from "../../services/user-service.service";
import {ToastUtil} from "../../services/toast-util.service";
import {PaymentService} from "../../services/payment-service.service";
import {AlertController, IonContent, IonRouterOutlet, LoadingController, ModalController} from "@ionic/angular";
import {AppConstants} from "../../services/app-constants.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {PaymentProcessUtil} from "../../services/coursePayment/payment-process-util.service";
import {Provider} from "../../models/Provider";
import {TimerUtil} from "../../utils/timer-util";
import {ProvidersService} from "../../services/providers-service.service";
import {Utils} from "../../services/utils.service";
import {ConfigureForClient} from "../../models/transfer/ConfigureForClient";
import {GeneralResponse} from "../../models/transfer/GeneralResponse";
import {PaymentAction} from "../../models/payment/PaymentAction";
import {AppSession} from "../../services/app-session.service";
import {CourseRegistrationInvoice} from "../../models/payment/coursePayment/CourseRegistrationInvoice";
import {BasicUserIdPage} from "../BasicUserIdPage";
import {CoursePaymentService} from "../../services/coursePayment/course-payment-service.service";
// declare function require(path: string): any;
import * as dropin from 'braintree-web-drop-in';

@Component({
  selector: 'app-test-payment',
  templateUrl: './test-payment.page.html',
  styleUrls: ['./test-payment.page.scss'],
})
export class TestPaymentPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  defaultProviderId:number = 1;
  defaultProvider:Provider = null;

  providerId:number = 4;
  provider:Provider = null;

  public initialBrainTree:boolean = false;
  payOnline = false;
  payOffline = false;

  callback:any = null;
  timerUtil:TimerUtil = null;
  notReady = true;
  finishedProcessing:boolean = false;
  cancelled:boolean = false;
  public initialLoading:any = null;
  public loading:any = null;

  testInvoiceId = 123456;

  constructor(public translateUtil:TranslateUtil, public userService:UserService, public toastUtil:ToastUtil,
              public paymentService:PaymentService, private alertCtrl:AlertController, public appConstants:AppConstants,
              private route: ActivatedRoute, router: Router, private providersService:ProvidersService, public utils:Utils,
              public modalController: ModalController, public ionRouterOutlet:IonRouterOutlet,
              private paymentProcessUtil:PaymentProcessUtil, public appSession:AppSession, public coursePaymentService:CoursePaymentService,
              private loadingCtrl:LoadingController,) {
    super(appSession, router, appConstants);

  }

  ngOnInit() {
    this.providersService.s_getProviderById(this.providerId, (provider:Provider) =>{
      this.provider = provider;
      this.payOnline = this.provider.payOnline;
      this.payOffline = this.provider.payOffline;

      if(!this.payOnline && !this.payOffline){
        this.utils.showOkAlert(this.alertCtrl, "Provider has not setup payment method yet.", null);
      }
    });
  }

  ionViewDidEnter(){
    if(this.provider.payOffline){
      this.preparePay();
    }else{
      this.appSession.getClientConfigure((clientConf:ConfigureForClient) => {
        this.utils.showAlertConfirm(
          this.alertCtrl,
          this.translateUtil.translateKey('You have ' + clientConf.InvoiceExpireMinutes +
            ' minutes to do the payment, or registration to course will be cancelled. Continue?'),
          null, null,
          this.translateUtil.translateKey('No'),
          () => {
            this.onClose();
          },
          this.translateUtil.translateKey('Yes'),
          (data) => {
            this.preparePay();
            console.log("this.appSession.clientConfigure.InvoiceExpireMinutes: " + clientConf.InvoiceExpireMinutes);
            this.timerUtil = new TimerUtil(this, clientConf.InvoiceExpireMinutes,
              this.l_checkingCallback, this.l_timeOutCallback);
          });
      });
    }
  }

  preparePay(){
    console.log("Good onPay().");
    this.l_initialPayment();
  }


  async l_initialPayment(){
    if(!this.payOnline){
      return;
    }

    let l_this = this;
    l_this.initialLoading = await l_this.loadingCtrl.create({
      message: this.translateUtil.translateKey('Loading...'),
      spinner: 'crescent',
      // duration: 2000
    });
    l_this.initialBrainTree = true;
    await l_this.initialLoading.present();

    this.paymentService.s_generateClientTokent(l_this.appSession.l_getUserId(), l_this.providerId, (generalResponse:GeneralResponse) => {
      if(l_this.initialLoading){
        l_this.initialLoading.dismiss();
      }

      if(!generalResponse){
        l_this.toastUtil.showToastTranslate("Get payment failed!");
        return;
      }
      if(generalResponse.code!==0){
        l_this.toastUtil.showToast(this.translateUtil.translateKey("Get payment failed: ") + generalResponse.message);
        return;
      }
      let clientTokent:string = generalResponse.resultObject;
      if(!clientTokent){
        l_this.toastUtil.showToastTranslate("Get payment failed, result is null!");
        return;
      }

      if(clientTokent){
        let button = document.querySelector('#payOnline-button');
        // let dropin = require('braintree-web-drop-in');
        let payAmount = 1234;
        // console.log("clientTokent: " + clientTokent);
        console.log("payment amount: " + payAmount);

        // For zero payment; auto send out;
        if(payAmount<=0){
          l_this.notReady = false;
          button.addEventListener('click', function () {
            console.log("payAmount: " + payAmount + ", no payment needed, send to processing.");
            let paymentAction = new PaymentAction();
            paymentAction.amount = payAmount;
            paymentAction.providerId = l_this.providerId;
            paymentAction.userId = l_this.appSession.l_getUserId();
            paymentAction.courseInvoiceId = l_this.testInvoiceId;
            paymentAction.statusId = l_this.appConstants.PAYMENT_WAIVED_ID;
            l_this.l_sendPayment(l_this, paymentAction);
          });
          return;
        }

        dropin.create({
          // authorization: 'CLIENT_AUTHORIZATION',
          authorization: clientTokent,
          container: '#dropin-container',
          env: "sandbox",
          card: {
            cardholderName: {required: true},
            // overrides: {
            //   styles: {
            //     input: {
            //       color: 'blue',
            //       'font-size': '9px'
            //     },
            //     '.number': {
            //       'font-family': 'monospace'
            //       // Custom web fonts are not supported. Only use system installed fonts.
            //     },
            //     '.invalid': {
            //       color: 'red'
            //     }
            //   }
            // }
          },
          paypal: {
            commit: true,
            intent: 'sale',
            flow: 'checkout', // Required, vault
            amount: payAmount, // Required
            currency: 'CAD', // Required
            displayName: 'Kapok-Tree store',

            // enableShippingAddress: true,
            // shippingAddressEditable: false,
            // shippingAddressOverride: {
            //   recipientName: 'Buyer03',
            //   line1: '1234 Main St.',
            //   line2: 'Unit 1',
            //   city: 'Chicago',
            //   countryCode: 'US',
            //   postalCode: '60652',
            //   state: 'IL',
            //   phone: '123.456.7890'
            // },
          },
        }, function (createErr, instance) {
          console.log("Inside create dropin.");

          l_this.initialBrainTree = false;
          if(l_this.initialLoading){
            l_this.initialLoading.dismiss();
          }

          l_this.l_scrollToId("dropin-container");

          // Stop if there was a problem creating the client.
          // This could happen if there is a network error or if the authorization
          // is invalid.
          if(createErr){
            console.log("createErr: " + createErr);
            if(createErr._braintreeWebError){
              console.log("createErr._braintreeWebError.message: " + createErr._braintreeWebError.message);
            }
            return;
          }
          if(!instance){
            return;
          }

          // for PayPal
          instance.on('paymentMethodRequestable', function (event) {
            console.log(event.type); // The type of Payment Method, e.g 'CreditCard', 'PayPalAccount'.
            if(event.type && event.type==='CreditCard'){
              console.log("CreditCard, wait for user click button.");
              l_this.notReady = false;
              l_this.l_scrollToId("payNow-button");
              return;
            }else{
              console.log(event.paymentMethodIsSelected); // True if a customer has selected a payment method when paymentMethodRequestable fires.
              console.log("process dropin Paypal checkout.");
              l_this.l_processPaymentOnServer(instance, payAmount, l_this);
            }
          });
          instance.on('noPaymentMethodRequestable', function () {
            l_this.notReady = true;
          });

          // For VISA;
          button.addEventListener('click', function () {
            console.log("Here is to submit request to server.");
            l_this.l_processPaymentOnServer(instance, payAmount, l_this);
          });
        });
      }
    });
  }

  async l_processPaymentOnServer(instance, amount, l_this){
    l_this.onProcessing = true;
    l_this.timerUtil.stop(l_this.timerUtil);
    // l_this.timerUtil = null;

    // block page here;
    // if(!this.loading){
    l_this.loading = await l_this.loadingCtrl.create({
      message: this.translateUtil.translateKey('Processing...'),
      spinner: 'crescent',
      // duration: 2000
    });
    await l_this.loading.present();


    console.log("Before requestPaymentMethod.");
    instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {
      console.log("Get back requestPaymentMethod.");
      if(requestPaymentMethodErr){
        l_this.toastUtil.showToast(requestPaymentMethodErr);
        if(l_this.loading) {
          l_this.loading.dismiss();
        }
        return;
      }
      // Submit payload.nonce to your server
      console.log("payload.nonce: " + (payload?payload.nonce:"null payload!"));
      if(payload && payload.nonce){
        let payAmount = 1234;
        let paymentAction = new PaymentAction();
        paymentAction.amount = payAmount;
        paymentAction.providerId = l_this.providerId;
        paymentAction.userId = l_this.appSession.l_getUserId();
        paymentAction.paymentNonce = payload.nonce;
        paymentAction.courseInvoiceId = l_this.testInvoiceId;
        paymentAction.statusId = l_this.appConstants.PAYMENT_TOPAY_ONLINE_ID;
        l_this.l_sendPayment(l_this, paymentAction);
      }else{
        if(l_this.loading) {
          l_this.loading.dismiss();
        }
        l_this.toastUtil.showToast("Can not find payment method!");
        l_this.onClose();
      }
    });
  }

  l_sendPayment(l_this, paymentAction:PaymentAction){
    if(!paymentAction.statusId){
      this.toastUtil.showToastTranslate("PaymentAction must have status!");
      console.log("PaymentAction must have status!");
      // return;
    }

    l_this.coursePaymentService.simpleCheckOut(l_this.providerId, l_this.appSession.l_getUserId(), paymentAction, (genResponse:GeneralResponse) => {
      if(l_this.loading) {
        l_this.loading.dismiss();
      }

      l_this.onProcessing = false;
      l_this.finishedProcessing = true;

      if(genResponse && genResponse.code===0){
        l_this.toastUtil.showToastTranslate("Checkout succeed. Please check you confirmation email.", 5000);

        let transactionId:string = genResponse.resultObject;
        console.log("transactionId: " + transactionId);
      }else{
        l_this.utils.showOkAlert(this.alertCtrl, l_this.translateUtil.translateKey("Checkout failed!"), (genResponse==null?"":genResponse.message));

      }
    });
  }


  l_checkingCallback(context_this:any){
    console.log("Good l_checkingCallback.");
  }

  l_timeOutCallback(context_this:any){
    console.log("Good l_timeOutCallback.");
  }

  l_scrollToId(id:string):boolean{
    console.log("l_scrollToId, id: " + id);
    let element = document.getElementById(id);
    if(!element){
      return false;
    }
    let yOffset = document.getElementById(id).offsetTop;
    console.log("scrollX: " + yOffset);

    setTimeout(
      () => {
        this.content.scrollByPoint(0, yOffset, 100);
      },
      300
    );
    return true;
  }

  onPayOffline(){
    console.log('Good onPayOffline().');
  }

  onClose(){
    console.log('Good onClose().');
  }
}
