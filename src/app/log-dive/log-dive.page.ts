import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';

import * as CryptoJS from 'crypto-js';  
import { UUID } from 'angular2-uuid';


export interface DiveType{
  diveType : string ;
}

export interface DiveSite{
  diveSite: string;
}

export interface DiveLog{
  DiveID : string; 
  AccessToken: string ; 
  Approved: boolean;
  DiveDate: string;
  TimeIn: string;
  TimeOut: string;
  Visibility:string;
  Depth: string;
  Buddy:string;
  DiveTypeLink: string;
  AirTemp: number;
  SurfaceTemp: number;
  BottomTemp: number;
  DiveSiteLink: string;
  Description: string ;
  InstructorLink: "Aaf485cf3-7e5c-4f3e-9c24-1694983820f2" ;
  Weather: ["10 mph East", "FullMoon","Windy", "high: 1.20m"]  ;
}


@Component({
  selector: 'app-log-dive',
  templateUrl: './log-dive.page.html',
  styleUrls: ['./log-dive.page.scss'],
})
export class LogDivePage implements OnInit {

  siteLst: DiveSite[] ;//= [{diveSite: "Carabean" },{diveSite: "Sodwana" },{diveSite: "Cape Town" } ];
  typeLst: DiveType[] ; //= [{diveType: "Lake" }, {diveType: "Reef" },{diveType: "Open Sea" },{diveType: "River" },{diveType: "Indoors" }];
  uuidValue:string;

  loginLabel:string ;
  constructor(private router: Router, private _diveService: diveService ) {}
  
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    this._diveService.getDiveSites().subscribe(
      data => {
          console.log(data);
          this.siteLst = data.DiveSiteList ; 
      }
    ); //end DiveSite req

    this._diveService.getDiveTypes().subscribe(
      data => {
          console.log(data);
          this.typeLst = data.DiveTypeList ; 
      }
    ); //end DiveType req


  } //end ngOnInit

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
    }
  }


  onSubmit(desc: string, siteOf:string, dateOf : string , timeI : string, timeO: string  , diveT: string, bud: string, vis: string, dep: string, aTemp: number, sTemp: number, bTemp: number,  event: Event) {
    event.preventDefault();
    localStorage.setItem('accessToken', 'test');

    //generate GUID
    this.uuidValue=UUID.UUID();


    if(localStorage.getItem('accessToken')) //if user signed in 
    {
            if( ( siteOf =="") || (dateOf=="") || ( timeI =="") ||( timeO =="") || ( diveT=="")  )
            {
              alert("Fill in al the fields");
            }
            else
            {
                  var log = {
                    DiveID: "D"+ this.uuidValue,
                    AccessToken : localStorage.getItem('accessToken'),
                    Approved: false,
                    DiveDate: dateOf ,
                    TimeIn: timeI ,
                    TimeOut: timeO ,
                    Visibility: vis + "m",
                    Depth: dep + "m",
                    Buddy: bud ,
                    DiveTypeLink: diveT   ,
                    AirTemp: Number(aTemp) ,
                    SurfaceTemp: Number(sTemp) ,
                    BottomTemp: Number(bTemp) ,
                    DiveSiteLink: siteOf,
                    Description: desc ,
                    InstructorLink: "Aaf485cf3-7e5c-4f3e-9c24-1694983820f2" ,
                    Weather: ["10 mph East", "FullMoon","Windy", "high: 1.20m"]  
                  } as DiveLog;
          
              console.log(log);
              this._diveService.logDive(log).subscribe( res =>{
                console.log(res.body);
                console.log("after body");
                location.reload();
                console.log("after nav");
              })
            }
    
  }else{
    alert("To Log dives first sign in to your account");
  }


  }


}
