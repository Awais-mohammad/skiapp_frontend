import {InvoiceCalculation} from "../invoice/InvoiceCalculation";

export class CourseRegistrationInvoice {
  id:number;
  registrationId:number;
  amount:number;
  invoiceDate:any;
  statusId:number;
  createdDate:any;
  lastUpdatedDate:any;
  comments:string;
  studentCount:number;
  statusName:string;

  invoiceCalculationId:number;
  invoiceCalculation:InvoiceCalculation;

  packageInvoiceId:number;

  // already alerted on the payment details page;
  alerted:boolean = false;

  constructor(
  ){}
}
