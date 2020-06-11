import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';


export interface DiveType{
  diveType : string ;
}

export interface DiveSite{
  diveSite: string;
}

export interface DiveLog{
  AccessToken: string ; 
  Approved: boolean;
  DiveDate: string;
  TimeIn: string;
  TimeOut: string;
  Visibility:string;
  Depth: string;
  Buddy:string;
  DiveTypeLink: string;
  AirTemp: string;
  SurfaceTemp: string;
  BottomTemp: string;
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


  onSubmit(desc: string, siteOf:string, dateOf : string , timeI : string, timeO: string  , diveT: string, bud: string, vis: string, dep: string, aTemp: string, sTemp: string, bTemp: string,  event: Event) {
    event.preventDefault();
    if(localStorage.getItem('accessToken')) //if user signed in 
    {
            if( ( siteOf =="") || (dateOf=="") || ( timeI =="") ||( timeO =="") || ( diveT=="")  )
            {
              alert("Fill in al the fields");
            }
            else
            {
                  var log = {
                    AccessToken : localStorage.getItem('accessToken'),
                    Approved: false,
                    DiveDate: dateOf ,
                    TimeIn: timeI ,
                    TimeOut: timeO ,
                    Visibility: vis + "m",
                    Depth: dep + "m",
                    Buddy: bud ,
                    DiveTypeLink: diveT   ,
                    AirTemp: aTemp ,
                    SurfaceTemp: sTemp ,
                    BottomTemp: bTemp ,
                    DiveSiteLink: siteOf,
                    Description: desc ,
                    InstructorLink: "Aaf485cf3-7e5c-4f3e-9c24-1694983820f2" ,
                    Weather: ["10 mph East", "FullMoon","Windy", "high: 1.20m"]  
                  } as DiveLog;
          
              console.log(log);
              this._diveService.logDive(log) ;
            }
    
  }else{
    alert("To Log dives first sign in to your account");
  }


  }


}
