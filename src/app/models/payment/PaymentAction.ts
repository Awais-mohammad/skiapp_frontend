export class PaymentAction {
  id:number;
  providerId:number;
  userId:number;
  courseInvoiceId:number;
  packageInvoiceId:number;
  membershipInvoiceId:number;
  paymentNonce:string;
  message:string;
  statusId:number;
  prePaymentId:number;

  amount:number;
  title:string;

  constructor(
  ){}
}
