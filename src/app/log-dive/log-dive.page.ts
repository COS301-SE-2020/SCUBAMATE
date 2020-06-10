import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


export interface DiveType{
  diveType : string ;
}

export interface DiveSite{
  diveSite: string;
}

export interface DiveLog{
  DiveDate: string;
  TimeIn: string;
  TimeOut: string;
  Visibility:string;
  Depth: string;
  Buddy:string;
  DiveType: string;
  AirTemperature: string;
  SurfaceTemperature: string;
  BottomTemperature: string;
  DiveSite: string;
  Description: string ;
}


@Component({
  selector: 'app-log-dive',
  templateUrl: './log-dive.page.html',
  styleUrls: ['./log-dive.page.scss'],
})
export class LogDivePage implements OnInit {

  siteLst: DiveSite[] = [{diveSite: "Carabean" },{diveSite: "Sodwana" },{diveSite: "Cape Town" } ];
  typeLst: DiveType[] = [{diveType: "Lake" }, {diveType: "Reef" },{diveType: "Open Sea" },{diveType: "River" },{diveType: "Indoors" }];

  loginLabel:string ;
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }
  }

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

    if( ( siteOf =="") || (dateOf=="") || ( timeI =="") ||( timeO =="") || ( diveT=="")  )
    {
      alert("Fill in al the fields");
    }
    else
    {
      var log = {
        DiveDate: dateOf ,
        TimeIn: timeI ,
        TimeOut: timeO ,
        Visibility: vis ,
        Depth: dep ,
        Buddy: bud ,
        DiveType: diveT   ,
        AirTemperature: aTemp ,
        SurfaceTemperature: sTemp ,
        BottomTemperature: bTemp ,
        DiveSite: siteOf,
        Description: desc 
      } as DiveLog;
  
      console.log(log);
      // this._sbrandService.deleteBrand(t);
    }
    
  }





}
