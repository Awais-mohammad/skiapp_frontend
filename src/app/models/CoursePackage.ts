import {Course} from "./Course";

export class CoursePackage {
  public id: number;
  providerId:number;
  name:string;
  description:string;
  iconId:number;
  allowCourseSelection:boolean;
  enabled:boolean;
  createdDate:any;
  lastUpdatedDate:any;
  courses:Course[];

  hide:boolean;

  constructor(){}
}
