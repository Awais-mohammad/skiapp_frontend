import {Component, OnInit, ViewChild} from '@angular/core';
import {PaymentService} from "../../services/payment-service.service";
import {BasicUserIdPage} from "../BasicUserIdPage";
import {
  ActionSheetController,
  AlertController,
  IonContent, IonRouterOutlet,
  LoadingController,
  ModalController,
  NavController
} from "@ionic/angular";
import {Provider} from "../../models/Provider";
import {TimerUtil} from "../../utils/timer-util";
import {PackageRegistrationInvoice} from "../../models/payment/coursePayment/PackageRegistrationInvoice";
import {AppSession} from "../../services/app-session.service";
import {ProvidersService} from "../../services/providers-service.service";
import {Utils} from "../../services/utils.service";
import {TranslateUtil} from "../../services/translate-util.service";
import {UserService} from "../../services/user-service.service";
import {ToastUtil} from "../../services/toast-util.service";
import {AppConstants} from "../../services/app-constants.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {PaymentProcessUtil} from "../../services/coursePayment/payment-process-util.service";
import {PackagePaymentService} from "../../services/coursePayment/package-payment.service";
import {ConfigureForClient} from "../../models/transfer/ConfigureForClient";
import {PaymentAction} from "../../models/payment/PaymentAction";
import {GeneralResponse} from "../../models/transfer/GeneralResponse";
import * as dropin from 'braintree-web-drop-in';

