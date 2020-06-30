import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';
import { accountService } from '../service/account.service';
import { weatherService } from '../service/weather.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as CryptoJS from 'crypto-js';  
import { UUID } from 'angular2-uuid';


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
  DiveSite: string;
  Description: string ;
  InstructorLink: "-" ;
  Weather: ["10 mph East", "FullMoon","Windy", "high: 1.20m"]  ;
  DivePublicStatus: Boolean;
}


@Component({
  selector: 'app-log-dive',
  templateUrl: './log-dive.page.html',
  styleUrls: ['./log-dive.page.scss'],
})
export class LogDivePage implements OnInit {

   uuidValue:string;
   showLoading: Boolean;
    DiveTypeLst: [];
    DiveSiteLst: [];
    BuddyLst:[];
    cDate : Date; 
    currentDate : string ;
  
  //siteLst: DiveSite[] ;//= [{diveSite: "Carabean" },{diveSite: "Sodwana" },{diveSite: "Cape Town" } ];
  //typeLst: DiveType[] ; //= [{diveType: "Lake" }, {diveType: "Reef" },{diveType: "Open Sea" },{diveType: "River" },{diveType: "Indoors" }];
  Key = {
    "key": null
  };
  Coordinates ={
    Latitude: null,
    Longitude: null
  };
  loginLabel:string ;
  constructor(private _accountService : accountService, private router: Router, private _diveService: diveService, private _weatherService: weatherService,private geolocation: Geolocation ) {}
  
  ngOnInit() {
     this.cDate = new Date();
      var dd = String(this.cDate.getDate()).padStart(2, '0');
      var mm = String(this.cDate.getMonth() + 1).padStart(2, '0'); 
      var yyyy = this.cDate.getFullYear();

      this.currentDate =   yyyy + '-'+ mm + '-' + dd  ;
      console.log(this.currentDate);

    this.showLoading = true;
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

     this._diveService.getDiveSites("*").subscribe(
      data => {
          console.log(data);
          this.DiveSiteLst = data.ReturnedList ; 
          this.showLoading = false;
      }
    ); //end DiveSite req

    this._diveService.getDiveTypes("*").subscribe(
      data => {
          console.log(data);
          this.DiveTypeLst = data.ReturnedList ; 
          console.log("In type");
          this.showLoading = false;
      }
    ); //end DiveType req

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log("Getting Coordinates");
      this.Coordinates.Latitude = resp.coords.latitude;
      this.Coordinates.Longitude = resp.coords.longitude;
      console.log(this.Coordinates);

      this._weatherService.getLocationKey(this.Coordinates).subscribe(res => {
        console.log("Getting location key");
        this.Key.key = res.Key;
        console.log("getLocationKey returned: " + this.Key);
  
        this._weatherService.getLogWeather(this.Key).subscribe(res => {
        console.log("Getting weather information");
        console.log("Date: " + res.DailyForecasts[0].Date);
        console.log("Temperature Min: " + res.DailyForecasts[0].Temperature.Minimum.Value + res.DailyForecasts[0].Temperature.Minimum.Unit);
        console.log("Temperature Max: " + res.DailyForecasts[0].Temperature.Maximum.Value + res.DailyForecasts[0].Temperature.Maximum.Unit);
        console.log("Day Description: " + res.DailyForecasts[0].Day.IconPhrase);
        console.log("Night Description: " + res.DailyForecasts[0].Night.IconPhrase);
      });
      });

     }).catch((error) => {
       console.log('Error getting location', error);
     });

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


  onSubmit(pub: boolean, desc: string, siteOf:string, dateOf : string , timeI : string, timeO: string  , diveT: string, bud: string, vis: string, dep: string, aTemp: number, sTemp: number, bTemp: number,  event: Event) {
    event.preventDefault();

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
              if(bud == ""){
                bud = "-";
              }
              //Weather req
              this._weatherService.getLogWeather(siteOf).subscribe(res => {
                console.log(res);
                //var tempWeather: [] = [res.wind, res.moon, res.sunny, res.swell]
              });
              //logging the dive
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
                    DiveSite: siteOf,
                    Description: desc ,
                    InstructorLink: "-" ,
                    Weather: ["10 mph East", "FullMoon","Windy", "high: 1.20m"] ,
                    DivePublicStatus: pub
                  } as DiveLog;
          
              console.log(log);
              this.showLoading = true;
              this._diveService.logDive(log).subscribe( res =>{
                
                console.log(res);
                this.showLoading = false;
               // location.reload();
               this.router.navigate(['my-dives']);
                console.log("after nav");
              })
            }
    
  }else{
    alert("To Log dives first sign in to your account");
  }


  }


  buddyListFinder(eventValue: string){

     if(eventValue.length >= 2)
    {
        this.showLoading = true;
        this._accountService.lookAheadBuddy(eventValue).subscribe(
          data => {
            console.log(eventValue);
              console.log(data);
              this.BuddyLst = data.ReturnedList ; 
              this.showLoading = false;
          }
        ); //end Buddy req
    }

  }


}
