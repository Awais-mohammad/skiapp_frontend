import {InvoiceCalculation} from "../invoice/InvoiceCalculation";
import {CourseRegistrationInvoice} from "./CourseRegistrationInvoice";

export class PackageRegistrationInvoice {
  id:number;
  providerId:number;
  packageId:number;
  name:string;
  notes:string;
  total:number;
  invoiceDate:any;
  statusId:number;
  createdDate:any;
  lastUpdatedDate:any;

  courseRegistrationInvoices:CourseRegistrationInvoice[];

  statusName:string;
  alerted:boolean;

  constructor(
  ){}
}