@Component({
  selector: 'app-package-payment-details',
  templateUrl: './package-payment-details.page.html',
  styleUrls: ['./package-payment-details.page.scss'],

  providers: [
    PaymentService,
  ],
})
export class PackagePaymentDetailsPage extends BasicUserIdPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  private actionSheet:any;
  private myModal:any;

  providerId:number;
  provider:Provider = null;
  packageInvoice:PackageRegistrationInvoice = null;

  payOnline = false;
  payOffline = false;

  callback:any = null;
  timerUtil:TimerUtil = null;
  notReady = true;
  finishedProcessing:boolean = false;
  cancelled:boolean = false;

  public initialBrainTree:boolean = false;
  public initialLoading:any = null;
  public loading:any = null;

  packageRegistrationId = null;

  constructor(private navCtrl: NavController, appSession:AppSession, private loadingCtrl:LoadingController,
              public providersService:ProvidersService, public utils:Utils, public packagePaymentService:PackagePaymentService,
              public translateUtil:TranslateUtil, public userService:UserService, public toastUtil:ToastUtil,
              private actionsheetCtrl: ActionSheetController, public paymentService:PaymentService, public modalCtrl: ModalController,
              private alertCtrl:AlertController, public appConstants:AppConstants, private route: ActivatedRoute, router: Router,
              public modalController: ModalController, public ionRouterOutlet:IonRouterOutlet, private paymentProcessUtil:PaymentProcessUtil) {
    super(appSession, router, appConstants);
    super.l_checkUserId();

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.providerId = this.router.getCurrentNavigation().extras.state.providerId;
        this.packageInvoice = this.router.getCurrentNavigation().extras.state.packageInvoice;
      }
    });

  }

  ngOnInit() {
    if(!this.providerId){
      this.providerId = +this.route.snapshot.paramMap.get('providerId');
    }
  }

  ionViewWillEnter() {
    if (!this.providerId || !this.packageInvoice) {
      console.log("Empty parameters!");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    } else {
      this.providersService.s_getProviderById(this.providerId, (provider: Provider) => {
        this.provider = provider;
        this.payOnline = this.provider.payOnline;
        this.payOffline = this.provider.payOffline;

        if (!this.payOnline && !this.payOffline) {
          this.utils.showOkAlert(this.alertCtrl, "Provider has not setup payment method yet.", null);
        }

        this.updatePageContent();
      });
    }
  }

  updatePageContent(){
    if(!this.packageInvoice){
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
    if(this.packageInvoice && this.packageInvoice.total>0){
      if(this.packageInvoice.statusId===this.appConstants.PAYMENT_UNPAID_ID ||
        this.packageInvoice.statusId===this.appConstants.PAYMENT_TOPAY_OFFLINE_ID ||
        this.packageInvoice.statusId===this.appConstants.PAYMENT_TOPAY_ONLINE_ID) {

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
    }else{
      console.log("No current invoice.");
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  ionViewCanLeave(){
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
    if(this.myModal){
      this.myModal.dismiss();
    }
    if(this.initialLoading){
      this.initialBrainTree = false;
      this.initialLoading.dismiss();
    }
    if(this.loading){
      this.loading.dismiss();
    }

    if(!this.packageInvoice ||
      this.packageInvoice.statusId!==this.appConstants.PAYMENT_UNPAID_ID ||
      // this.invoice.statusId!=this.appConstants.PAYMENT_OFFLINE_ID) ||
      this.packageInvoice.total===0 ||
      this.finishedProcessing || this.cancelled){
      return true;
    }
    if(this.packageInvoice){
      this.onCancelPayment();
    }

    return false;
  }


  l_checkingCallback(context_this:any){
    console.log("Good l_checkingCallback.");
    if(!context_this.invoice || !context_this.invoice.id){
      context_this.invoice = null;
      context_this.timerUtil.stop(context_this.timerUtil);
      // context_this.timerUtil = null;
      context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
      return;
    }
  }

  l_timeOutCallback(context_this:any){
    console.log("Good l_timeOutCallback.");
    context_this.timerUtil.stop(context_this.timerUtil);
    // context_this.timerUtil = null;

    if(!context_this.invoice){
      context_this.router.navigate([context_this.appConstants.ROOT_PAGE]);
      return;
    }
  }

  onClose(){
    if(this.packageInvoice && this.paymentProcessUtil.isCourseRequirePayment(this.packageInvoice.statusId)){
      this.utils.showAlertConfirm(this.alertCtrl, "Are you sure to cancel the registration and payment?", null, null, "No", null, "Yes",
        (data) => {
          console.log("Cancel payment from client.");
          this.l_cancalPayment();
          this.l_close();
        }
      );
    }else{
      this.l_close();
    }
  }

  l_close(){
    if(this.ionRouterOutlet.canGoBack()){
      this.navCtrl.pop();
    }else{
      this.router.navigate([this.appConstants.ROOT_PAGE]);
    }
  }

  onScrollUp(){
    setTimeout(
      () => {
        this.content.scrollToTop(300);
      },
      10
    );
  }

  l_cancalPayment(){
    console.log("Cancel payment from client.");
    this.packagePaymentService.cancelPackagePaymentByClient(this.providerId, this.appSession.l_getUserId(), this.packageInvoice.id, (result: boolean) => {
      if (result) {
        this.toastUtil.showToastTranslate("Payment cancelled.");
      } else {
        this.toastUtil.showToastTranslate("Payment cancelling failed.");
      }
      this.packageInvoice = null;
    });
    this.cancelled = true;
  }

  onPayOffline(){
    console.log("Good onPayOffline().");
    if(!this.payOffline){
      this.utils.showOkAlert(this.alertCtrl, "Current provider does not accept pay offline.", null);
    }

    let payAmount = this.packageInvoice.total;
    console.log("payAmount: " + payAmount + ", no payment needed, send to processing.");
    let paymentAction = new PaymentAction();
    paymentAction.providerId = this.providerId;
    paymentAction.userId = this.appSession.l_getUserId();
    paymentAction.packageInvoiceId = this.packageInvoice.id;
    paymentAction.statusId = this.appConstants.PAYMENT_TOPAY_OFFLINE_ID;
    this.l_sendPayment(this, paymentAction);

    if(!this.packageInvoice.alerted){
      this.utils.showOkAlert(this.alertCtrl, this.translateUtil.translateKey("Success"),
        this.translateUtil.translateKey("Course registered successfully. Check your confirmation email for details."));
      this.packageInvoice.alerted = true;
    }
  }

  preparePay(){
    console.log("Good onPay().");
    this.l_initialPayment();
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
      if(l_this.loading){
        l_this.loading.dismiss();
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
        let payAmount = l_this.packageInvoice.total;
        // console.log("clientTokent: " + clientTokent);
        console.log("payment amount: " + payAmount);

        // For zero payment; auto send out;
        if(payAmount<=0){
          l_this.notReady = false;
          button.addEventListener('click', function () {
            console.log("payAmount: " + payAmount + ", no payment needed, send to processing.");
            let paymentAction = new PaymentAction();
            paymentAction.providerId = l_this.providerId;
            paymentAction.userId = l_this.appSession.l_getUserId();
            paymentAction.packageInvoiceId = l_this.packageInvoice.id;
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

        let paymentAction = new PaymentAction();
        paymentAction.amount = l_this.packageInvoice.total;
        paymentAction.providerId = l_this.providerId;
        paymentAction.userId = l_this.appSession.l_getUserId();
        paymentAction.paymentNonce = payload.nonce;
        paymentAction.packageInvoiceId = l_this.packageInvoice.id;
        paymentAction.statusId = l_this.appConstants.PAYMENT_TOPAY_ONLINE_ID;
        l_this.l_sendPayment(l_this, paymentAction);
      }else{
        if(l_this.loading) {
          l_this.loading.dismiss();
        }
        l_this.invoice.statusId = l_this.appConstants.PAYMENT_FAILED_ID;
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

    if(!l_this.packageInvoice){
      l_this.toastUtil.showToastTranslate("Can not find invoice!");
      return;
    }

    l_this.packageRegistrationId = l_this.packageInvoice.packageRegistrationId;
    l_this.packagePaymentService.packageCheckOut(l_this.providerId, l_this.appSession.l_getUserId(), paymentAction, (genResponse:GeneralResponse) => {
      if(l_this.loading) {
        l_this.loading.dismiss();
      }

      l_this.onProcessing = false;
      l_this.finishedProcessing = true;

      if(l_this.packageInvoice){
        l_this.packageInvoice = null;
      }

      if(genResponse && genResponse.code===0){
        let transactionId:string = genResponse.resultObject;
        console.log("transactionId: " + transactionId);
        l_this.toastUtil.showToastTranslate("Checkout succeed. Please check you confirmation email.", 5000);
        if(l_this.appSession.l_getUserId()){
          let navigationExtras: NavigationExtras = {
            state: {
              packageRegistrationId:l_this.packageRegistrationId,
              providerId:l_this.providerId,
              showBackBtn: -1,
            }
          };
          l_this.router.navigate(['course-package-registration-details'], navigationExtras);
        }else{
          l_this.router.navigate([l_this.appConstants.ROOT_PAGE]);
        }
      }else{
        l_this.utils.showOkAlert(this.alertCtrl, l_this.translateUtil.translateKey("Checkout failed!"), (genResponse==null?"":genResponse.message));
        l_this.onClose();
      }
    });
  }

  onCancelPayment(){
    if(!this.packageInvoice){
      this.onClose();
      return;
    }

    console.log("Good onCancelPayment.");
    this.utils.showAlertConfirm(this.alertCtrl, this.translateUtil.translateKey('Are you sure to cancel the payment and registration?'), null, null,
      this.translateUtil.translateKey('No'), null, this.translateUtil.translateKey('Yes'),
      (data) => {
        console.log("Cancel payment from client.");
        this.l_cancalPayment();
        this.l_close();
      }
    );
  }
}
